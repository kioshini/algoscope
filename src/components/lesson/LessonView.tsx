import { ArrowLeft, ArrowRight, Check, X } from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import type { CatalogAlgorithmDefinition } from '../../algorithms/types';
import { useI18n } from '../../lib/i18n';
import { lessonMetadata } from '../../lib/lesson';
import { buildQuizQuestions, type LessonQuestion } from '../../lib/quiz';
import { algorithmWorker } from '../../lib/worker-client';

type LessonViewProps = {
  algorithm: CatalogAlgorithmDefinition;
  onClose?: () => void;
};

type QuizChoice = { question: LessonQuestion; chosen: number };

const STEP_KEYS = [
  'lessonStepProblem',
  'lessonStepIdea',
  'lessonStepWatch',
  'lessonStepQuiz',
  'lessonStepWrapUp',
] as const;

export function LessonView({ algorithm, onClose }: LessonViewProps) {
  const { t, locale, format } = useI18n();
  const meta = useMemo(() => lessonMetadata(algorithm), [algorithm]);
  const questions = useMemo(() => buildQuizQuestions(algorithm, locale), [algorithm, locale]);
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState<QuizChoice[]>([]);

  const correctCount = choices.filter((choice) => choice.chosen === choice.question.correctIndex).length;
  const allAnswered = choices.length === questions.length;
  const quizPassed = allAnswered && correctCount / questions.length >= 0.8;
  const last = STEP_KEYS.length - 1;

  function choose(choice: QuizChoice): void {
    setChoices((current) => {
      const others = current.filter((item) => item.question.id !== choice.question.id);
      return [...others, choice];
    });
  }

  return (
    <section className="lesson" aria-label={t(STEP_KEYS[step])}>
      <header className="lesson-head">
        <button
          type="button"
          className="lesson-back"
          onClick={() => setStep((current) => Math.max(0, current - 1))}
          disabled={step === 0}
        >
          <ArrowLeft size={14} /> {t('lessonPrevStep')}
        </button>
        <div className="lesson-head-title">
          <span>{t('lessonTitle')}</span>
          <strong>{t(STEP_KEYS[step])}</strong>
        </div>
        <div
          className="lesson-progress"
          aria-label={format('lessonStepIndicator', { step: step + 1, total: STEP_KEYS.length })}
        >
          {STEP_KEYS.map((_, index) => (
            <i key={index} className={index < step ? 'done' : index === step ? 'active' : ''} />
          ))}
        </div>
      </header>

      {step === 0 ? <LessonProblem meta={meta} /> : null}
      {step === 1 ? <LessonIdea meta={meta} /> : null}
      {step === 2 ? <LessonWatch algorithm={algorithm} /> : null}
      {step === 3 ? <LessonQuiz questions={questions} choices={choices} onChoose={choose} passed={quizPassed} /> : null}
      {step === 4 ? <LessonWrapUp meta={meta} onClose={onClose} /> : null}

      <footer className="lesson-foot">
        <span className="lesson-step-count">
          {format('lessonStepIndicator', { step: step + 1, total: STEP_KEYS.length })}
        </span>
        <button
          type="button"
          className="primary-library-action"
          disabled={step === 3 ? !quizPassed : false}
          onClick={() => setStep((current) => Math.min(last, current + 1))}
        >
          {step === last ? t('lessonComplete') : t('lessonNextStep')} <ArrowRight size={15} />
        </button>
      </footer>
    </section>
  );
}

type LessonMeta = ReturnType<typeof lessonMetadata>;

