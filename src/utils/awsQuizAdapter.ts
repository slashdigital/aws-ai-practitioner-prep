export type AwsQuizQuestion = {
  question: string;
  answerSelectionType?: 'single' | 'multiple';
  answers: string[];
  correctAnswer: string | number | number[];
  explanation?: string;
  messageForCorrectAnswer?: string;
  messageForIncorrectAnswer?: string;
};

export type AwsQuiz = {
  quizTitle?: string;
  questions: AwsQuizQuestion[];
};

export type ThreadedQuizQuestion =
  | {
      question: string;
      options: string[];
      selectionType: 'single';
      correctAnswer: number;
      explanation?: string;
      category?: string;
    }
  | {
      question: string;
      options: string[];
      selectionType: 'multiple';
      correctAnswers: number[];
      explanation?: string;
      category?: string;
    };

function coerceSingleCorrectAnswerIndex(correctAnswer: AwsQuizQuestion['correctAnswer']): number | null {
  if (Array.isArray(correctAnswer)) return null;

  if (typeof correctAnswer === 'number') {
    if (!Number.isFinite(correctAnswer)) return null;
    return correctAnswer - 1;
  }

  if (typeof correctAnswer === 'string') {
    const parsed = Number.parseInt(correctAnswer, 10);
    if (!Number.isFinite(parsed)) return null;
    return parsed - 1;
  }

  return null;
}

function coerceMultipleCorrectAnswerIndices(
  correctAnswer: AwsQuizQuestion['correctAnswer'],
): number[] | null {
  if (!Array.isArray(correctAnswer)) return null;

  const indices = correctAnswer
    .map((v) => {
      if (typeof v === 'number') {
        if (!Number.isFinite(v)) return null;
        return v - 1;
      }

      if (typeof v === 'string') {
        const parsed = Number.parseInt(v, 10);
        if (!Number.isFinite(parsed)) return null;
        return parsed - 1;
      }

      return null;
    })
    .filter((v): v is number => v !== null);

  if (indices.length === 0) return null;

  const uniqueSorted = [...new Set(indices)].sort((a, b) => a - b);
  return uniqueSorted;
}

export function awsQuizToThreadedQuestions(awsQuiz: AwsQuiz, category: string): {
  questions: ThreadedQuizQuestion[];
  skipped: number;
} {
  let skipped = 0;

  const questions: ThreadedQuizQuestion[] = (awsQuiz.questions || []).flatMap(
    (q): ThreadedQuizQuestion[] => {
    if (!Array.isArray(q.answers) || q.answers.length === 0) {
      skipped++;
      return [];
    }

    const explanation = q.explanation || q.messageForCorrectAnswer || q.messageForIncorrectAnswer;

    const selectionType = q.answerSelectionType || (Array.isArray(q.correctAnswer) ? 'multiple' : 'single');

    if (selectionType === 'multiple') {
      const correctIndices = coerceMultipleCorrectAnswerIndices(q.correctAnswer);
      if (!correctIndices) {
        skipped++;
        return [];
      }

      const hasOutOfRange = correctIndices.some((i) => i < 0 || i >= q.answers.length);
      if (hasOutOfRange) {
        skipped++;
        return [];
      }

      return [
        {
          question: q.question,
          options: q.answers,
          selectionType: 'multiple',
          correctAnswers: correctIndices,
          explanation,
          category,
        },
      ];
    }

    const correctIndex = coerceSingleCorrectAnswerIndex(q.correctAnswer);
    if (correctIndex === null) {
      skipped++;
      return [];
    }

    if (correctIndex < 0 || correctIndex >= q.answers.length) {
      skipped++;
      return [];
    }

    return [
      {
        question: q.question,
        options: q.answers,
        selectionType: 'single',
        correctAnswer: correctIndex,
        explanation,
        category,
      },
    ];
    },
  );

  return { questions, skipped };
}
