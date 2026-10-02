import dbConnect from "@/lib/db";
import { Assignment, Submission, Course, Enrollment, Notification } from "@/models";
import { canEditCourse } from "@/lib/permissions";
import { SUBMISSION_STATUS, NOTIFICATION_TYPES, ROLES } from "@/constants";

export async function createAssignment(user, data) {
  await dbConnect();
  const course = await Course.findById(data.courseId);
  if (!course) throw new Error("Course not found");
  if (!canEditCourse(user, course)) {
    throw new Error("You do not have permission to create assignments");
  }
  const assignment = await Assignment.create({
    ...data,
    instructorId: user.id,
  });
  return assignment.toObject();
}

export async function updateAssignment(user, assignmentId, updates) {
  await dbConnect();
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) throw new Error("Assignment not found");
  const course = await Course.findById(assignment.courseId);
  if (!canEditCourse(user, course)) {
    throw new Error("You do not have permission to edit this assignment");
  }
  if (updates.isPublished && !assignment.isPublished) {
    updates.publishedAt = new Date();
  }
  const updated = await Assignment.findByIdAndUpdate(assignmentId, updates, {
    new: true,
    runValidators: true,
  });
  return updated.toObject();
}

export async function deleteAssignment(user, assignmentId) {
  await dbConnect();
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) throw new Error("Assignment not found");
  const course = await Course.findById(assignment.courseId);
  if (!canEditCourse(user, course)) {
    throw new Error("You do not have permission to delete this assignment");
  }
  await Submission.deleteMany({ assignmentId });
  await Assignment.findByIdAndDelete(assignmentId);
  return { success: true };
}

export async function getAssignmentById(assignmentId) {
  await dbConnect();
  const assignment = await Assignment.findById(assignmentId)
    .populate("instructorId", "name avatar")
    .lean();
  if (!assignment) throw new Error("Assignment not found");
  return assignment;
}

export async function getCourseAssignments(courseId, includeUnpublished = false) {
  await dbConnect();
  const query = { courseId };
  if (!includeUnpublished) query.isPublished = true;
  const assignments = await Assignment.find(query).sort({ deadline: 1, createdAt: -1 }).lean();
  return assignments;
}

