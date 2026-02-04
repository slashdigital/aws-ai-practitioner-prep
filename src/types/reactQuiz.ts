export type ReactQuizQuestionBase = {
  question: string;
  questionType: string;
  questionPic?: string;
  answers: string[];
  messageForCorrectAnswer?: string;
  messageForIncorrectAnswer?: string;
  explanation?: string;
  point?: string | number;
};

export type ReactQuizSingleQuestion = ReactQuizQuestionBase & {
  answerSelectionType: 'single';
  correctAnswer: string | number;
};

export type ReactQuizMultipleQuestion = ReactQuizQuestionBase & {
  answerSelectionType: 'multiple';
  correctAnswer: Array<string | number>;
};

export type ReactQuizQuestion = ReactQuizSingleQuestion | ReactQuizMultipleQuestion;

export type ReactQuiz = {
  quizTitle: string;
  quizSynopsis?: string;
  progressBarColor?: string;
  nrOfQuestions?: string | number;
  questions: ReactQuizQuestion[];
};
