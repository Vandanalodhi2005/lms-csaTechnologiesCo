import dbConnect from "@/lib/db";
import { Quiz, Question, QuizAttempt, Enrollment, Course } from "@/models";
import { canEditCourse } from "@/lib/permissions";

export async function createQuiz(user, data) {
  await dbConnect();
  const course = await Course.findById(data.courseId);
  if (!course) throw new Error("Course not found");
  if (!canEditCourse(user, course)) {
    throw new Error("You do not have permission to create quizzes for this course");
  }
  const quiz = await Quiz.create(data);
  return quiz.toObject();
}

export async function updateQuiz(user, quizId, updates) {
  await dbConnect();
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("Quiz not found");
  const course = await Course.findById(quiz.courseId);
  if (!canEditCourse(user, course)) {
    throw new Error("You do not have permission to edit this quiz");
  }
  const updated = await Quiz.findByIdAndUpdate(quizId, updates, {
    new: true,
    runValidators: true,
  });
  return updated.toObject();
}

export async function deleteQuiz(user, quizId) {
  await dbConnect();
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("Quiz not found");
  const course = await Course.findById(quiz.courseId);
  if (!canEditCourse(user, course)) {
    throw new Error("You do not have permission to delete this quiz");
  }
  await Question.deleteMany({ quizId });
  await Quiz.findByIdAndDelete(quizId);
  return { success: true };
}

export async function getQuizById(quizId, includeAnswers = false) {
  await dbConnect();
  const quiz = await Quiz.findById(quizId).lean();
  if (!quiz) throw new Error("Quiz not found");
  const questionQuery = Question.find({ quizId }).sort({ order: 1 });
  if (!includeAnswers) {
    questionQuery.select("-correctAnswer");
  }
  const questions = await questionQuery.lean();
  return { ...quiz, questions };
}

export async function addQuestion(user, data) {
  await dbConnect();
  const quiz = await Quiz.findById(data.quizId);
  if (!quiz) throw new Error("Quiz not found");
  const course = await Course.findById(quiz.courseId);
  if (!canEditCourse(user, course)) {
    throw new Error("You do not have permission to add questions");
  }
  const maxOrder = await Question.findOne({ quizId: data.quizId }).sort({ order: -1 }).select("order");
  const nextOrder = maxOrder ? maxOrder.order + 1 : 0;
  const question = await Question.create({ ...data, order: nextOrder });
  await Quiz.findByIdAndUpdate(data.quizId, {
    $inc: { totalQuestions: 1, totalMarks: data.marks || 1 },
  });
  return question.toObject();
}

export async function updateQuestion(user, questionId, updates) {
  await dbConnect();
  const question = await Question.findById(questionId);
  if (!question) throw new Error("Question not found");
  const quiz = await Quiz.findById(question.quizId);
  const course = await Course.findById(quiz.courseId);
  if (!canEditCourse(user, course)) {
    throw new Error("You do not have permission to edit this question");
  }
  const updated = await Question.findByIdAndUpdate(questionId, updates, {
    new: true,
    runValidators: true,
  });
  return updated.toObject();
}

export async function deleteQuestion(user, questionId) {
  await dbConnect();
  const question = await Question.findById(questionId);
  if (!question) throw new Error("Question not found");
  const quiz = await Quiz.findById(question.quizId);
  const course = await Course.findById(quiz.courseId);
  if (!canEditCourse(user, course)) {
    throw new Error("You do not have permission to delete this question");
  }
  const marks = question.marks || 0;
  await Question.findByIdAndDelete(questionId);
  await Quiz.findByIdAndUpdate(question.quizId, {
    $inc: { totalQuestions: -1, totalMarks: -marks },
  });
  return { success: true };
}