export async function getInstructorAssignments(instructorId, { page = 1, limit = 10 } = {}) {
  await dbConnect();
  const skip = (page - 1) * limit;
  const [assignments, total] = await Promise.all([
    Assignment.find({ instructorId })
      .populate({
        path: "courseId",
        select: "title slug thumbnail",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Assignment.countDocuments({ instructorId }),
  ]);
  return { assignments, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function submitAssignment(studentId, { assignmentId, content, files }) {
  await dbConnect();
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) throw new Error("Assignment not found");
  const enrollment = await Enrollment.findOne({ studentId, courseId: assignment.courseId });
  if (!enrollment) throw new Error("You must be enrolled in this course to submit assignments");
  const existingSubmission = await Submission.findOne({ studentId, assignmentId }).sort({
    attemptNumber: -1,
  });
  const nextAttempt = existingSubmission ? existingSubmission.attemptNumber + 1 : 1;
  if (!assignment.allowResubmission && existingSubmission) {
    throw new Error("Resubmissions are not allowed for this assignment");
  }
  if (assignment.maxAttempts > 0 && nextAttempt > assignment.maxAttempts) {
    throw new Error("You have exceeded the maximum number of attempts");
  }
  const isLate = assignment.deadline && new Date() > new Date(assignment.deadline);
  if (isLate && !assignment.allowLateSubmission) {
    throw new Error("The deadline for this assignment has passed");
  }
  const submission = await Submission.create({
    assignmentId,
    studentId,
    courseId: assignment.courseId,
    attemptNumber: nextAttempt,
    status: SUBMISSION_STATUS.SUBMITTED,
    isLate,
    content,
    files,
  });
  await Assignment.findByIdAndUpdate(assignmentId, { $inc: { totalSubmissions: 1 } });
  await Notification.create({
    recipientId: assignment.instructorId,
    senderId: studentId,
    type: NOTIFICATION_TYPES.GENERAL,
    title: "New Assignment Submission",
    message: `A student submitted assignment: ${assignment.title}`,
    entityType: "submission",
    entityId: submission._id,
    actionUrl: `/instructor/assignments/${assignmentId}`,
  });
  return submission.toObject();
}

export async function gradeSubmission(graderUser, { submissionId, obtainedMarks, feedback, rubricScores }) {
  await dbConnect();
  const submission = await Submission.findById(submissionId);
  if (!submission) throw new Error("Submission not found");
  const assignment = await Assignment.findById(submission.assignmentId);
  if (!assignment) throw new Error("Assignment not found");
  const course = await Course.findById(assignment.courseId);
  if (!canEditCourse(graderUser, course) && graderUser.role !== ROLES.ADMIN && graderUser.role !== ROLES.SUPER_ADMIN) {
    throw new Error("You do not have permission to grade this submission");
  }
  const maxMarks = assignment.maxMarks;
  if (obtainedMarks > maxMarks) {
    throw new Error(`Obtained marks cannot exceed maximum marks of ${maxMarks}`);
  }
  if (submission.isLate && assignment.lateSubmissionPenalty > 0) {
    const penalty = (assignment.lateSubmissionPenalty / 100) * maxMarks;
    obtainedMarks = Math.max(0, obtainedMarks - penalty);
  }
  const percentage = Math.round((obtainedMarks / maxMarks) * 100);
  submission.gradedAt = new Date();
  submission.gradedBy = graderUser.id;
  submission.obtainedMarks = obtainedMarks;
  submission.maxMarks = maxMarks;
  submission.percentage = percentage;
  submission.feedback = feedback;
  submission.rubricScores = rubricScores || [];
  submission.status = SUBMISSION_STATUS.GRADED;
  await submission.save();
  const gradedCount = await Submission.countDocuments({
    assignmentId: assignment._id,
    status: SUBMISSION_STATUS.GRADED,
  });
  assignment.gradedSubmissions = gradedCount;
  const avgResult = await Submission.aggregate([
    { $match: { assignmentId: assignment._id, status: SUBMISSION_STATUS.GRADED } },
    { $group: { _id: null, avg: { $avg: "$percentage" } } },
  ]);
  assignment.averageGrade = avgResult[0]?.avg || 0;
  await assignment.save();
  await Notification.create({
    recipientId: submission.studentId,
    senderId: graderUser.id,
    type: NOTIFICATION_TYPES.ASSIGNMENT_GRADED,
    title: "Assignment Graded",
    message: `Your assignment "${assignment.title}" has been graded: ${percentage}%`,
    entityType: "submission",
    entityId: submission._id,
    actionUrl: `/student/assignments/${assignmentId}`,
  });
  return submission.toObject();
}

export async function getAssignmentSubmissions(assignmentId, user, { page = 1, limit = 10, status, search } = {}) {
  await dbConnect();
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) throw new Error("Assignment not found");
  const course = await Course.findById(assignment.courseId);
  if (!canEditCourse(user, course) && user.role !== ROLES.ADMIN) {
    throw new Error("You do not have permission to view submissions");
  }
  const skip = (page - 1) * limit;
  const query = { assignmentId };
  if (status) query.status = status;
  const [submissions, total] = await Promise.all([
    Submission.find(query)
      .populate({
        path: "studentId",
        select: "name email avatar",
        match: search
          ? {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
              ],
            }
          : {},
      })
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Submission.countDocuments(query),
  ]);
  return {
    submissions: submissions.filter((s) => s.studentId),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getStudentSubmissions(studentId, { page = 1, limit = 10 } = {}) {
  await dbConnect();
  const skip = (page - 1) * limit;
  const [submissions, total] = await Promise.all([
    Submission.find({ studentId })
      .populate({
        path: "assignmentId",
        select: "title deadline maxMarks courseId",
        populate: { path: "courseId", select: "title slug" },
      })
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Submission.countDocuments({ studentId }),
  ]);
  return { submissions, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getStudentAssignmentSubmission(studentId, assignmentId) {
  await dbConnect();
  const submission = await Submission.findOne({ studentId, assignmentId })
    .sort({ attemptNumber: -1 })
    .populate({
      path: "gradedBy",
      select: "name avatar",
    })
    .lean();
  return submission;
}

export async function getStudentAssignments(studentId, { page = 1, limit = 10 } = {}) {
  await dbConnect();
  const skip = (page - 1) * limit;
  const enrollments = await Enrollment.find({ studentId }).select("courseId");
  const courseIds = enrollments.map((e) => e.courseId);
  const query = { courseId: { $in: courseIds }, isPublished: true };
  const [assignments, total] = await Promise.all([
    Assignment.find(query)
      .populate({
        path: "courseId",
        select: "title slug thumbnail",
      })
      .populate("instructorId", "name avatar")
      .sort({ deadline: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Assignment.countDocuments(query),
  ]);
  const submissions = await Submission.find({
    studentId,
    assignmentId: { $in: assignments.map((a) => a._id) },
  }).sort({ attemptNumber: -1 });
  const submissionMap = new Map();
  for (const s of submissions) {
    submissionMap.set(s.assignmentId.toString(), s);
  }
  const withStatus = assignments.map((a) => ({
    ...a,
    submission: submissionMap.get(a._id.toString()) || null,
    isSubmitted: submissionMap.has(a._id.toString()),
    isGraded: submissionMap.get(a._id.toString())?.status === SUBMISSION_STATUS.GRADED,
    isOverdue: a.deadline && new Date() > new Date(a.deadline),
  }));
  return { assignments: withStatus, total, page, limit, totalPages: Math.ceil(total / limit) };
}
