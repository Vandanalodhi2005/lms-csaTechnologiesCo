import dbConnect from "@/lib/db";
import { Module, Lesson, Course } from "@/models";
import { canEditCourse } from "@/lib/permissions";
import { LESSON_TYPES } from "@/constants";

export async function createModule(user, data) {
  await dbConnect();
  const course = await Course.findById(data.courseId);
  if (!course) throw new Error("Course not found");
  if (!canEditCourse(user, course)) {
    throw new Error("You do not have permission to add modules to this course");
  }
  const maxOrder = await Module.findOne({ courseId: data.courseId }).sort({ order: -1 }).select("order");
  const nextOrder = maxOrder ? maxOrder.order + 1 : 0;
  const moduleDoc = await Module.create({
    ...data,
    order: nextOrder,
  });
  await Course.findByIdAndUpdate(data.courseId, { $inc: { moduleCount: 1 } });
  return moduleDoc.toObject();
}

export async function updateModule(user, moduleId, updates) {
  await dbConnect();
  const moduleDoc = await Module.findById(moduleId);
  if (!moduleDoc) throw new Error("Module not found");
  const course = await Course.findById(moduleDoc.courseId);
  if (!canEditCourse(user, course)) {
    throw new Error("You do not have permission to edit this module");
  }
  const updated = await Module.findByIdAndUpdate(moduleId, updates, {
    new: true,
    runValidators: true,
  });
  return updated.toObject();
}

export async function deleteModule(user, moduleId) {
  await dbConnect();
  const moduleDoc = await Module.findById(moduleId);
  if (!moduleDoc) throw new Error("Module not found");
  const course = await Course.findById(moduleDoc.courseId);
  if (!canEditCourse(user, course)) {
    throw new Error("You do not have permission to delete this module");
  }
  const lessonCount = moduleDoc.lessonCount || 0;
  await Lesson.deleteMany({ moduleId });
  await Module.findByIdAndDelete(moduleId);
  await Course.findByIdAndUpdate(moduleDoc.courseId, {
    $inc: { moduleCount: -1, lessonCount: -lessonCount },
  });
  return { success: true };
}

export async function getCourseCurriculum(courseId, includeUnpublished = false) {
  await dbConnect();
  const moduleQuery = includeUnpublished ? {} : { isPublished: true };
  const lessonQuery = includeUnpublished ? {} : { isPublished: true };
  const modules = await Module.find({ courseId, ...moduleQuery })
    .sort({ order: 1 })
    .lean();
  const moduleIds = modules.map((m) => m._id);
  const lessons = await Lesson.find({
    moduleId: { $in: moduleIds },
    ...lessonQuery,
  })
    .sort({ order: 1 })
    .select("-videoPublicId -pdfPublicId -audioPublicId")
    .lean();
  const lessonsByModule = {};
  for (const lesson of lessons) {
    const mid = lesson.moduleId.toString();
    if (!lessonsByModule[mid]) lessonsByModule[mid] = [];
    lessonsByModule[mid].push(lesson);
  }
  return modules.map((m) => ({
    ...m,
    lessons: lessonsByModule[m._id.toString()] || [],
  }));
}

export async function reorderModules(user, courseId, items) {
  await dbConnect();
  const course = await Course.findById(courseId);
  if (!canEditCourse(user, course)) {
    throw new Error("You do not have permission to reorder modules");
  }
  const operations = items.map(({ id, order }) => ({
    updateOne: {
      filter: { _id: id, courseId },
      update: { $set: { order } },
    },
  }));
  await Module.bulkWrite(operations);
  return { success: true };
}

export async function createLesson(user, data) {
  await dbConnect();
  const moduleDoc = await Module.findById(data.moduleId);
  if (!moduleDoc) throw new Error("Module not found");
  const course = await Course.findById(moduleDoc.courseId);
  if (!canEditCourse(user, course)) {
    throw new Error("You do not have permission to add lessons to this course");
  }
  const maxOrder = await Lesson.findOne({ moduleId: data.moduleId }).sort({ order: -1 }).select("order");
  const nextOrder = maxOrder ? maxOrder.order + 1 : 0;
  const lesson = await Lesson.create({
    ...data,
    courseId: moduleDoc.courseId,
    order: nextOrder,
  });
  await Module.findByIdAndUpdate(data.moduleId, { $inc: { lessonCount: 1 } });
  await Course.findByIdAndUpdate(moduleDoc.courseId, { $inc: { lessonCount: 1 } });
  return lesson.toObject();
}

export async function updateLesson(user, lessonId, updates) {
  await dbConnect();
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new Error("Lesson not found");
  const course = await Course.findById(lesson.courseId);
  if (!canEditCourse(user, course)) {
    throw new Error("You do not have permission to edit this lesson");
  }
  const updated = await Lesson.findByIdAndUpdate(lessonId, updates, {
    new: true,
    runValidators: true,
  });
  return updated.toObject();
}

export async function deleteLesson(user, lessonId) {
  await dbConnect();
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new Error("Lesson not found");
  const course = await Course.findById(lesson.courseId);
  if (!canEditCourse(user, course)) {
    throw new Error("You do not have permission to delete this lesson");
  }
  await Lesson.findByIdAndDelete(lessonId);
  await Module.findByIdAndUpdate(lesson.moduleId, { $inc: { lessonCount: -1 } });
  await Course.findByIdAndUpdate(lesson.courseId, { $inc: { lessonCount: -1 } });
  return { success: true };
}

export async function reorderLessons(user, moduleId, items) {
  await dbConnect();
  const moduleDoc = await Module.findById(moduleId);
  if (!moduleDoc) throw new Error("Module not found");
  const course = await Course.findById(moduleDoc.courseId);
  if (!canEditCourse(user, course)) {
    throw new Error("You do not have permission to reorder lessons");
  }
  const operations = items.map(({ id, order }) => ({
    updateOne: {
      filter: { _id: id, moduleId },
      update: { $set: { order } },
    },
  }));
  await Lesson.bulkWrite(operations);
  return { success: true };
}

export async function getLessonById(lessonId) {
  await dbConnect();
  const lesson = await Lesson.findById(lessonId)
    .select("-videoPublicId -pdfPublicId -audioPublicId")
    .lean();
  if (!lesson) throw new Error("Lesson not found");
  return lesson;
}

export async function getAdjacentLessons(courseId, lessonId) {
  await dbConnect();
  const curriculum = await getCourseCurriculum(courseId, true);
  const flatLessons = [];
  for (const m of curriculum) {
    for (const l of m.lessons) {
      flatLessons.push({ ...l, moduleName: m.title });
    }
  }
  const idx = flatLessons.findIndex((l) => l._id.toString() === lessonId.toString());
  if (idx === -1) return { prev: null, next: null, currentIndex: 0, total: flatLessons.length };
  return {
    prev: idx > 0 ? flatLessons[idx - 1] : null,
    next: idx < flatLessons.length - 1 ? flatLessons[idx + 1] : null,
    currentIndex: idx,
    total: flatLessons.length,
  };
}
