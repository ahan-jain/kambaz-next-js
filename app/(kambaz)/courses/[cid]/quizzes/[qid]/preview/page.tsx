"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { setQuizzes, setQuestions } from "../../reducer";
import * as client from "../../../../client";

function gradeAnswer(q: any, answer: any): boolean {
  if (q.type === "MULTIPLE_CHOICE") {
    const correctIds = q.choices.filter((c: any) => c.isCorrect).map((c: any) => c._id);
    const selected: string[] = Array.isArray(answer) ? answer : (answer ? [answer] : []);
    return correctIds.length === selected.length && correctIds.every((id: string) => selected.includes(id));
  }
  if (q.type === "TRUE_FALSE") {
    return String(answer ?? "").toLowerCase() === String(q.correctAnswer).toLowerCase();
  }
  if (q.type === "FILL_IN_BLANK") {
    const possible = (q.possibleAnswers || []).map((a: string) => a.toLowerCase().trim());
    return possible.includes(String(answer ?? "").toLowerCase().trim());
  }
  return false;
}

function QuestionCard({
  question,
  index,
  answer,
  onAnswer,
  showResult,
}: {
  question: any;
  index: number;
  answer: any;
  onAnswer: (val: any) => void;
  showResult: boolean;
}) {
  const isCorrect = showResult ? gradeAnswer(question, answer) : false;
  const borderClass = showResult
    ? isCorrect ? "border-success" : "border-danger"
    : "border";

  return (
    <div className={`rounded p-3 mb-3 ${borderClass}`} style={{ border: "1px solid" }}>
      <div className="d-flex justify-content-between mb-2">
        <strong>Question {index + 1}</strong>
        <span className="text-muted">{question.points} pts</span>
      </div>
      <p className="mb-3">{question.question}</p>

      {question.type === "MULTIPLE_CHOICE" && (
        <div>
          {question.choices.map((c: any) => {
            const selected: string[] = Array.isArray(answer) ? answer : (answer ? [answer] : []);
            const isSelected = selected.includes(c._id);
            return (
              <div key={c._id} className="mb-2">
                <label className="d-flex align-items-center gap-2" style={{ cursor: showResult ? "default" : "pointer" }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {
                      if (showResult) return;
                      const next = isSelected ? selected.filter((id) => id !== c._id) : [...selected, c._id];
                      onAnswer(next);
                    }}
                    disabled={showResult}
                  />
                  <span className={showResult && c.isCorrect ? "text-success fw-bold" : showResult && isSelected && !c.isCorrect ? "text-danger" : ""}>
                    {c.text}
                  </span>
                  {showResult && c.isCorrect && <span className="text-success ms-1">✓</span>}
                </label>
              </div>
            );
          })}
        </div>
      )}

      {question.type === "TRUE_FALSE" && (
        <div>
          {["True", "False"].map((val) => (
            <div key={val} className="mb-2">
              <label className="d-flex align-items-center gap-2" style={{ cursor: showResult ? "default" : "pointer" }}>
                <input
                  type="radio"
                  name={`q-${question._id}`}
                  value={val}
                  checked={answer === val}
                  onChange={() => !showResult && onAnswer(val)}
                  disabled={showResult}
                />
                <span
                  className={
                    showResult && val === question.correctAnswer
                      ? "text-success fw-bold"
                      : showResult && answer === val && val !== question.correctAnswer
                      ? "text-danger"
                      : ""
                  }
                >
                  {val}
                </span>
                {showResult && val === question.correctAnswer && <span className="text-success ms-1">✓</span>}
              </label>
            </div>
          ))}
        </div>
      )}

      {question.type === "FILL_IN_BLANK" && (
        <div>
          <input
            type="text"
            className="form-control"
            placeholder="Your answer"
            value={answer ?? ""}
            onChange={(e) => !showResult && onAnswer(e.target.value)}
            disabled={showResult}
          />
          {showResult && (
            <div className="mt-1 small text-muted">
              Correct answers: {(question.possibleAnswers || []).join(", ")}
            </div>
          )}
        </div>
      )}

      {showResult && (
        <div className={`mt-3 fw-bold ${isCorrect ? "text-success" : "text-danger"}`}>
          {isCorrect ? "✓ Correct" : "✗ Incorrect"}
        </div>
      )}
    </div>
  );
}

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const dispatch = useDispatch();
  const { quizzes, questions } = useSelector((state: RootState) => state.quizzesReducer);
  const quiz = quizzes.find((q: any) => q._id === qid);
  const quizQuestions = questions.filter((q: any) => q.quiz === qid);

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (quizzes.length === 0) {
      client.findQuizzesForCourse(cid as string)
        .then((data) => dispatch(setQuizzes(data)))
        .catch(() => {});
    }
    client.findQuestionsForQuiz(qid as string)
      .then((data) => dispatch(setQuestions(data)))
      .catch(() => {});
  }, [qid]);

  const handleAnswer = (questionId: string, val: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const handleSubmit = () => {
    let total = 0;
    quizQuestions.forEach((q: any) => {
      if (gradeAnswer(q, answers[q._id])) total += q.points || 0;
    });
    setScore(total);
    setSubmitted(true);
    setCurrentIndex(0);
  };

  if (!quiz) return <div className="p-4 text-muted">Loading...</div>;

  const currentQuestion = quizQuestions[currentIndex];

  return (
    <div id="wd-quiz-preview" className="p-3">
      <div className="alert alert-warning mb-3">
        &#9432; This is a preview of the published version of the quiz.
        <div className="small mt-1">
          Started: {new Date().toLocaleString()}
        </div>
      </div>

      <h4>{quiz.title}</h4>

      {quiz.description && (
        <div className="mb-3 p-2 bg-light rounded">
          <strong>Quiz Instructions</strong>
          <p className="mb-0 mt-1">{quiz.description}</p>
        </div>
      )}

      {quizQuestions.length === 0 && (
        <div className="alert alert-info">No questions in this quiz yet.</div>
      )}

{currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          index={currentIndex}
          answer={answers[currentQuestion._id]}
          onAnswer={(val) => handleAnswer(currentQuestion._id, val)}
          showResult={submitted}
        />
      )}

      {submitted && (
        <div className="alert alert-success mt-2">
          <strong>Score: {score} / {quiz.points}</strong>
        </div>
      )}

{quizQuestions.length > 0 && (
        <div className="d-flex flex-wrap gap-2 my-3 align-items-center">
          <span className="text-muted small me-1">Jump to:</span>
          {quizQuestions.map((_: any, idx: number) => (
            <button
              key={idx}
              className={`btn btn-sm ${
                idx === currentIndex
                  ? "btn-danger"
                  : answers[quizQuestions[idx]._id] !== undefined
                  ? "btn-outline-secondary"
                  : "btn-outline-light border"
              }`}
              onClick={() => setCurrentIndex(idx)}
              style={{ minWidth: 36 }}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

{quizQuestions.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3 border-top pt-3">
          <button
            className="btn btn-secondary"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
          >
            &#8592; Back
          </button>

          <span className="text-muted small">
            Question {currentIndex + 1} of {quizQuestions.length}
          </span>

          {currentIndex < quizQuestions.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => setCurrentIndex((i) => i + 1)}
            >
              Next &#8594;
            </button>
          ) : !submitted ? (
            <button className="btn btn-danger" onClick={handleSubmit}>
              Submit Quiz
            </button>
          ) : (
            <span />
          )}
        </div>
      )}

      <div className="d-flex justify-content-center mt-4">
        <Link href={`/courses/${cid}/quizzes/${qid}/edit`}>
          <button className="btn btn-outline-secondary">
            &#9998; Keep Editing This Quiz
          </button>
        </Link>
      </div>
    </div>
  );
}
