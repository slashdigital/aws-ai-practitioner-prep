import React, { useEffect, useMemo, useState } from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export type QuizQuestion =
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

type SelectedAnswer = number | number[];

function stripLeadingOptionPrefix(option: string, index: number): string {
  const expected = String.fromCharCode(65 + index);
  const trimmed = option.trimStart();
  const prefixPattern = new RegExp(`^\\(?${expected}\\)?[\\).]\\s+`, 'i');
  if (prefixPattern.test(trimmed)) {
    return trimmed.replace(prefixPattern, '');
  }
  return option;
}

function stripTrailingSelectInstruction(question: string): string {
  // Examples: "(Select TWO.)", "(Select 2.)", "(Select one)", "Select TWO."
  // Keep it conservative: only remove if it appears at the very end.
  return question.replace(
    /\s*(?:\(|\b)\s*select\s+(?:one|two|three|four|\d+)\s*\.?\s*(?:\))?\s*$/i,
    '',
  );
}

function formatIndicesAsLetters(indices: number[]): string {
  if (indices.length === 0) return '—';
  return indices
    .slice()
    .sort((a, b) => a - b)
    .map((i) => String.fromCharCode(65 + i))
    .join(', ');
}

function toArraySelection(value: SelectedAnswer | undefined): number[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'number' && value !== -1) return [value];
  return [];
}

interface ThreadedQuizProps {
  questions: QuizQuestion[];
  title?: string;
  showCategories?: boolean;
  randomize?: boolean;
  maxQuestions?: number;
  hideCheckAnswer?: boolean;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
  requireName?: boolean;
  onExit?: () => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function ThreadedQuiz({
  questions,
  title = 'Quiz',
  showCategories = true,
  randomize = false,
  maxQuestions,
  hideCheckAnswer = false,
  autoAdvance = false,
  autoAdvanceDelay = 1500,
  requireName = true,
  onExit,
}: ThreadedQuizProps): React.ReactElement {
  const [shuffleKey, setShuffleKey] = useState(0);
  const [userName, setUserName] = useState('');
  const [hasStarted, setHasStarted] = useState(!requireName);

  const displayedQuestions = useMemo(() => {
    let processedQuestions = [...questions];

    if (randomize) {
      processedQuestions = shuffleArray(processedQuestions);
    }

    if (maxQuestions && maxQuestions < processedQuestions.length) {
      processedQuestions = processedQuestions.slice(0, maxQuestions);
    }

    return processedQuestions;
  }, [questions, randomize, maxQuestions, shuffleKey]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAutoAdvanceEnabled, setIsAutoAdvanceEnabled] = useState(autoAdvance);

  const createInitialSelectedAnswers = (qs: QuizQuestion[]): SelectedAnswer[] => {
    return qs.map((q) => (q.selectionType === 'multiple' ? [] : -1));
  };

  useEffect(() => {
    setCurrentQuestion(0);
    setSelectedAnswers(createInitialSelectedAnswers(displayedQuestions));
    setShowResults(false);
    setShowExplanation(false);
  }, [displayedQuestions]);

  const currentQuestionData = displayedQuestions[currentQuestion];

  const isQuestionAnswered = (index: number) => {
    const q = displayedQuestions[index];
    const selected = selectedAnswers[index];
    if (!q) return false;

    if (q.selectionType === 'multiple') {
      return Array.isArray(selected) && selected.length > 0;
    }

    return typeof selected === 'number' && selected !== -1;
  };

  const isQuestionCorrect = (index: number) => {
    const q = displayedQuestions[index];
    const selected = selectedAnswers[index];
    if (!q) return false;

    if (q.selectionType === 'multiple') {
      if (!Array.isArray(selected)) return false;
      const selectedSet = new Set(selected);
      const correctSet = new Set(q.correctAnswers);
      if (selectedSet.size !== correctSet.size) return false;
      for (const c of correctSet) {
        if (!selectedSet.has(c)) return false;
      }
      return true;
    }

    return typeof selected === 'number' && selected === q.correctAnswer;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (showResults) return;

    const q = currentQuestionData;
    if (!q) return;

    const newSelectedAnswers = [...selectedAnswers];
    if (q.selectionType === 'multiple') {
      const current = Array.isArray(newSelectedAnswers[currentQuestion])
        ? (newSelectedAnswers[currentQuestion] as number[])
        : [];

      const set = new Set(current);
      if (set.has(optionIndex)) {
        set.delete(optionIndex);
      } else {
        set.add(optionIndex);
      }

      newSelectedAnswers[currentQuestion] = [...set].sort((a, b) => a - b);
    } else {
      newSelectedAnswers[currentQuestion] = optionIndex;
    }

    setSelectedAnswers(newSelectedAnswers);

    if (isAutoAdvanceEnabled) {
      setTimeout(() => {
        if (currentQuestion < displayedQuestions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setShowExplanation(false);
        } else {
          setShowResults(true);
        }
      }, autoAdvanceDelay);
    }
  };

  const handleNext = () => {
    if (currentQuestion < displayedQuestions.length -  1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };

  const handleReset = () => {
    setShuffleKey((prev) => prev + 1);
  };

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      setHasStarted(true);
    }
  };

