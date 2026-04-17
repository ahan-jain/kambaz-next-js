"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { setQuizzes, setQuestions, updateQuiz } from "../reducer";
import * as client from "../../../client";

const QUIZ_TYPE_LABELS: Record<string, string> = {
  GRADED_QUIZ: "Graded Quiz",
  PRACTICE_QUIZ: "Practice Quiz",
  GRADED_SURVEY: "Graded Survey",
  UNGRADED_SURVEY: "Ungraded Survey",
};

const ASSIGNMENT_GROUP_LABELS: Record<string, string> = {
  QUIZZES: "Quizzes",
  EXAMS: "Exams",
  ASSIGNMENTS: "Assignments",
  PROJECT: "Project",
};

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const dispatch = useDispatch();
  const { quizzes, questions } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [myAttempt, setMyAttempt] = useState<any>(null);

  const quiz = quizzes.find((q: any) => q._id === qid);

  const handleTogglePublish = async () => {
    if (!quiz) return;
    const updated = { ...quiz, published: !quiz.published };
    try {
      await client.publishQuiz(qid as string, updated.published);
    } catch {}
    dispatch(updateQuiz(updated));
  };

  useEffect(() => {
    if (quizzes.length === 0) {
      client.findQuizzesForCourse(cid as string)
        .then((data) => dispatch(setQuizzes(data)))
        .catch(() => {});
    }
    client.findQuestionsForQuiz(qid as string)
      .then((data) => dispatch(setQuestions(data)))
      .catch(() => {});
    if (currentUser?.role === "STUDENT") {
      client.findMyAttemptForQuiz(qid as string)
        .then((data) => setMyAttempt(data))
        .catch(() => {});
    }
  }, [qid]);

  if (!quiz) {
    return <div className="p-4 text-muted">Loading quiz...</div>;
  }

  const quizQuestions = questions.filter((q: any) => q.quiz === qid);

  const formatDate = (d: string) => {
    if (!d) return "N/A";
    return new Date(d.substring(0, 10).replace(/-/g, "/")).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  return (
    <div id="wd-quiz-details" className="p-3">
      {currentUser?.role === "FACULTY" && (
        <div className="d-flex justify-content-end mb-3 gap-2">
          <button
            className={`btn ${quiz.published ? "btn-secondary" : "btn-outline-secondary"}`}
            onClick={handleTogglePublish}
          >
            {quiz.published ? "Unpublish" : "Publish"}
          </button>
          <Link href={`/courses/${cid}/quizzes/${qid}/preview`}>
            <button className="btn btn-secondary">Preview</button>
          </Link>
          <Link href={`/courses/${cid}/quizzes/${qid}/edit`}>
            <button className="btn btn-secondary">
              <span className="me-1">&#9998;</span> Edit
            </button>
          </Link>
        </div>
      )}

      <hr />
      <h3 className="mb-4">{quiz.title}</h3>

      <table className="table table-borderless" style={{ maxWidth: 600 }}>
        <tbody>
          <tr>
            <td className="text-end fw-semibold text-muted" style={{ width: "40%" }}>Quiz Type</td>
            <td>{QUIZ_TYPE_LABELS[quiz.quizType] ?? quiz.quizType}</td>
          </tr>
          <tr>
            <td className="text-end fw-semibold text-muted">Points</td>
            <td>{quiz.points}</td>
          </tr>
          <tr>
            <td className="text-end fw-semibold text-muted">Assignment Group</td>
            <td>{ASSIGNMENT_GROUP_LABELS[quiz.assignmentGroup] ?? quiz.assignmentGroup}</td>
          </tr>
          <tr>
            <td className="text-end fw-semibold text-muted">Shuffle Answers</td>
            <td>{quiz.shuffleAnswers ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td className="text-end fw-semibold text-muted">Time Limit</td>
            <td>{quiz.timeLimit > 0 ? `${quiz.timeLimit} Minutes` : "No Limit"}</td>
          </tr>
          <tr>
            <td className="text-end fw-semibold text-muted">Multiple Attempts</td>
            <td>{quiz.multipleAttempts ? `Yes (${quiz.howManyAttempts})` : "No"}</td>
          </tr>
          <tr>
            <td className="text-end fw-semibold text-muted">View Responses</td>
            <td>Always</td>
          </tr>
          <tr>
            <td className="text-end fw-semibold text-muted">Show Correct Answers</td>
            <td>
              {quiz.showCorrectAnswers === "IMMEDIATELY"
                ? "Immediately"
                : quiz.showCorrectAnswers === "NEVER"
                ? "Never"
                : "After Due Date"}
            </td>
          </tr>
          <tr>
            <td className="text-end fw-semibold text-muted">One Question at a Time</td>
            <td>{quiz.oneQuestionAtATime ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td className="text-end fw-semibold text-muted">Require Respondus LockDown Browser</td>
            <td>No</td>
          </tr>
          <tr>
            <td className="text-end fw-semibold text-muted">Required to View Quiz Results</td>
            <td>No</td>
          </tr>
          <tr>
            <td className="text-end fw-semibold text-muted">Webcam Required</td>
            <td>{quiz.webcamRequired ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td className="text-end fw-semibold text-muted">Lock Questions After Answering</td>
            <td>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td className="text-end fw-semibold text-muted">Questions</td>
            <td>{quizQuestions.length}</td>
          </tr>
        </tbody>
      </table>

      <table className="table table-bordered mt-3" style={{ maxWidth: 600 }}>
        <thead className="table-light">
          <tr>
            <th>Due</th>
            <th>For</th>
            <th>Available from</th>
            <th>Until</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formatDate(quiz.dueDate)}</td>
            <td>Everyone</td>
            <td>{formatDate(quiz.availableDate)}</td>
            <td>{formatDate(quiz.availableUntil)}</td>
          </tr>
        </tbody>
      </table>

      {currentUser?.role === "STUDENT" && (
        <div className="mt-4">
          {myAttempt ? (
            <div>
              <div className="alert alert-info">
                <strong>Your last score:</strong> {myAttempt.score} / {quiz.points}
              </div>
              <Link href={`/courses/${cid}/quizzes/${qid}/take`}>
                <button className="btn btn-danger me-2">
                  {quiz.multipleAttempts ? "Retake Quiz" : "View Results"}
                </button>
              </Link>
            </div>
          ) : (
            <Link href={`/courses/${cid}/quizzes/${qid}/take`}>
              <button className="btn btn-danger">Start Quiz</button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
