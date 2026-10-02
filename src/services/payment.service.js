import dbConnect from "@/lib/db";
import Razorpay from "razorpay";
import crypto from "crypto";
import {
  Order,
  Payment,
  Coupon,
  Enrollment,
  Course,
  Review,
  Wishlist,
  Notification,
} from "@/models";
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  NOTIFICATION_TYPES,
  ROLES,
  COURSE_STATUS,
} from "@/constants";
import { generateOrderNumber, calculateDiscountPercentage } from "@/utils";
import { createEnrollment } from "./enrollment.service";

let razorpayInstance = null;
function getRazorpay() {
  if (!razorpayInstance && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

export async function validateCoupon(code, courseId, studentId) {
  await dbConnect();
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) throw new Error("Invalid coupon code");
  if (coupon.validUntil && new Date() > new Date(coupon.validUntil)) {
    throw new Error("Coupon has expired");
  }
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit reached");
  }
  const userCount = coupon.usedBy?.filter((u) => u.userId.toString() === studentId).length || 0;
  if (userCount >= coupon.perUserLimit) {
    throw new Error("You have already used this coupon");
  }
  if (coupon.applicableCourses?.length > 0) {
    if (!coupon.applicableCourses.some((c) => c.toString() === courseId.toString())) {
      throw new Error("Coupon is not applicable to this course");
    }
  }
  if (coupon.excludeCourses?.length > 0) {
    if (coupon.excludeCourses.some((c) => c.toString() === courseId.toString())) {
      throw new Error("Coupon is not applicable to this course");
    }
  }
  return coupon;
}

export async function calculateCouponDiscount(coupon, originalAmount) {
  let discount = 0;
  if (coupon.type === "percentage") {
    discount = Math.round((originalAmount * coupon.value) / 100);
    if (coupon.maxDiscountAmount) {
      discount = Math.min(discount, coupon.maxDiscountAmount);
    }
  } else if (coupon.type === "fixed") {
    discount = coupon.value;
  }
  discount = Math.min(discount, originalAmount);
  return discount;
}

export async function createOrder(studentId, { courseId, couponCode, paymentMethod = PAYMENT_METHODS.RAZORPAY, billingDetails }) {
  await dbConnect();
  const course = await Course.findOne({
    _id: courseId,
    status: COURSE_STATUS.PUBLISHED,
  });
  if (!course) throw new Error("Course not found or not available for purchase");
  const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
  if (existingEnrollment) {
    throw new Error("You are already enrolled in this course");
  }
  const existing = await Order.findOne({
    studentId,
    courseId,
    status: { $in: [ORDER_STATUS.PENDING, ORDER_STATUS.PAID] },
  });
  if (existing?.status === ORDER_STATUS.PAID) {
    throw new Error("You have already purchased this course");
  }
  if (existing?.status === ORDER_STATUS.PENDING) {
    return existing.toObject();
  }
  const originalAmount = course.discountPrice != null ? course.discountPrice : course.price;
  let couponDiscount = 0;
  let coupon = null;
  if (couponCode) {
    try {
      coupon = await validateCoupon(couponCode, courseId, studentId);
      couponDiscount = await calculateCouponDiscount(coupon, originalAmount);
      if (coupon.minOrderAmount && originalAmount < coupon.minOrderAmount) {
        throw new Error(`Minimum order amount for this coupon is ${coupon.minOrderAmount}`);
      }
    } catch (e) {
      coupon = null;
      couponDiscount = 0;
    }
  }
  const discountAmount = couponDiscount;
  const totalAmount = Math.max(0, originalAmount - discountAmount);
  const orderNumber = generateOrderNumber();
  const platformFeePercent = 10;
  const platformFee = Math.round((totalAmount * platformFeePercent) / 100);
  const instructorRevenue = totalAmount - platformFee;
  const order = await Order.create({
    orderNumber,
    studentId,
    courseId,
    instructorId: course.instructorId,
    items: [
      {
        type: "course",
        itemId: course._id,
        name: course.title,
        price: originalAmount,
        quantity: 1,
        thumbnail: course.thumbnail,
      },
    ],
    couponId: coupon?._id || null,
    couponCode: coupon?.code || null,
    couponDiscount,
    originalAmount,
    discountAmount,
    totalAmount,
    currency: "INR",
    status: ORDER_STATUS.PENDING,
    paymentMethod,
    billingDetails,
    instructorRevenue,
    platformFee,
    platformFeePercent,
  });
  let gatewayOrderId = null;
  if (totalAmount > 0) {
    const rzp = getRazorpay();
    if (rzp) {
      const rzpOrder = await rzp.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: orderNumber,
        notes: {
          orderId: order._id.toString(),
          orderNumber,
          courseId: course._id.toString(),
          studentId,
        },
      });
      gatewayOrderId = rzpOrder.id;
      order.gatewayOrderId = gatewayOrderId;
      await order.save();
    }
  } else {
    await processFreeOrder(order._id);
  }
  return { ...order.toObject(), gatewayOrderId, razorpayKey: process.env.RAZORPAY_KEY_ID };
}