  const calculateScore = () => {
    return displayedQuestions.reduce((score, _q, index) => {
      return isQuestionCorrect(index) ? score + 1 : score;
    }, 0);
  };

  const score = calculateScore();
  const isAnswered = isQuestionAnswered(currentQuestion);
  const isCorrect = isQuestionCorrect(currentQuestion);

  const getPerformanceFeedback = () => {
    const percentage = Math.round((score / displayedQuestions.length) * 100);
    const name = requireName && userName ? userName : '';

    if (percentage === 100) {
      return {
        emoji: '🏆',
        message: name ? `${name}, Perfect Score!` : 'Perfect Score!',
        color: '#FFD700',
      };
    } else if (percentage >= 90) {
      return {
        emoji: '🌟',
        message: name ? `Outstanding, ${name}!` : 'Outstanding!',
        color: '#4CAF50',
      };
    } else if (percentage >= 80) {
      return {
        emoji: '🎯',
        message: name ? `Excellent Work, ${name}!` : 'Excellent Work!',
        color: '#2196F3',
      };
    } else if (percentage >= 70) {
      return {
        emoji: '👍',
        message: name ? `Good Job, ${name}!` : 'Good Job!',
        color: '#FF9800',
      };
    } else if (percentage >= 60) {
      return {
        emoji: '📚',
        message: name ? `Keep Learning, ${name}!` : 'Keep Learning!',
        color: '#9C27B0',
      };
    } else {
      return {
        emoji: '💪',
        message: name ? `Keep Practicing, ${name}!` : 'Keep Practicing!',
        color: '#F44336',
      };
    }
  };

  const categories = showCategories
    ? [...new Set(displayedQuestions.map((q) => q.category || 'General'))]
    : [];

  const getCurrentCategory = () => {
    return currentQuestionData.category || 'General';
  };

  const getSelectionHint = (): string | null => {
    if (currentQuestionData.selectionType !== 'multiple') return null;
    const count = currentQuestionData.correctAnswers.length;
    return `Select ${count} answers`;
  };

  const getQuestionsInCurrentCategory = () => {
    const currentCategory = getCurrentCategory();
    return displayedQuestions.filter((q) => (q.category || 'General') === currentCategory);
  };

  const getQuestionNumberInCategory = () => {
    const currentCategory = getCurrentCategory();
    let count = 0;
    for (let i = 0; i <= currentQuestion; i++) {
      if ((displayedQuestions[i].category || 'General') === currentCategory) {
        count++;
      }
    }
    return count;
  };

  const getTotalQuestionsInCategory = () => {
    return getQuestionsInCurrentCategory().length;
  };