function LessonProblem({ meta }: { meta: LessonMeta }) {
  const { t } = useI18n();
  return (
    <div className="lesson-body">
      <p className="lesson-lead">{meta.summary}</p>
      {meta.useCases?.length ? (
        <div className="lesson-use-cases">
          <span className="library-label">{t('useCasesTitle')}</span>
          {meta.useCases.map((useCase) => (
            <div className="use-case" key={useCase.title}>
              <strong>{useCase.title}</strong>
              <p>{useCase.context}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function LessonIdea({ meta }: { meta: LessonMeta }) {
  return (
    <div className="lesson-body">
      <ol className="lesson-explanation">
        {meta.explanation.map((part, index) => (
          <motion.li
            key={part}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.14 }}
          >
            <i>{String(index + 1).padStart(2, '0')}</i>
            <p>{part}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function LessonWatch({ algorithm }: { algorithm: CatalogAlgorithmDefinition }) {
  const { t } = useI18n();
  const [trace, setTrace] = useState<{ source: string; values: number[] } | null>(null);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (algorithm.kind !== 'sort') {
      setBusy(false);
      return;
    }
    let active = true;
    setBusy(true);
    setError(null);
    void algorithmWorker
      .trace(algorithm.source, algorithm.examples.default)
      .then((result) => {
        if (!active) return;
        setTrace({ source: algorithm.source, values: result.result });
        setStep(0);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : String(cause));
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, [algorithm]);

  if (algorithm.kind !== 'sort') {
    return <div className="lesson-trace lesson-trace-static">{t('lessonTraceNonSort')}</div>;
  }
  if (error) return <div className="lesson-trace lesson-trace-error">{error}</div>;
  if (busy || !trace) return <div className="lesson-trace lesson-trace-loading">{t('lessonTraceLoading')}</div>;

  return (
    <div className="lesson-trace">
      <p className="lesson-watch-hint">{t('lessonWatchHint')}</p>
      <div className="lesson-trace-scrub">
        <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>
          {t('playbackPrevious')}
        </button>
        <span>{step + 1}</span>
        <button type="button" onClick={() => setStep((current) => current + 1)}>
          {t('playbackNext')}
        </button>
      </div>
      <p className="lesson-trace-note">{trace.values.join(', ')}</p>
      <p className="lesson-trace-note">{t('lessonTraceReady')}</p>
    </div>
  );
}

function LessonQuiz({
  questions,
  choices,
  onChoose,
  passed,
}: {
  questions: LessonQuestion[];
  choices: QuizChoice[];
  onChoose: (choice: QuizChoice) => void;
  passed: boolean;
}) {
  const { format } = useI18n();
  const correct = choices.filter((choice) => choice.chosen === choice.question.correctIndex).length;
  return (
    <div className="lesson-body">
      <div className="lesson-quiz">
        {questions.map((question) => {
          const chosen = choices.find((choice) => choice.question.id === question.id);
          const selected = chosen?.chosen ?? -1;
          return (
            <div
              className={`quiz-question ${chosen ? (selected === question.correctIndex ? 'correct' : 'wrong') : ''}`}
              key={question.id}
            >
              <p>{question.prompt}</p>
              <div className="quiz-options">
                {question.options.map((option, optionIndex) => (
                  <button
                    type="button"
                    key={option}
                    className={chosen && chosen.chosen === optionIndex ? 'chosen' : ''}
                    onClick={() => onChoose({ question, chosen: optionIndex })}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {chosen ? (
                <div className="quiz-explain">
                  {selected === question.correctIndex ? <Check size={12} weight="bold" /> : <X size={12} />}
                  <span>{question.explanation}</span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      {passed ? (
        <div className="lesson-quiz-passed">{format('lessonQuizScore', { correct, total: questions.length })}</div>
      ) : null}
    </div>
  );
}

function LessonWrapUp({ meta, onClose }: { meta: LessonMeta; onClose?: () => void }) {
  const { t } = useI18n();
  return (
    <div className="lesson-body">
      <div className="lesson-wrapup-card">
        <span>{t('lessonWrapLabel')}</span>
        <strong>{meta.name}</strong>
        <p>{meta.summary}</p>
      </div>
      <dl className="lesson-wrapup-meta">
        <div>
          <dt>{t('lessonWrapComplexity')}</dt>
          <dd>{meta.complexity.average}</dd>
        </div>
        <div>
          <dt>{t('lessonWrapLimitation')}</dt>
          <dd>{meta.limitation}</dd>
        </div>
      </dl>
      <button type="button" className="primary-library-action" onClick={onClose}>
        {t('lessonComplete')}
      </button>
    </div>
  );
}
