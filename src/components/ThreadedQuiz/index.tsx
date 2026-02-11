import React, { useEffect, useMemo, useState } from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export type QuizQuestion =
  | {
      question: string;
      options: string[];
      selectionType: 'single';
      correctAnswer: number;
      points: number;
      explanation?: string;
      category?: string;
    }
  | {
      question: string;
      options: string[];
      selectionType: 'multiple';
      correctAnswers: number[];
      points: number;
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
  timeLimitSeconds?: number;
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
  timeLimitSeconds,
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
  const [showExplanationPreference, setShowExplanationPreference] = useState(false);
  const [isAutoAdvanceEnabled, setIsAutoAdvanceEnabled] = useState(autoAdvance);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(
    typeof timeLimitSeconds === 'number' && Number.isFinite(timeLimitSeconds) ? timeLimitSeconds : null,
  );

  const createInitialSelectedAnswers = (qs: QuizQuestion[]): SelectedAnswer[] => {
    return qs.map((q) => (q.selectionType === 'multiple' ? [] : -1));
  };

  useEffect(() => {
    if (autoAdvanceTimer === null || autoAdvanceTimer <= 0) return;
    const interval = setInterval(() => {
      setAutoAdvanceTimer((prev) => (prev !== null ? Math.max(0, prev - 1) : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [autoAdvanceTimer]);

  useEffect(() => {
    setCurrentQuestion(0);
    setSelectedAnswers(createInitialSelectedAnswers(displayedQuestions));
    setShowResults(false);
    setShowExplanation(false);
    setRemainingSeconds(
      typeof timeLimitSeconds === 'number' && Number.isFinite(timeLimitSeconds) ? timeLimitSeconds : null,
    );
  }, [displayedQuestions]);

  useEffect(() => {
    if (showResults) return;
    if (isAutoAdvanceEnabled) return;
    if (!showExplanationPreference) return;
    if (!isQuestionAnswered(currentQuestion)) return;
    setShowExplanation(true);
  }, [currentQuestion, selectedAnswers, showExplanationPreference, showResults, isAutoAdvanceEnabled]);

  useEffect(() => {
    if (!isAutoAdvanceEnabled) return;
    setShowExplanation(false);
    setShowExplanationPreference(false);
  }, [isAutoAdvanceEnabled]);

  useEffect(() => {
    if (!hasStarted) return;
    if (showResults) return;
    if (remainingSeconds === null) return;
    if (remainingSeconds <= 0) return;

    const id = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null) return prev;
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(id);
    };
  }, [hasStarted, remainingSeconds, showResults]);

  useEffect(() => {
    if (!hasStarted) return;
    if (showResults) return;
    if (remainingSeconds === null) return;
    if (remainingSeconds > 0) return;
    setShowResults(true);
  }, [hasStarted, remainingSeconds, showResults]);

  const currentQuestionData = displayedQuestions[currentQuestion];

  const isQuestionAnswered = (index: number) => {
    const q = displayedQuestions[index];
    const selected = selectedAnswers[index];
    if (!q) return false;

    if (q.selectionType === 'multiple') {
      const requiredCount = q.correctAnswers.length;
      return Array.isArray(selected) && selected.length === requiredCount;
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
    if (!q || showExplanation) return;

    const newSelectedAnswers = [...selectedAnswers];
    let shouldAutoAdvance = false;
    if (q.selectionType === 'multiple') {
      const requiredCount = q.correctAnswers.length;
      const current = Array.isArray(newSelectedAnswers[currentQuestion])
        ? (newSelectedAnswers[currentQuestion] as number[])
        : [];

      const set = new Set(current);
      if (set.has(optionIndex)) {
        set.delete(optionIndex);
      } else {
        if (set.size >= requiredCount) {
          return;
        }
        set.add(optionIndex);
      }

      newSelectedAnswers[currentQuestion] = [...set].sort((a, b) => a - b);

      shouldAutoAdvance = set.size === requiredCount;
    } else {
      newSelectedAnswers[currentQuestion] = optionIndex;

      shouldAutoAdvance = true;
    }

    setSelectedAnswers(newSelectedAnswers);

    if (shouldAutoAdvance && showExplanationPreference) {
      setShowExplanation(true);
    }

    if (isAutoAdvanceEnabled && shouldAutoAdvance) {
      setAutoAdvanceTimer(Math.floor(autoAdvanceDelay / 1000));
      setTimeout(() => {
        if (currentQuestion < displayedQuestions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setShowExplanation(false);
          setAutoAdvanceTimer(null);
        } else {
          setShowResults(true);
          setAutoAdvanceTimer(null);
        }
      }, autoAdvanceDelay);
    }
  };

  const handleNext = () => {
    if (currentQuestion < displayedQuestions.length -  1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
      setAutoAdvanceTimer(null);
    } else {
      setShowResults(true);
      setAutoAdvanceTimer(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
      setAutoAdvanceTimer(null);
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

  const calculateTotalPoints = () => {
    return displayedQuestions.reduce((sum, q) => sum + (Number.isFinite(q.points) ? q.points : 0), 0);
  };

  const calculateCorrectPoints = () => {
    return displayedQuestions.reduce((sum, q, index) => {
      return isQuestionCorrect(index) ? sum + (Number.isFinite(q.points) ? q.points : 0) : sum;
    }, 0);
  };

  const totalPoints = calculateTotalPoints();
  const correctPoints = calculateCorrectPoints();
  const isAnswered = isQuestionAnswered(currentQuestion);
  const isCorrect = isQuestionCorrect(currentQuestion);

  const getPerformanceFeedback = () => {
    const percentage = totalPoints > 0 ? Math.round((correctPoints / totalPoints) * 100) : 0;
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

  const formatRemainingTime = (seconds: number): string => {
    const safeSeconds = Math.max(0, seconds);
    const mm = Math.floor(safeSeconds / 60);
    const ss = safeSeconds % 60;
    return `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
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
              <span className={styles.questionMeta}>
                Question {currentQuestion + 1} of {displayedQuestions.length}
                {showCategories && getCurrentCategory() !== 'Starter' && (
                  <span className={styles.categoryBadge}>
                    {getCurrentCategory()} ({getQuestionNumberInCategory()} of {getTotalQuestionsInCategory()})
                  </span>
                )}
              </span>
              {remainingSeconds !== null && (
                <span className={styles.timerInline}>
                  Time left: <span className={styles.timerValue}>{formatRemainingTime(remainingSeconds)}</span>
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
          
          <div className={styles.aboveOptionsRow}>
            <div className={styles.selectionHintContainer}>
              {getSelectionHint() ? (
                <div className={styles.selectionHint}>{getSelectionHint()}</div>
              ) : (
                <div className={styles.selectionHintPlaceholder} />
              )}
            </div>
            <div className={styles.pointsBadge}>
              {currentQuestionData.points} {currentQuestionData.points === 1 ? 'pt' : 'pts'}
            </div>
          </div>

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

          <div className={styles.answerControlsRow}>
            <div className={styles.answerControlsLeft}>
              {!hideCheckAnswer && (
                <label className={styles.answerControlItem}>
                  <input
                    type="checkbox"
                    checked={showExplanationPreference}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setShowExplanationPreference(checked);
                      if (!checked) setShowExplanation(false);
                      if (checked && isAnswered) setShowExplanation(true);
                    }}
                  />
                  <span>Check answer</span>
                </label>
              )}
            </div>
            <div className={styles.answerControlsRight}>
              <label className={styles.answerControlItem}>
                <input
                  type="checkbox"
                  checked={isAutoAdvanceEnabled}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsAutoAdvanceEnabled(checked);
                    if (checked) {
                      setShowExplanation(false);
                      setShowExplanationPreference(false);
                    }
                  }}
                />
                <span>Auto next</span>
              </label>
            </div>
          </div>

          {showExplanation && !isAutoAdvanceEnabled && currentQuestionData.explanation && (
            <div className={styles.explanation}>
              <h4>{isCorrect ? '✅ Correct!' : '❌ Incorrect'}</h4>
              <p>{currentQuestionData.explanation}</p>
            </div>
          )}

          <div className={styles.navigation}>
            <div className={styles.navRight}>
              <button
                className={styles.navButton}
                onClick={handleNext}
                disabled={!isAnswered}
              >
                {currentQuestion === displayedQuestions.length - 1 ? 'Finish' : 'Next'}
                {autoAdvanceTimer !== null && autoAdvanceTimer > 0 && ` (${autoAdvanceTimer})`}
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
                  {totalPoints > 0 ? Math.round((correctPoints / totalPoints) * 100) : 0}%
                </span>
              </div>
              <p className={styles.scoreText}>
                {correctPoints} / {totalPoints} points
              </p>
            </div>

            {showCategories && categories.length > 1 && (
              <div className={styles.categoryScores}>
                <h4 className={styles.categoryTitle}>Performance by Category</h4>
                <div className={styles.categoryGrid}>
                  {categories.map((category) => {
                    const categoryQuestions = displayedQuestions.filter((q) => (q.category || 'General') === category);
                    const categoryTotalPoints = categoryQuestions.reduce(
                      (sum, q) => sum + (Number.isFinite(q.points) ? q.points : 0),
                      0,
                    );
                    const categoryCorrectPoints = categoryQuestions.reduce((sum, q) => {
                      const questionIndex = displayedQuestions.findIndex((question) => question === q);
                      return isQuestionCorrect(questionIndex)
                        ? sum + (Number.isFinite(q.points) ? q.points : 0)
                        : sum;
                    }, 0);
                    const categoryPercentage =
                      categoryTotalPoints > 0
                        ? Math.round((categoryCorrectPoints / categoryTotalPoints) * 100)
                        : 0;

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
                          {categoryCorrectPoints}/{categoryTotalPoints}
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
