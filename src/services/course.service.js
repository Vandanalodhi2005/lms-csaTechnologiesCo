import dbConnect from "@/lib/db";
import { Course, Category } from "@/models";
import { slugify, paginate } from "@/utils";
import { COURSE_STATUS, ROLES, COURSE_LEVELS } from "@/constants";
import { canEditCourse, canViewCourse } from "@/lib/permissions";

export async function createCourse(user, data) {
  await dbConnect();
  const baseSlug = slugify(data.title);
  let slug = baseSlug;
  let counter = 1;
  while (await Course.exists({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }
  const course = await Course.create({
    ...data,
    slug,
    instructorId: user.id,
    status: COURSE_STATUS.DRAFT,
  });
  return course.toObject();
}

export async function updateCourse(user, courseId, updates) {
  await dbConnect();
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");
  if (!canEditCourse(user, course)) {
    throw new Error("You do not have permission to edit this course");
  }
  if (updates.title && updates.title !== course.title) {
    const baseSlug = slugify(updates.title);
    let slug = baseSlug;
    let counter = 1;
    while (await Course.exists({ slug, _id: { $ne: courseId } })) {
      slug = `${baseSlug}-${counter++}`;
    }
    updates.slug = slug;
  }
  const updated = await Course.findByIdAndUpdate(courseId, updates, {
    new: true,
    runValidators: true,
  });
  return updated.toObject();
}

export async function deleteCourse(user, courseId) {
  await dbConnect();
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");
  if (!canEditCourse(user, course)) {
    throw new Error("You do not have permission to delete this course");
  }
  await Course.findByIdAndDelete(courseId);
  return { success: true };
}

export async function getCourseBySlug(slug, user = null) {
  await dbConnect();
  const course = await Course.findOne({ slug })
    .populate({
      path: "instructorId",
      select: "name avatar bio stats",
    })
    .populate({
      path: "categoryId",
      select: "name slug",
    })
    .populate({
      path: "subcategoryId",
      select: "name slug",
    })
    .lean();
  if (!course) throw new Error("Course not found");
  if (!canViewCourse(user, course)) {
    throw new Error("Course not found");
  }
  return course;
}

export async function getCourseById(courseId, user = null) {
  await dbConnect();
  const course = await Course.findById(courseId)
    .populate({
      path: "instructorId",
      select: "name avatar bio",
    })
    .populate({
      path: "categoryId",
      select: "name slug",
    })
    .lean();
  if (!course) throw new Error("Course not found");
  if (!canViewCourse(user, course)) {
    throw new Error("You do not have permission to view this course");
  }
  return course;
}

export async function listCourses({
  q,
  category,
  subcategory,
  level,
  minPrice,
  maxPrice,
  minRating,
  language,
  duration,
  sort = "popular",
  page = 1,
  limit = 10,
  isFeatured,
  isFree,
  instructorId,
  status,
} = {}) {
  await dbConnect();
  const query = {};
  query.status = status || COURSE_STATUS.PUBLISHED;
  if (instructorId) query.instructorId = instructorId;
  if (q) {
    query.$text = { $search: q };
  }
  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) query.categoryId = cat._id;
  }
  if (subcategory) {
    const sub = await Category.findOne({ slug: subcategory });
    if (sub) query.subcategoryId = sub._id;
  }
  if (level && Object.values(COURSE_LEVELS).includes(level)) {
    query.level = level;
  }
  if (language) query.language = language;
  if (typeof minPrice !== "undefined" || typeof maxPrice !== "undefined") {
    query.$or = [
      {
        discountPrice: {
          ...(typeof minPrice !== "undefined" ? { $gte: minPrice } : {}),
          ...(typeof maxPrice !== "undefined" ? { $lte: maxPrice } : {}),
        },
      },
      {
        discountPrice: null,
        price: {
          ...(typeof minPrice !== "undefined" ? { $gte: minPrice } : {}),
          ...(typeof maxPrice !== "undefined" ? { $lte: maxPrice } : {}),
        },
      },
    ];
  }
  if (typeof minRating !== "undefined") {
    query.rating = { $gte: minRating };
  }
  if (isFeatured === "true" || isFeatured === true) {
    query.isFeatured = true;
  }
  if (isFree === "true" || isFree === true) {
    query.$or = [{ discountPrice: 0 }, { price: 0 }];
  }
  if (duration) {
    const durationRanges = {
      short: { duration: { $lte: 120 } },
      medium: { duration: { $gt: 120, $lte: 600 } },
      long: { duration: { $gt: 600 } },
    };
    Object.assign(query, durationRanges[duration] || {});
  }
  const sortConfig = {
    popular: { enrollmentCount: -1, rating: -1, createdAt: -1 },
    newest: { createdAt: -1 },
    rating: { rating: -1, reviewCount: -1 },
    price_low: {
      sortPrice: 1,
    },
    price_high: {
      sortPrice: -1,
    },
  };
  const pipeline = [
    {
      $addFields: {
        sortPrice: {
          $ifNull: ["$discountPrice", "$price"],
        },
      },
    },
    { $match: query },
  ];
  if (sort === "price_low" || sort === "price_high") {
    pipeline.push({ $sort: sortConfig[sort] });
  }
  const aggregation = Course.aggregate(pipeline);
  if (sort !== "price_low" && sort !== "price_high") {
    aggregation.sort(sortConfig[sort]);
  }
  const totalResults = await Course.countDocuments(query);
  const { skip, totalPages, currentPage } = paginate(totalResults, page, limit);
  const courses = await aggregation.skip(skip).limit(limit);
  await Course.populate(courses, [
    { path: "instructorId", select: "name avatar" },
    { path: "categoryId", select: "name slug" },
  ]);
  return {
    courses,
    total: totalResults,
    page: currentPage,
    limit,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

export async function getInstructorCourses(instructorId, { page = 1, limit = 10, status } = {}) {
  await dbConnect();
  const query = { instructorId };
  if (status) query.status = status;
  const skip = (page - 1) * limit;
  const [courses, total] = await Promise.all([
    Course.find(query)
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Course.countDocuments(query),
  ]);
  return { courses, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function submitCourseForReview(user, courseId) {
  await dbConnect();
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");
  if (!canEditCourse(user, course)) {
    throw new Error("You do not have permission to submit this course");
  }
  course.status = COURSE_STATUS.PENDING;
  course.submittedAt = new Date();
  await course.save();
  return course.toObject();
}

export async function adminUpdateCourseStatus(adminUser, courseId, { status, rejectionReason }) {
  await dbConnect();
  if (adminUser.role !== ROLES.ADMIN && adminUser.role !== ROLES.SUPER_ADMIN) {
    throw new Error("Insufficient permissions");
  }
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");
  course.status = status;
  if (status === COURSE_STATUS.PUBLISHED) {
    course.approvedAt = new Date();
    course.approvedBy = adminUser.id;
  }
  if (status === COURSE_STATUS.REJECTED && rejectionReason) {
    course.rejectionReason = rejectionReason;
  }
  await course.save();
  return course.toObject();
}

export async function getRelatedCourses(courseId, limit = 4) {
  await dbConnect();
  const course = await Course.findById(courseId);
  if (!course) return [];
  const courses = await Course.find({
    _id: { $ne: courseId },
    status: COURSE_STATUS.PUBLISHED,
    $or: [{ categoryId: course.categoryId }, { tags: { $in: course.tags || [] } }],
  })
    .populate("instructorId", "name avatar")
    .populate("categoryId", "name slug")
    .sort({ enrollmentCount: -1, rating: -1 })
    .limit(limit)
    .lean();
  return courses;
}

export async function getPopularCourses(limit = 8) {
  await dbConnect();
  return Course.find({ status: COURSE_STATUS.PUBLISHED })
    .populate("instructorId", "name avatar")
    .populate("categoryId", "name slug")
    .sort({ enrollmentCount: -1, rating: -1 })
    .limit(limit)
    .lean();
}

export async function getFeaturedCourses(limit = 8) {
  await dbConnect();
  return Course.find({ status: COURSE_STATUS.PUBLISHED, isFeatured: true })
    .populate("instructorId", "name avatar")
    .populate("categoryId", "name slug")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function getNewestCourses(limit = 8) {
  await dbConnect();
  return Course.find({ status: COURSE_STATUS.PUBLISHED })
    .populate("instructorId", "name avatar")
    .populate("categoryId", "name slug")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function createCategory(data) {
  await dbConnect();
  const baseSlug = slugify(data.name);
  let slug = baseSlug;
  let counter = 1;
  while (await Category.exists({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }
  const category = await Category.create({ ...data, slug });
  return category.toObject();
}

export async function getAllCategories() {
  await dbConnect();
  const categories = await Category.find({ isActive: true })
    .sort({ sortOrder: 1, courseCount: -1, name: 1 })
    .lean();
  return categories;
}

export async function getCategoryBySlug(slug) {
  await dbConnect();
  const category = await Category.findOne({ slug, isActive: true }).lean();
  if (!category) throw new Error("Category not found");
  const subcategories = await Category.find({
    parentId: category._id,
    isActive: true,
  }).lean();
  return { ...category, subcategories };
}
