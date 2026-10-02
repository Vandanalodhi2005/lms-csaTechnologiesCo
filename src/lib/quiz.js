export function calculateQuizResult(quiz, answers = {}) {
  if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    return {
      totalQuestions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      unansweredQuestions: 0,
      score: 0,
      passed: false,
    };
  }

  const totalQuestions = quiz.questions.length;
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let unansweredQuestions = 0;

  for (const question of quiz.questions) {
    const selectedAnswer = answers[question.id];

    if (!selectedAnswer) {
      unansweredQuestions += 1;
      continue;
    }

    if (selectedAnswer === question.correctAnswer) {
      correctAnswers += 1;
    } else {
      incorrectAnswers += 1;
    }
  }

  const score = Math.round((correctAnswers / totalQuestions) * 100);
  const passed = score >= Number(quiz.passingScore || 0);

  return {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    unansweredQuestions,
    score,
    passed,
  };
}
