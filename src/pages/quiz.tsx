import type { ReactNode } from 'react';
import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import QuizFeatures from '@site/src/components/QuizFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import ThreadedQuiz from '../components/ThreadedQuiz';
import Quiz from 'react-quiz-component';
import { quiz as starterQuiz } from '../data/quiz.5.domains';
import { quiz as poQuiz } from '../data/quiz.po';
import { quiz as fullsetQuiz } from '../data/quiz.fullset';
import { awsQuizToThreadedQuestions } from '../utils/awsQuizAdapter';
import Certificate from '../components/Certificate';


// https://github.com/wingkwong/react-quiz-component

type QuizType = "starter" | "po" | "full";

function HomepageHeader({
  onQuizSelect,
}: {
  onQuizSelect: (quizType: QuizType) => void;
}) {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Welcome to the AWS AI Practitioner Quiz!
        </Heading>
        <p className="hero__subtitle">
          Challenge yourself with this set of questions covering all 5 core
          domains of the AWS AI Practitioner exam. This quiz is designed to help
          you assess your current understanding, identify knowledge gaps, and
          boost your confidence as you prepare for the real certification. Let’s
          test your skills and get exam-ready!
        </p>
        <div className={styles.buttons}>
          <button
            className="button button--secondary button--lg"
            style={{ minWidth: 150, marginRight: 12 }}
            onClick={() => onQuizSelect("starter")}
          >
            Starter Quiz
          </button>
          <button
            className="button button--secondary button--lg"
            style={{ minWidth: 150, marginRight: 12 }}
            onClick={() => onQuizSelect("po")}
          >
            PO Quiz
          </button>
          <button
            className="button button--secondary button--lg"
            style={{ minWidth: 150 }}
            onClick={() => onQuizSelect("full")}
          >
            Full Set Quiz
          </button>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const [selectedQuiz, setSelectedQuiz] = useState<QuizType | null>(null);

  const [quizResult, setQuizResult] = useState<any | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  const quizData = useMemo(() => {
    if (selectedQuiz === 'starter') return starterQuiz;
    if (selectedQuiz === 'po') return poQuiz;
    if (selectedQuiz === 'full') return fullsetQuiz;
    return null;
  }, [selectedQuiz]);

  const quizDuration = useMemo(() => {
    if (selectedQuiz === 'po') return 3600;
    if (selectedQuiz === 'full') return 3600 * 2;
    return undefined;
  }, [selectedQuiz]);

  const { questions: threadedQuestions, skipped } = useMemo(() => {
    if (selectedQuiz !== 'starter' || !quizData) return { questions: [], skipped: 0 };
    return awsQuizToThreadedQuestions(quizData as any, 'Starter');
  }, [quizData, selectedQuiz]);

  function handleQuizComplete(result: any) {
    setQuizResult(result);
    const totalPoints = result.totalPoints || (result.numberOfQuestions * 10) || 100;
    const userPoints = result.correctPoints || result.correctAnswers || 0;
    const passed = userPoints / totalPoints >= 0.7;
    setShowCertificate(passed);
  }

  return (
    <Layout
      title="AWS AI Practitioner Exam Quiz"
      description="Challenge yourself with our AWS AI Practitioner Exam Quiz! Test your knowledge across all 5 domains and get exam-ready with instant feedback and explanations."
    >
      {selectedQuiz === null && <HomepageHeader onQuizSelect={setSelectedQuiz} />}
      {selectedQuiz === null && <QuizFeatures />}
      <main>
        {selectedQuiz !== null && quizData && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {selectedQuiz === 'starter' ? (
              threadedQuestions.length === 0 ? (
                <div style={{ maxWidth: 800, width: '100%' }}>
                  <p>No compatible questions found for Starter quiz.</p>
                </div>
              ) : (
                <div style={{ maxWidth: 900, width: '100%' }}>
                  <ThreadedQuiz
                    title={quizData.quizTitle}
                    questions={threadedQuestions}
                    showCategories={true}
                    randomize={true}
                    hideCheckAnswer={false}
                    autoAdvance={false}
                    requireName={false}
                    onExit={() => {
                      setQuizResult(null);
                      setShowCertificate(false);
                      setSelectedQuiz(null);
                    }}
                  />
                  {skipped > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <small>
                        {skipped} question(s) were skipped due to unsupported or invalid formatting.
                      </small>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div>
                <Quiz
                  quiz={quizData}
                  timer={quizDuration}
                  allowPauseTimer={true}
                  shuffle={true}
                  shuffleAnswer={true}
                  showInstantFeedback={false}
                  showDefaultResult={true}
                  enableProgressBar={true}
                  onComplete={handleQuizComplete}
                />
                {showCertificate && quizResult && (
                  <Certificate
                    userName={''}
                    date={new Date().toLocaleDateString()}
                    quizTitle={quizData.quizTitle}
                    score={quizResult.correctPoints || quizResult.correctAnswers || 0}
                    total={quizResult.totalPoints || (quizResult.numberOfQuestions * 10) || 100}
                  />
                )}
              </div>
            )}
            {selectedQuiz !== 'starter' && (
              <button
                className="button button--secondary button--sm"
                style={{ margin: 24 }}
                onClick={() => {
                  setQuizResult(null);
                  setShowCertificate(false);
                  setSelectedQuiz(null);
                }}
              >
                Back to Quiz Menu
              </button>
            )}
          </div>
        )}
      </main>
    </Layout>
  );
}