export async function processFreeOrder(orderId) {
  await dbConnect();
  const order = await Order.findById(orderId);
  if (!order) return;
  order.status = ORDER_STATUS.PAID;
  order.paidAt = new Date();
  order.enrollmentCreated = true;
  await order.save();
  const enrollment = await createEnrollment(order.studentId.toString(), {
    courseId: order.courseId.toString(),
    orderId: order._id,
    pricePaid: 0,
    enrollmentType: order.couponId ? "coupon" : "free",
    couponId: order.couponId,
  });
  order.enrollmentId = enrollment._id;
  await order.save();
  if (order.couponId) {
    await Coupon.findByIdAndUpdate(order.couponId, {
      $inc: { usageCount: 1 },
      $push: { usedBy: { userId: order.studentId, usedAt: new Date() } },
    });
  }
  await Course.findByIdAndUpdate(order.courseId, {
    $inc: { enrollmentCount: 1, totalRevenue: order.totalAmount },
  });
}

export async function verifyPayment(studentId, { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  await dbConnect();
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");
  if (order.studentId.toString() !== studentId) {
    throw new Error("This order does not belong to you");
  }
  if (order.status === ORDER_STATUS.PAID) {
    return { success: true, alreadyPaid: true, enrollmentId: order.enrollmentId };
  }
  if (razorpay_signature && process.env.RAZORPAY_KEY_SECRET) {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
    if (expectedSignature !== razorpay_signature) {
      order.status = ORDER_STATUS.FAILED;
      order.failedAttempts = (order.failedAttempts || 0) + 1;
      order.lastAttemptAt = new Date();
      await order.save();
      throw new Error("Payment verification failed: invalid signature");
    }
  }
  order.status = ORDER_STATUS.PAID;
  order.paidAt = new Date();
  order.gatewayPaymentId = razorpay_payment_id || order.gatewayPaymentId;
  order.gatewaySignature = razorpay_signature || order.gatewaySignature;
  order.gatewayOrderId = razorpay_order_id || order.gatewayOrderId;
  await order.save();
  await Payment.create({
    orderId: order._id,
    orderNumber: order.orderNumber,
    studentId: order.studentId,
    courseId: order.courseId,
    method: PAYMENT_METHODS.RAZORPAY,
    status: PAYMENT_STATUS.SUCCESS,
    amount: order.totalAmount,
    currency: order.currency,
    gatewayOrderId: order.gatewayOrderId,
    gatewayPaymentId: order.gatewayPaymentId,
    gatewaySignature: order.gatewaySignature,
    paymentDate: order.paidAt,
  });
  let enrollment;
  if (!order.enrollmentCreated) {
    enrollment = await createEnrollment(order.studentId.toString(), {
      courseId: order.courseId.toString(),
      orderId: order._id,
      pricePaid: order.totalAmount,
      enrollmentType: "paid",
      couponId: order.couponId,
    });
    order.enrollmentId = enrollment._id;
    order.enrollmentCreated = true;
    await order.save();
  }
  if (order.couponId) {
    await Coupon.findByIdAndUpdate(order.couponId, {
      $inc: { usageCount: 1 },
      $push: { usedBy: { userId: order.studentId, usedAt: new Date() } },
    });
  }
  await Course.findByIdAndUpdate(order.courseId, {
    $inc: { enrollmentCount: 1, totalRevenue: order.totalAmount },
  });
  await Notification.create({
    recipientId: order.instructorId,
    senderId: order.studentId,
    type: NOTIFICATION_TYPES.ENROLLMENT,
    title: "New Enrollment!",
    message: `A student enrolled in your course. Revenue: ${order.instructorRevenue}`,
    entityType: "order",
    entityId: order._id,
    actionUrl: `/instructor/courses/${order.courseId}/students`,
  });
  await Notification.create({
    recipientId: order.studentId,
    type: NOTIFICATION_TYPES.PAYMENT_SUCCESS,
    title: "Payment Successful",
    message: "You have successfully enrolled in the course",
    entityType: "order",
    entityId: order._id,
    actionUrl: `/student/learning/${order.courseId}`,
  });
  return { success: true, enrollmentId: order.enrollmentId };
}

export async function handleRazorpayWebhook(payload, signature) {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) return { success: false };
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest("hex");
  if (expectedSignature !== signature) return { verified: false };
  const event = payload.event;
  const entity = payload.payload?.payment?.entity || payload.payload?.order?.entity;
  if (event === "payment.captured") {
    const orderNumber = entity.notes?.orderNumber || entity.receipt;
    await Payment.updateOne(
      { gatewayPaymentId: entity.id },
      {
        $set: {
          webhookVerified: true,
          webhookReceivedAt: new Date(),
          amount: entity.amount / 100,
          method: entity.method,
          bank: entity.bank,
          wallet: entity.wallet,
          methodType: entity.method,
          gateway: "razorpay",
        },
      },
      { upsert: true }
    );
  } else if (event === "payment.failed") {
    await Order.updateOne(
      { gatewayOrderId: entity.order_id },
      {
        $inc: { failedAttempts: 1 },
        $set: { lastAttemptAt: new Date() },
      }
    );
  } else if (event === "refund.processed") {
    await Payment.updateOne(
      { gatewayPaymentId: entity.payment_id },
      {
        $set: {
          status: PAYMENT_STATUS.REFUNDED,
          refundedAt: new Date(),
          refundAmount: entity.amount / 100,
          gatewayRefundId: entity.id,
        },
      }
    );
  }
  return { verified: true, event };
}

