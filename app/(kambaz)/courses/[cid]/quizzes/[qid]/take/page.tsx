"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { setQuizzes, setQuestions, setAttempts, addAttempt } from "../../reducer";
import * as client from "../../../../client";

export default function QuizTake() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes, questions, attempts } = useSelector(
    (state: RootState) => state.quizzesReducer
  );
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const quiz = quizzes.find((q: any) => q._id === qid);
  const quizQuestions = questions.filter((q: any) => q.quiz === qid);

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [gradedAttempt, setGradedAttempt] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        if (quizzes.length === 0) {
          const qdata = await client.findQuizzesForCourse(cid as string);
          dispatch(setQuizzes(qdata));
        }
        const qsts = await client.findQuestionsForQuiz(qid as string);
        dispatch(setQuestions(qsts));

        if (currentUser?.role === "STUDENT") {
          try {
            const myAttempts = await client.findMyAttemptsForQuiz(qid as string);
            if (myAttempts && myAttempts.length > 0) {
              const latest = myAttempts[0];
              const count = myAttempts.length;
              dispatch(setAttempts(myAttempts));
              const theQuiz = quizzes.find((q: any) => q._id === qid) ||
                (await client.findQuizzesForCourse(cid as string)).find((q: any) => q._id === qid);
              const maxAttempts = theQuiz?.multipleAttempts ? theQuiz?.howManyAttempts : 1;
              if (count >= maxAttempts) {
                setGradedAttempt(latest);
                setSubmitted(true);
                const ansMap: Record<string, any> = {};
                (latest.answers || []).forEach((a: any) => { ansMap[a.question] = a.answer; });
                setAnswers(ansMap);
              }
            }
          } catch {}
        }
      } catch {}
      setLoading(false);
    };
    init();
  }, [qid]);

  const handleAnswer = (questionId: string, val: any) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const handleSubmit = async () => {
    const answerList = quizQuestions.map((q: any) => ({
      question: q._id,
      answer: answers[q._id] ?? null,
    }));

    const result = await client.submitQuizAttempt(qid as string, answerList);
    dispatch(addAttempt(result));
    setGradedAttempt(result);
    setSubmitted(true);
  };

  if (loading) return <div className="p-4 text-muted">Loading quiz...</div>;
  if (!quiz) return <div className="p-4 text-muted">Quiz not found.</div>;

  if (!quiz.published && currentUser?.role === "STUDENT") {
    return (
      <div className="p-4">
        <div className="alert alert-warning">This quiz is not yet available.</div>
        <Link href={`/courses/${cid}/quizzes`}>
          <button className="btn btn-secondary">Back to Quizzes</button>
        </Link>
      </div>
    );
  }

  const oneAtATime = quiz.oneQuestionAtATime;
  const displayedQuestions = oneAtATime
    ? [quizQuestions[currentIndex]].filter(Boolean)
    : quizQuestions;

  const getAnswerResult = (questionId: string) =>
    gradedAttempt?.answers?.find((a: any) => a.question === questionId);

  return (
    <div id="wd-quiz-take" className="p-3">
      <h4>{quiz.title}</h4>
      {quiz.description && <p className="text-muted">{quiz.description}</p>}

      {submitted && (
        <div className="alert alert-success mb-3">
          <strong>Score: {gradedAttempt?.score ?? 0} / {quiz.points}</strong>
        </div>
      )}

      {quizQuestions.length === 0 && (
        <div className="alert alert-info">This quiz has no questions.</div>
      )}

      {displayedQuestions.map((q: any, idx: number) => {
        const result = submitted ? getAnswerResult(q._id) : null;
        const isCorrect = result?.isCorrect;
        const borderClass = submitted
          ? isCorrect
            ? "border-success"
            : "border-danger"
          : "";

        return (
          <div key={q._id} className={`border rounded p-3 mb-3 ${borderClass}`}>
            <div className="d-flex justify-content-between mb-2">
              <strong>Question {oneAtATime ? currentIndex + 1 : idx + 1}</strong>
              <span className="text-muted">{q.points} pts</span>
            </div>
            <p>{q.question}</p>

            {q.type === "MULTIPLE_CHOICE" && (
              <div>
                {q.choices.map((c: any) => {
                  const selected: string[] = Array.isArray(answers[q._id]) ? answers[q._id] : (answers[q._id] ? [answers[q._id]] : []);
                  const isSelected = selected.includes(c._id);
                  return (
                    <div key={c._id} className="mb-1">
                      <label className="d-flex align-items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            const next = isSelected ? selected.filter((id) => id !== c._id) : [...selected, c._id];
                            handleAnswer(q._id, next);
                          }}
                          disabled={submitted}
                        />
                        <span className={submitted && c.isCorrect ? "text-success fw-bold" : submitted && isSelected && !c.isCorrect ? "text-danger" : ""}>
                          {c.text}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            )}

            {q.type === "TRUE_FALSE" && (
              <div>
                {["True", "False"].map((val) => (
                  <div key={val} className="mb-1">
                    <label className="d-flex align-items-center gap-2">
                      <input
                        type="radio"
                        name={`q-${q._id}`}
                        value={val}
                        checked={answers[q._id] === val}
                        onChange={() => handleAnswer(q._id, val)}
                        disabled={submitted}
                      />
                      <span
                        className={
                          submitted && val === q.correctAnswer
                            ? "text-success fw-bold"
                            : submitted &&
                              answers[q._id] === val &&
                              val !== q.correctAnswer
                            ? "text-danger"
                            : ""
                        }
                      >
                        {val}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {q.type === "FILL_IN_BLANK" && (
              <div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your answer"
                  value={answers[q._id] || ""}
                  onChange={(e) => handleAnswer(q._id, e.target.value)}
                  disabled={submitted}
                />
                {submitted && (
                  <div className="mt-1 small text-muted">
                    Correct answers: {(q.possibleAnswers || []).join(", ")}
                  </div>
                )}
              </div>
            )}

            {submitted && (
              <div
                className={`mt-2 fw-bold ${
                  isCorrect ? "text-success" : "text-danger"
                }`}
              >
                {isCorrect ? "✓ Correct" : "✗ Incorrect"}
              </div>
            )}
          </div>
        );
      })}

{oneAtATime && !submitted && quizQuestions.length > 0 && (
        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn btn-secondary"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
          >
            &#8592; Back
          </button>
          {currentIndex < quizQuestions.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => setCurrentIndex((i) => i + 1)}
            >
              Next &#8594;
            </button>
          ) : (
            <button className="btn btn-danger" onClick={handleSubmit}>
              Submit Quiz
            </button>
          )}
        </div>
      )}

      {oneAtATime && submitted && quizQuestions.length > 0 && (
        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn btn-secondary"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
          >
            &#8592; Back
          </button>
          {currentIndex < quizQuestions.length - 1 && (
            <button
              className="btn btn-primary"
              onClick={() => setCurrentIndex((i) => i + 1)}
            >
              Next &#8594;
            </button>
          )}
        </div>
      )}

      {!oneAtATime && !submitted && quizQuestions.length > 0 && (
        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-danger" onClick={handleSubmit}>
            Submit Quiz
          </button>
        </div>
      )}

      <div className="mt-4">
        <Link href={`/courses/${cid}/quizzes`}>
          <button className="btn btn-outline-secondary">Back to Quizzes</button>
        </Link>
      </div>
    </div>
  );
}