  return (
    <div className={styles.quizContainer}>
      {onExit ? (
        <button type="button" className={styles.backLink} onClick={onExit}>
          ← Back to Quiz Menu
        </button>
      ) : (
        <Link to="/quiz" className={styles.backLink}>
          ← Back to Quiz Menu
        </Link>
      )}
      <h2 className={styles.quizTitle}>{title}</h2>

      {requireName && !hasStarted ? (
        <div className={styles.nameEntryContainer}>
          <p className={styles.nameEntryPrompt}>Please enter your name to begin the assessment:</p>
          <form onSubmit={handleStartQuiz} className={styles.nameEntryForm}>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className={styles.nameInput}
              autoFocus
            />
            <button type="submit" className={styles.startButton} disabled={!userName.trim()}>
              Start Assessment
            </button>
          </form>
        </div>
      ) : !showResults ? (
        <div className={styles.questionContainer}>
          <div className={styles.questionHeader}>
            <span className={styles.questionNumber}>
              Question {currentQuestion + 1} of {displayedQuestions.length}
              {showCategories && (
                <span className={styles.categoryBadge}>
                  {getCurrentCategory()} ({getQuestionNumberInCategory()} of {getTotalQuestionsInCategory()})
                </span>
              )}
            </span>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${((currentQuestion + 1) / displayedQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          <h3 className={styles.question}>{stripTrailingSelectInstruction(currentQuestionData.question)}</h3>

          {getSelectionHint() && <div className={styles.selectionHint}>{getSelectionHint()}</div>}

          <div className={styles.options}>
            {currentQuestionData.options.map((option, index) => {
              const optionText = stripLeadingOptionPrefix(option, index);

              return (
                <button
                  key={index}
                  className={`${styles.option} ${
                    (currentQuestionData.selectionType === 'multiple'
                      ? Array.isArray(selectedAnswers[currentQuestion]) &&
                        (selectedAnswers[currentQuestion] as number[]).includes(index)
                      : selectedAnswers[currentQuestion] === index)
                      ? styles.selected
                      : ''
                  } ${
                    showExplanation &&
                    (currentQuestionData.selectionType === 'multiple'
                      ? currentQuestionData.correctAnswers.includes(index)
                      : index === currentQuestionData.correctAnswer)
                      ? styles.correct
                      : ''
                  } ${
                    showExplanation &&
                    (currentQuestionData.selectionType === 'multiple'
                      ? Array.isArray(selectedAnswers[currentQuestion]) &&
                        (selectedAnswers[currentQuestion] as number[]).includes(index) &&
                        !currentQuestionData.correctAnswers.includes(index)
                      : selectedAnswers[currentQuestion] === index &&
                        index !== currentQuestionData.correctAnswer)
                      ? styles.incorrect
                      : ''
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  {currentQuestionData.selectionType === 'multiple' ? (
                    <input
                      className={styles.checkbox}
                      type="checkbox"
                      checked={
                        Array.isArray(selectedAnswers[currentQuestion]) &&
                        (selectedAnswers[currentQuestion] as number[]).includes(index)
                      }
                      onChange={() => handleAnswerSelect(index)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className={styles.optionLabel}>{String.fromCharCode(65 + index)}.</span>
                  )}
                  <span className={styles.optionText}>{optionText}</span>
                </button>
              );
            })}
          </div>

          {isAnswered && !showExplanation && !hideCheckAnswer && (
            <button className={styles.checkButton} onClick={() => setShowExplanation(true)}>
              Check Answer
            </button>
          )}

          {showExplanation && currentQuestionData.explanation && (
            <div className={styles.explanation}>
              <h4>{isCorrect ? '✅ Correct!' : '❌ Incorrect'}</h4>
              <p>{currentQuestionData.explanation}</p>
            </div>
          )}

          <div className={styles.navigation}>
            <button
              className={styles.navButton}
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            <div className={styles.navRight}>
              {autoAdvance && (
                <label className={styles.switchContainer}>
                  <input
                    type="checkbox"
                    checked={isAutoAdvanceEnabled}
                    onChange={(e) => setIsAutoAdvanceEnabled(e.target.checked)}
                    className={styles.switchInput}
                  />
                  <span className={styles.switchSlider}></span>
                  <span className={styles.switchLabel}>Auto</span>
                </label>
              )}
              <button
                className={styles.navButton}
                onClick={handleNext}
                disabled={!isAnswered}
              >
                {currentQuestion === displayedQuestions.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.resultsContainer}>
          <div className={styles.resultsCard}>
            <h3 className={styles.resultsTitle}>
              {requireName && userName
                ? `${userName}'s ${title.replace('Quiz', 'Assessment')} Results`
                : `${title.replace('Quiz', 'Assessment')} Results`}
            </h3>

            <div className={styles.performanceBadge}>
              <span className={styles.performanceEmoji}>{getPerformanceFeedback().emoji}</span>
              <span className={styles.performanceMessage} style={{ color: getPerformanceFeedback().color }}>
                {getPerformanceFeedback().message}
              </span>
            </div>

            <div className={styles.mainScore}>
              <div className={styles.scoreCircle}>
                <span className={styles.scorePercentage}>
                  {Math.round((score / displayedQuestions.length) * 100)}%
                </span>
              </div>
              <p className={styles.scoreText}>
                {score} / {displayedQuestions.length} correct
              </p>
            </div>

            {showCategories && categories.length > 1 && (
              <div className={styles.categoryScores}>
                <h4 className={styles.categoryTitle}>Performance by Category</h4>
                <div className={styles.categoryGrid}>
                  {categories.map((category) => {
                    const categoryQuestions = displayedQuestions.filter((q) => (q.category || 'General') === category);
                    const categoryCorrect = categoryQuestions.reduce((count, q) => {
                      const questionIndex = displayedQuestions.findIndex((question) => question === q);
                      return isQuestionCorrect(questionIndex) ? count + 1 : count;
                    }, 0);
                    const categoryPercentage = Math.round((categoryCorrect / categoryQuestions.length) * 100);

                    return (
                      <div key={category} className={styles.categoryItem}>
                        <div className={styles.categoryHeader}>
                          <span className={styles.categoryName}>{category}</span>
                          <span className={styles.categoryPercent}>{categoryPercentage}%</span>
                        </div>
                        <div className={styles.categoryBar}>
                          <div
                            className={styles.categoryBarFill}
                            style={{ width: `${categoryPercentage}%` }}
                          />
                        </div>
                        <span className={styles.categoryCount}>
                          {categoryCorrect}/{categoryQuestions.length}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={styles.reviewSection}>
              <h4 className={styles.categoryTitle}>Review Questions</h4>
              <div className={styles.reviewList}>
                {displayedQuestions.map((q, index) => {
                  const correct = isQuestionCorrect(index);
                  const selected = toArraySelection(selectedAnswers[index]);
                  const correctIndices = q.selectionType === 'multiple' ? q.correctAnswers : [q.correctAnswer];
                  const summaryYour = formatIndicesAsLetters(selected);
                  const summaryCorrect = formatIndicesAsLetters(correctIndices);

                  return (
                    <details key={index} className={styles.reviewItem}>
                      <summary className={styles.reviewSummary}>
                        <span className={styles.reviewIndex}>#{index + 1}</span>
                        <span
                          className={`${styles.reviewStatus} ${
                            correct ? styles.reviewStatusCorrect : styles.reviewStatusIncorrect
                          }`}
                        >
                          {correct ? 'Correct' : 'Incorrect'}
                        </span>
                        <span className={styles.reviewMeta}>
                          <span className={styles.reviewMetaLabel}>Your:</span>{' '}
                          <span className={styles.reviewYourAnswer}>{summaryYour}</span>
                          <span className={styles.reviewMetaDivider}>|</span>
                          <span className={styles.reviewMetaLabel}>Correct:</span>{' '}
                          <span className={styles.reviewCorrectAnswer}>{summaryCorrect}</span>
                        </span>
                      </summary>
                      <div className={styles.reviewContent}>
                        <div className={styles.reviewQuestion}>{stripTrailingSelectInstruction(q.question)}</div>
                        <div className={styles.reviewOptions}>
                          {q.options.map((opt, optIndex) => {
                            const cleanOpt = stripLeadingOptionPrefix(opt, optIndex);
                            const isSelected = selected.includes(optIndex);
                            const isOptCorrect = correctIndices.includes(optIndex);

                            return (
                              <div
                                key={optIndex}
                                className={`${styles.reviewOption} ${
                                  isOptCorrect ? styles.correct : isSelected ? styles.incorrect : ''
                                }`}
                              >
                                <span className={styles.reviewOptionLabel}>
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>
                                <span className={styles.reviewOptionText}>{cleanOpt}</span>
                              </div>
                            );
                          })}
                        </div>
                        {q.explanation && (
                          <div className={styles.reviewExplanation}>
                            <div className={styles.reviewExplanationTitle}>Explanation</div>
                            <div className={styles.reviewExplanationText}>{q.explanation}</div>
                          </div>
                        )}
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>

            <div className={styles.resultsFooter}>
              <p className={styles.timestamp}>
                Completed: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <button className={styles.resetButton} onClick={handleReset}>
            Retake Assessment
          </button>

          {onExit && (
            <button className={styles.exitButton} onClick={onExit}>
              Back to Quiz Menu
            </button>
          )}
        </div>
      )}
    </div>
  );
}
