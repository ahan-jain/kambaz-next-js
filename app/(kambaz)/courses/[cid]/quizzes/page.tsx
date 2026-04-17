"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ListGroup, ListGroupItem, Dropdown } from "react-bootstrap";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaCheckCircle, FaBan } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setQuizzes, deleteQuiz, togglePublishQuiz } from "./reducer";
import * as client from "../../client";

function parseDate(d: string): Date {
  return new Date(d.substring(0, 10).replace(/-/g, "/"));
}

function getAvailabilityLabel(quiz: any): string {
  const now = new Date();
  const available = quiz.availableDate ? parseDate(quiz.availableDate) : null;
  const until = quiz.availableUntil ? parseDate(quiz.availableUntil) : null;
  if (available && now < available) {
    return `Not available until ${available.toLocaleDateString()}`;
  }
  if (until && now > until) {
    return "Closed";
  }
  return "Available";
}

export default function Quizzes() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes, questions } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [search, setSearch] = useState("");
  const [myScores, setMyScores] = useState<Record<string, number | null>>({});

  const fetchQuizzes = async () => {
    try {
      const data = await client.findQuizzesForCourse(cid as string);
      dispatch(setQuizzes(data));
    } catch {
      dispatch(setQuizzes([]));
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [cid]);

  useEffect(() => {
    if (currentUser?.role !== "STUDENT" || quizzes.length === 0) return;
    const courseQuizzes = quizzes.filter((q: any) => q.course === cid && q.published);
    Promise.all(
      courseQuizzes.map((q: any) =>
        client.findMyAttemptForQuiz(q._id).catch(() => null)
      )
    ).then((results) => {
      const scores: Record<string, number | null> = {};
      courseQuizzes.forEach((q: any, i: number) => {
        scores[q._id] = results[i]?.score ?? null;
      });
      setMyScores(scores);
    });
  }, [quizzes, currentUser]);

  const handleAddQuiz = async () => {
    const newQuiz = {
      title: "Unnamed Quiz",
      course: cid,
      description: "",
      quizType: "GRADED_QUIZ",
      assignmentGroup: "QUIZZES",
      shuffleAnswers: true,
      timeLimit: 20,
      multipleAttempts: false,
      howManyAttempts: 1,
      showCorrectAnswers: "IMMEDIATELY",
      accessCode: "",
      oneQuestionAtATime: true,
      webcamRequired: false,
      lockQuestionsAfterAnswering: false,
      dueDate: "",
      availableDate: "",
      availableUntil: "",
      published: false,
      points: 0,
    };
    try {
      const created = await client.createQuizForCourse(cid as string, newQuiz);
      dispatch(setQuizzes([...quizzes, created]));
      router.push(`/courses/${cid}/quizzes/${created._id}/edit`);
    } catch {
      const tempId = `new-${Date.now()}`;
      dispatch(setQuizzes([...quizzes, { ...newQuiz, _id: tempId }]));
      router.push(`/courses/${cid}/quizzes/${tempId}/edit`);
    }
  };

  const handleDelete = async (quizId: string) => {
    const ok = window.confirm("Are you sure you want to delete this quiz?");
    if (!ok) return;
    try {
      await client.deleteQuiz(quizId);
    } catch {}
    dispatch(deleteQuiz(quizId));
  };

  const handleTogglePublish = async (quizId: string, currentPublished: boolean) => {
    try {
      await client.publishQuiz(quizId, !currentPublished);
    } catch {}
    dispatch(togglePublishQuiz(quizId));
  };

  const filteredQuizzes = quizzes
    .filter((q: any) => {
      if (q.course !== cid) return false;
      if (currentUser?.role === "STUDENT" && !q.published) return false;
      return q.title.toLowerCase().includes(search.toLowerCase());
    })
    .slice()
    .sort((a: any, b: any) => {
      const da = a.availableDate ? parseDate(a.availableDate).getTime() : 0;
      const db = b.availableDate ? parseDate(b.availableDate).getTime() : 0;
      return da - db;
    });

  return (
    <div id="wd-quizzes">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="position-relative">
          <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
          <input
            id="wd-search-quiz"
            className="form-control ps-5"
            placeholder="Search for Quiz"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {currentUser?.role === "FACULTY" && (
          <button
            id="wd-add-quiz"
            className="btn btn-danger"
            onClick={handleAddQuiz}
          >
            <BsPlus className="fs-5" /> Quiz
          </button>
        )}
      </div>

      <ListGroup className="rounded-0" id="wd-quiz-list">
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
            <div>
              <BsGripVertical className="me-2 fs-3" />
              Assignment Quizzes
            </div>
            <div>
              <BsPlus className="fs-4" />
              <IoEllipsisVertical className="fs-4" />
            </div>
          </div>

          <ListGroup className="rounded-0">
            {filteredQuizzes.length === 0 && (
              <ListGroupItem className="p-3 text-muted fst-italic">
                No quizzes yet. Click <strong>+ Quiz</strong> to add one.
              </ListGroupItem>
            )}
            {filteredQuizzes.map((quiz: any) => (
              <ListGroupItem
                key={quiz._id}
                className="wd-quiz-item p-3 ps-1 d-flex align-items-start"
              >
                <BsGripVertical className="me-2 fs-3 mt-1" />
                <span className="me-3 mt-1" style={{ color: "green", fontSize: "1.2rem" }}>
                  &#10003;
                </span>
                <div className="flex-fill">
                  <Link
                    href={`/courses/${cid}/quizzes/${quiz._id}`}
                    className="wd-quiz-link text-decoration-none text-dark fw-bold"
                  >
                    {quiz.title}
                  </Link>
                  <br />
                  <span className="text-muted small">
                    <span
                      className={
                        getAvailabilityLabel(quiz) === "Closed"
                          ? "text-danger fw-bold"
                          : getAvailabilityLabel(quiz) === "Available"
                          ? "text-success fw-bold"
                          : "fw-bold"
                      }
                    >
                      {getAvailabilityLabel(quiz)}
                    </span>
                    {quiz.dueDate && (
                      <>
                        {" "}| <b>Due</b>{" "}
                        {parseDate(quiz.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        {" at "}
                        {parseDate(quiz.dueDate).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </>
                    )}
                    {" "}| {quiz.points} pts | {questions.filter((q: any) => q.quiz === quiz._id).length} Questions
                    {currentUser?.role === "STUDENT" && myScores[quiz._id] != null && (
                      <> | <b>Score:</b> {myScores[quiz._id]} / {quiz.points}</>
                    )}
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2 mt-1">
                  {currentUser?.role === "FACULTY" && (
                    <button
                      className="btn btn-sm btn-link p-0"
                      title={quiz.published ? "Published – click to unpublish" : "Unpublished – click to publish"}
                      onClick={() => handleTogglePublish(quiz._id, quiz.published)}
                    >
                      {quiz.published ? (
                        <FaCheckCircle className="text-success fs-5" />
                      ) : (
                        <FaBan className="text-danger fs-5" />
                      )}
                    </button>
                  )}
                  {currentUser?.role === "STUDENT" && (
                    <span>
                      {quiz.published ? (
                        <FaCheckCircle className="text-success fs-5" />
                      ) : (
                        <FaBan className="text-danger fs-5" />
                      )}
                    </span>
                  )}

                  {currentUser?.role === "FACULTY" && (
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        as="span"
                        style={{ cursor: "pointer" }}
                        id={`quiz-menu-${quiz._id}`}
                      >
                        <IoEllipsisVertical className="fs-4" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          as={Link}
                          href={`/courses/${cid}/quizzes/${quiz._id}/edit`}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDelete(quiz._id)}>
                          Delete
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleTogglePublish(quiz._id, quiz.published)}
                        >
                          {quiz.published ? "Unpublish" : "Publish"}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
