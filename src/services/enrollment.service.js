import dbConnect from "@/lib/db";
import { Enrollment, Progress, Lesson, Certificate } from "@/models";
import { generateVerificationCode } from "@/utils";
import { COURSE_STATUS } from "@/constants";

export async function createEnrollment(studentId, { courseId, orderId = null, pricePaid = 0, enrollmentType = "paid", couponId = null }) {
  await dbConnect();
  const existing = await Enrollment.findOne({ studentId, courseId });
  if (existing) {
    return existing.toObject();
  }
  const course = await Lesson.aggregate([
    { $match: { courseId: courseId, isPublished: true } },
    { $count: "total" },
  ]);
  const totalLessons = course[0]?.total || 0;
  const enrollment = await Enrollment.create({
    studentId,
    courseId,
    orderId,
    pricePaid,
    enrollmentType,
    couponId,
    totalLessons,
  });
  return enrollment.toObject();
}

export async function getStudentEnrollments(studentId, { page = 1, limit = 10, isCompleted } = {}) {
  await dbConnect();
  const skip = (page - 1) * limit;
  const query = { studentId };
  if (typeof isCompleted !== "undefined") query.isCompleted = isCompleted;
  const [enrollments, total] = await Promise.all([
    Enrollment.find(query)
      .populate({
        path: "courseId",
        select: "title slug thumbnail instructorId rating reviewCount level language duration",
        populate: [
          { path: "instructorId", select: "name avatar" },
        ],
      })
      .sort({ lastAccessAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Enrollment.countDocuments(query),
  ]);
  return {
    enrollments,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getEnrollment(studentId, courseId) {
  await dbConnect();
  const enrollment = await Enrollment.findOne({ studentId, courseId })
    .populate({
      path: "courseId",
      populate: [
        { path: "instructorId", select: "name avatar bio" },
        { path: "categoryId", select: "name slug" },
      ],
    })
    .populate("certificateId")
    .lean();
  if (!enrollment) throw new Error("Enrollment not found");
  return enrollment;
}

export async function getCourseStudents(courseId, { page = 1, limit = 10, search } = {}) {
  await dbConnect();
  const skip = (page - 1) * limit;
  const query = { courseId };
  const [enrollments, total] = await Promise.all([
    Enrollment.find(query)
      .populate({
        path: "studentId",
        select: "name email avatar",
        match: search ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        } : {},
      })
      .sort({ enrolledAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Enrollment.countDocuments(query),
  ]);
  return {
    students: enrollments.filter((e) => e.studentId),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function updateLessonProgress(studentId, { courseId, lessonId, progressPercent, isCompleted, videoWatchedSeconds, videoTotalSeconds, lastPosition }) {
  await dbConnect();
  const enrollment = await Enrollment.findOne({ studentId, courseId });
  if (!enrollment) throw new Error("Not enrolled in this course");
  let progress = await Progress.findOne({ studentId, lessonId });
  if (!progress) {
    progress = new Progress({
      studentId,
      courseId,
      lessonId,
      moduleId: (await Lesson.findById(lessonId).select("moduleId"))?.moduleId,
    });
  }
  if (typeof progressPercent !== "undefined") progress.progressPercent = progressPercent;
  if (typeof isCompleted !== "undefined") progress.isCompleted = isCompleted;
  if (typeof videoWatchedSeconds !== "undefined") progress.videoWatchedSeconds = videoWatchedSeconds;
  if (typeof videoTotalSeconds !== "undefined") progress.videoTotalSeconds = videoTotalSeconds;
  if (typeof lastPosition !== "undefined") progress.lastPosition = lastPosition;
  if (isCompleted && !progress.completedAt) {
    progress.completedAt = new Date();
  }
  progress.attempts += 1;
  await progress.save();
  const completedCount = await Progress.countDocuments({
    studentId,
    courseId,
    isCompleted: true,
  });
  const totalLessons = enrollment.totalLessons || 1;
  const overallProgress = Math.round((completedCount / totalLessons) * 100);
  enrollment.lessonsCompleted = completedCount;
  enrollment.progress = overallProgress;
  enrollment.lastAccessAt = new Date();
  enrollment.lastLessonId = lessonId;
  if (overallProgress >= 100 && !enrollment.isCompleted) {
    enrollment.isCompleted = true;
    enrollment.completedAt = new Date();
  }
  await enrollment.save();
  if (enrollment.isCompleted && !enrollment.certificateId) {
    await issueCertificate(studentId, courseId, enrollment._id);
  }
  return {
    progress: progress.toObject(),
    enrollmentProgress: enrollment.progress,
    lessonsCompleted: enrollment.lessonsCompleted,
    totalLessons: enrollment.totalLessons,
    isCompleted: enrollment.isCompleted,
  };
}

export async function getCourseProgress(studentId, courseId) {
  await dbConnect();
  const enrollment = await Enrollment.findOne({ studentId, courseId });
  if (!enrollment) return { completedLessons: [], progress: 0, lessonsCompleted: 0, totalLessons: 0 };
  const completedLessons = await Progress.find({
    studentId,
    courseId,
    isCompleted: true,
  }).select("lessonId progressPercent completedAt").lean();
  const allProgress = await Progress.find({ studentId, courseId })
    .select("lessonId progressPercent isCompleted")
    .lean();
  return {
    enrollment,
    completedLessonIds: completedLessons.map((p) => p.lessonId.toString()),
    progressByLesson: Object.fromEntries(allProgress.map((p) => [p.lessonId.toString(), p])),
    progress: enrollment.progress,
    lessonsCompleted: enrollment.lessonsCompleted,
    totalLessons: enrollment.totalLessons,
    isCompleted: enrollment.isCompleted,
  };
}

export async function issueCertificate(studentId, courseId, enrollmentId) {
  await dbConnect();
  const enrollment = await Enrollment.findById(enrollmentId)
    .populate("courseId")
    .populate("studentId");
  if (!enrollment) throw new Error("Enrollment not found");
  const course = enrollment.courseId;
  const student = enrollment.studentId;
  const existing = await Certificate.findOne({ studentId, courseId });
  if (existing) return existing.toObject();
  const verificationCode = generateVerificationCode();
  const certificate = await Certificate.create({
    certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    verificationCode,
    studentId,
    courseId,
    enrollmentId,
    instructorId: course.instructorId,
    courseName: course.title,
    studentName: student.name,
    instructorName: course.instructorId?.name || "Instructor",
    completionDate: enrollment.completedAt || new Date(),
    progress: enrollment.progress,
    percentage: enrollment.progress,
  });
  await Enrollment.findByIdAndUpdate(enrollmentId, { certificateId: certificate._id });
  return certificate.toObject();
}

export async function verifyCertificate(verificationCode) {
  await dbConnect();
  const cert = await Certificate.findOne({ verificationCode, isRevoked: false })
    .populate("studentId", "name avatar email")
    .populate("courseId", "title thumbnail")
    .populate("instructorId", "name avatar")
    .lean();
  if (!cert) throw new Error("Certificate not found or has been revoked");
  await Certificate.findByIdAndUpdate(cert._id, { $inc: { verifiedCount: 1 } });
  return cert;
}

export async function getStudentCertificates(studentId, { page = 1, limit = 10 } = {}) {
  await dbConnect();
  const skip = (page - 1) * limit;
  const [certificates, total] = await Promise.all([
    Certificate.find({ studentId, isRevoked: false })
      .populate({
        path: "courseId",
        select: "title thumbnail slug instructorId",
        populate: { path: "instructorId", select: "name avatar" },
      })
      .sort({ issueDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Certificate.countDocuments({ studentId, isRevoked: false }),
  ]);
  return { certificates, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getCertificateById(certificateId, studentId) {
  await dbConnect();
  const cert = await Certificate.findById(certificateId)
    .populate("studentId", "name avatar")
    .populate("courseId", "title thumbnail slug")
    .populate("instructorId", "name avatar")
    .lean();
  if (!cert) throw new Error("Certificate not found");
  if (cert.studentId._id.toString() !== studentId) {
    throw new Error("This certificate does not belong to you");
  }
  return cert;
}

export async function adminGetAllEnrollments({ page = 1, limit = 10, search } = {}) {
  await dbConnect();
  const skip = (page - 1) * limit;
  const [enrollments, total] = await Promise.all([
    Enrollment.find()
      .populate("studentId", "name email avatar")
      .populate({
        path: "courseId",
        select: "title slug thumbnail",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Enrollment.countDocuments(),
  ]);
  return { enrollments, total, page, limit, totalPages: Math.ceil(total / limit) };
}