export async function submitQuizAttempt(studentId, { quizId, attemptNumber = 1, answers = [], timeSpentSeconds = 0 }) {
  await dbConnect();
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("Quiz not found");
  const enrollment = await Enrollment.findOne({ studentId, courseId: quiz.courseId });
  if (!enrollment) throw new Error("You must be enrolled in this course to take the quiz");
  if (quiz.attemptsAllowed > 0 && attemptNumber > quiz.attemptsAllowed) {
    throw new Error("You have exceeded the maximum number of attempts");
  }
  const questionIds = answers.map((a) => a.questionId);
  const questions = await Question.find({
    quizId,
    _id: { $in: questionIds },
  }).select("+correctAnswer");
  const questionMap = Object.fromEntries(questions.map((q) => [q._id.toString(), q]));
  let obtainedMarks = 0;
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let skippedQuestions = 0;
  const processedAnswers = [];
  for (const ans of answers) {
    const q = questionMap[ans.questionId?.toString()];
    if (!q) continue;
    const selected = ans.selectedAnswer;
    const correct = q.correctAnswer;
    const isCorrect =
      Array.isArray(correct)
        ? Array.isArray(selected) &&
          correct.length === selected.length &&
          correct.every((c) => selected.some((s) => s.toString() === c.toString()))
        : selected?.toString() === correct?.toString();
    if (selected === null || selected === undefined || selected === "") {
      skippedQuestions++;
    } else if (isCorrect) {
      correctAnswers++;
      obtainedMarks += q.marks || 1;
    } else {
      wrongAnswers++;
      obtainedMarks -= q.negativeMarks || 0;
    }
    processedAnswers.push({
      questionId: q._id,
      selectedAnswer: selected,
      isCorrect,
      marks: isCorrect ? q.marks || 1 : -(q.negativeMarks || 0),
      timeSpent: ans.timeSpent,
    });
  }
  const totalQuestions = questions.length || quiz.totalQuestions || 0;
  const answeredQuestions = answers.filter((a) => a.selectedAnswer !== null && a.selectedAnswer !== undefined && a.selectedAnswer !== "").length;
  const percentage = quiz.totalMarks > 0 ? Math.round((Math.max(0, obtainedMarks) / quiz.totalMarks) * 100) : 0;
  const isPassed = percentage >= quiz.passingPercentage;
  const existing = await QuizAttempt.findOneAndUpdate(
    { quizId, studentId, attemptNumber, status: "in_progress" },
    {
      status: "completed",
      submittedAt: new Date(),
      timeSpentSeconds,
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      wrongAnswers,
      skippedQuestions,
      totalMarks: quiz.totalMarks,
      obtainedMarks: Math.max(0, obtainedMarks),
      percentage,
      isPassed,
      answers: processedAnswers,
    },
    { new: true, upsert: true }
  );
  return existing.toObject();
}

export async function startQuizAttempt(studentId, { quizId, attemptNumber = 1 }) {
  await dbConnect();
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("Quiz not found");
  const enrollment = await Enrollment.findOne({ studentId, courseId: quiz.courseId });
  if (!enrollment) throw new Error("You must be enrolled in this course to take the quiz");
  if (quiz.attemptsAllowed > 0) {
    const attemptCount = await QuizAttempt.countDocuments({ quizId, studentId });
    if (attemptCount >= quiz.attemptsAllowed) {
      throw new Error("You have exceeded the maximum number of attempts");
    }
  }
  const attempt = await QuizAttempt.create({
    quizId,
    studentId,
    courseId: quiz.courseId,
    attemptNumber,
    status: "in_progress",
    passingPercentage: quiz.passingPercentage,
  });
  return attempt.toObject();
}

export async function getStudentQuizAttempts(studentId, quizId) {
  await dbConnect();
  const attempts = await QuizAttempt.find({ studentId, quizId })
    .sort({ attemptNumber: -1 })
    .select("-answers")
    .lean();
  return attempts;
}

export async function getQuizAttempt(attemptId, studentId) {
  await dbConnect();
  const attempt = await QuizAttempt.findById(attemptId).lean();
  if (!attempt) throw new Error("Attempt not found");
  if (attempt.studentId.toString() !== studentId) {
    throw new Error("Not authorized to view this attempt");
  }
  const questions = await Question.find({ quizId: attempt.quizId }).lean();
  const questionMap = Object.fromEntries(questions.map((q) => [q._id.toString(), q]));
  const processedAnswers = attempt.answers?.map((a) => ({
    ...a,
    question: questionMap[a.questionId?.toString()],
  })) || [];
  return { ...attempt, answers: processedAnswers };
}

export async function getCourseQuizzes(courseId, includeUnpublished = false) {
  await dbConnect();
  const query = { courseId };
  if (!includeUnpublished) query.isPublished = true;
  const quizzes = await Quiz.find(query).sort({ createdAt: -1 }).lean();
  return quizzes;
}

export async function getStudentQuizzes(studentId, { page = 1, limit = 10 } = {}) {
  await dbConnect();
  const skip = (page - 1) * limit;
  const enrollments = await Enrollment.find({ studentId }).select("courseId");
  const courseIds = enrollments.map((e) => e.courseId);
  const query = { courseId: { $in: courseIds }, isPublished: true };
  const [quizzes, total] = await Promise.all([
    Quiz.find(query)
      .populate({
        path: "courseId",
        select: "title slug thumbnail",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Quiz.countDocuments(query),
  ]);
  return { quizzes, total, page, limit, totalPages: Math.ceil(total / limit) };
}