export async function createCoupon(adminUser, data) {
  await dbConnect();
  if (adminUser.role !== ROLES.ADMIN && adminUser.role !== ROLES.SUPER_ADMIN) {
    throw new Error("Insufficient permissions");
  }
  const existing = await Coupon.findOne({ code: data.code.toUpperCase() });
  if (existing) throw new Error("A coupon with this code already exists");
  const coupon = await Coupon.create({ ...data, createdBy: adminUser.id });
  return coupon.toObject();
}

export async function updateCoupon(adminUser, couponId, updates) {
  await dbConnect();
  if (adminUser.role !== ROLES.ADMIN && adminUser.role !== ROLES.SUPER_ADMIN) {
    throw new Error("Insufficient permissions");
  }
  const coupon = await Coupon.findByIdAndUpdate(couponId, updates, {
    new: true,
    runValidators: true,
  });
  if (!coupon) throw new Error("Coupon not found");
  return coupon.toObject();
}

export async function getAllCoupons(adminUser, { page = 1, limit = 10, isActive } = {}) {
  await dbConnect();
  if (adminUser.role !== ROLES.ADMIN && adminUser.role !== ROLES.SUPER_ADMIN) {
    throw new Error("Insufficient permissions");
  }
  const skip = (page - 1) * limit;
  const query = {};
  if (typeof isActive !== "undefined") query.isActive = isActive;
  const [coupons, total] = await Promise.all([
    Coupon.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Coupon.countDocuments(query),
  ]);
  return { coupons, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function createReview(studentId, { courseId, rating, title, comment, isAnonymous }) {
  await dbConnect();
  const enrollment = await Enrollment.findOne({ studentId, courseId });
  if (!enrollment) throw new Error("You must be enrolled in this course to leave a review");
  const existing = await Review.findOne({ studentId, courseId });
  if (existing) {
    existing.rating = rating;
    if (typeof title !== "undefined") existing.title = title;
    if (typeof comment !== "undefined") existing.comment = comment;
    if (typeof isAnonymous !== "undefined") existing.isAnonymous = isAnonymous;
    await existing.save();
    await updateCourseRating(courseId);
    return existing.toObject();
  }
  const review = await Review.create({
    courseId,
    studentId,
    enrollmentId: enrollment._id,
    rating,
    title,
    comment,
    isAnonymous,
  });
  await updateCourseRating(courseId);
  const course = await Course.findById(courseId);
  if (course) {
    await Notification.create({
      recipientId: course.instructorId,
      senderId: studentId,
      type: NOTIFICATION_TYPES.NEW_REVIEW,
      title: "New Course Review",
      message: `${isAnonymous ? "A student" : "Someone"} gave your course ${rating} stars`,
      entityType: "review",
      entityId: review._id,
      actionUrl: `/instructor/courses/${courseId}/reviews`,
    });
  }
  return review.toObject();
}

async function updateCourseRating(courseId) {
  const result = await Review.aggregate([
    { $match: { courseId: courseId, isApproved: true } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);
  const avgRating = result[0]?.avgRating || 0;
  const count = result[0]?.count || 0;
  await Course.findByIdAndUpdate(courseId, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: count,
  });
}

export async function getCourseReviews(courseId, { page = 1, limit = 10, rating } = {}) {
  await dbConnect();
  const skip = (page - 1) * limit;
  const query = { courseId, isApproved: true };
  if (rating) query.rating = Number(rating);
  const [reviews, total] = await Promise.all([
    Review.find(query)
      .populate({
        path: "studentId",
        select: "name avatar",
      })
      .sort({ helpfulCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(query),
  ]);
  const ratingStats = await Review.aggregate([
    { $match: { courseId: courseId, isApproved: true } },
    {
      $group: {
        _id: "$rating",
        count: { $sum: 1 },
      },
    },
  ]);
  const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of ratingStats) {
    if (r._id >= 1 && r._id <= 5) stats[r._id] = r.count;
  }
  return { reviews, total, page, limit, totalPages: Math.ceil(total / limit), ratingBreakdown: stats };
}

export async function getWishlist(studentId, { page = 1, limit = 10 } = {}) {
  await dbConnect();
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Wishlist.find({ studentId })
      .populate({
        path: "courseId",
        match: { status: COURSE_STATUS.PUBLISHED },
        select:
          "title slug thumbnail shortDescription instructorId categoryId price discountPrice rating reviewCount enrollmentCount level language duration",
        populate: [
          { path: "instructorId", select: "name avatar" },
          { path: "categoryId", select: "name slug" },
        ],
      })
      .sort({ addedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Wishlist.countDocuments({ studentId }),
  ]);
  return {
    wishlist: items.filter((i) => i.courseId),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function addToWishlist(studentId, courseId) {
  await dbConnect();
  const course = await Course.findOne({ _id: courseId, status: COURSE_STATUS.PUBLISHED });
  if (!course) throw new Error("Course not found");
  const existing = await Wishlist.findOne({ studentId, courseId });
  if (existing) return { alreadyInWishlist: true, wishlist: existing.toObject() };
  const item = await Wishlist.create({ studentId, courseId });
  return { alreadyInWishlist: false, wishlist: item.toObject() };
}

export async function removeFromWishlist(studentId, courseId) {
  await dbConnect();
  await Wishlist.findOneAndDelete({ studentId, courseId });
  return { success: true };
}

export async function isInWishlist(studentId, courseId) {
  await dbConnect();
  return !!(await Wishlist.exists({ studentId, courseId }));
}

export async function refundOrder(adminUser, { orderId, refundAmount, refundReason }) {
  await dbConnect();
  if (adminUser.role !== ROLES.ADMIN && adminUser.role !== ROLES.SUPER_ADMIN) {
    throw new Error("Insufficient permissions");
  }
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");
  if (order.status !== ORDER_STATUS.PAID) throw new Error("Only paid orders can be refunded");
  const amountToRefund = refundAmount || order.totalAmount;
  if (amountToRefund > order.totalAmount) throw new Error("Refund amount exceeds order total");
  order.status = ORDER_STATUS.REFUNDED;
  order.refundedAt = new Date();
  order.refundAmount = amountToRefund;
  order.refundReason = refundReason;
  await order.save();
  await Payment.updateOne(
    { orderId, status: PAYMENT_STATUS.SUCCESS },
    {
      status: PAYMENT_STATUS.REFUNDED,
      refundedAt: new Date(),
      refundAmount: amountToRefund,
    }
  );
  await Enrollment.findOneAndDelete({ orderId });
  await Course.findByIdAndUpdate(order.courseId, {
    $inc: { enrollmentCount: -1, totalRevenue: -amountToRefund },
  });
  return order.toObject();
}

export async function adminGetAllOrders({ page = 1, limit = 10, status, search } = {}) {
  await dbConnect();
  const skip = (page - 1) * limit;
  const query = {};
  if (status) query.status = status;
  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate("studentId", "name email avatar")
      .populate({
        path: "courseId",
        select: "title slug thumbnail",
        match: search
          ? { title: { $regex: search, $options: "i" } }
          : {},
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(query),
  ]);
  return { orders: orders.filter((o) => o.courseId), total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getStudentOrders(studentId, { page = 1, limit = 10 } = {}) {
  await dbConnect();
  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find({ studentId })
      .populate({
        path: "courseId",
        select: "title slug thumbnail",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments({ studentId }),
  ]);
  return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getPlatformAnalytics() {
  await dbConnect();
  const [
    totalStudents,
    totalInstructors,
    totalCourses,
    publishedCourses,
    pendingCourses,
    totalRevenue,
    totalEnrollments,
    last30DaysRevenue,
    last30DaysEnrollments,
  ] = await Promise.all([
    User.countDocuments({ role: ROLES.STUDENT }),
    User.countDocuments({ role: ROLES.INSTRUCTOR }),
    Course.countDocuments(),
    Course.countDocuments({ status: COURSE_STATUS.PUBLISHED }),
    Course.countDocuments({ status: COURSE_STATUS.PENDING }),
    Order.aggregate([{ $match: { status: ORDER_STATUS.PAID } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
    Enrollment.countDocuments(),
    Order.aggregate([
      { $match: { status: ORDER_STATUS.PAID, createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    Enrollment.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
  ]);
  const now = new Date();
  const last12Months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    last12Months.push({ start: d, end: next, label: d.toLocaleString("default", { month: "short" }) });
  }
  const revenueMonthly = await Promise.all(
    last12Months.map(({ start, end, label }) =>
      Order.aggregate([
        { $match: { status: ORDER_STATUS.PAID, paidAt: { $gte: start, $lt: end } } },
        { $group: { _id: null, revenue: { $sum: "$totalAmount" } } },
      ]).then((r) => ({ label, value: r[0]?.revenue || 0 }))
    )
  );
  const enrollmentMonthly = await Promise.all(
    last12Months.map(({ start, end, label }) =>
      Enrollment.countDocuments({ createdAt: { $gte: start, $lt: end } }).then((count) => ({
        label,
        value: count,
      }))
    )
  );
  const popularCourses = await Course.find({ status: COURSE_STATUS.PUBLISHED })
    .sort({ enrollmentCount: -1 })
    .limit(5)
    .select("title slug thumbnail enrollmentCount rating")
    .lean();
  return {
    totalStudents,
    totalInstructors,
    totalCourses,
    publishedCourses,
    pendingCourses,
    totalRevenue: totalRevenue[0]?.total || 0,
    totalEnrollments,
    last30DaysRevenue: last30DaysRevenue[0]?.total || 0,
    last30DaysEnrollments,
    revenueMonthly,
    enrollmentMonthly,
    popularCourses,
  };
}

import { User } from "@/models";
