"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, FormControl, FormLabel, Row, Col, FormSelect, FormCheck } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { setQuizzes, updateQuiz, addQuestion, updateQuestion, deleteQuestion, setQuestions } from "../../reducer";
import * as client from "../../../../client";
import { v4 as uuidv4 } from "uuid";

type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";

function blankQuestion(quizId: string): any {
  return {
    _id: uuidv4(),
    quiz: quizId,
    title: "New Question",
    type: "MULTIPLE_CHOICE" as QuestionType,
    points: 1,
    question: "",
    choices: [
      { _id: uuidv4(), text: "", isCorrect: true },
      { _id: uuidv4(), text: "", isCorrect: false },
    ],
    correctAnswer: "True",
    possibleAnswers: [""],
  };
}

function MultipleChoiceEditor({ q, onChange }: { q: any; onChange: (q: any) => void }) {
  const addChoice = () =>
    onChange({ ...q, choices: [...q.choices, { _id: uuidv4(), text: "", isCorrect: false }] });
  const removeChoice = (id: string) =>
    onChange({ ...q, choices: q.choices.filter((c: any) => c._id !== id) });
  const toggleCorrect = (id: string) =>
    onChange({ ...q, choices: q.choices.map((c: any) => c._id === id ? { ...c, isCorrect: !c.isCorrect } : c) });
  const updateText = (id: string, text: string) =>
    onChange({ ...q, choices: q.choices.map((c: any) => c._id === id ? { ...c, text } : c) });

  return (
    <div>
      <FormLabel className="fw-semibold mt-2">Answers:</FormLabel>
      {q.choices.map((c: any) => (
        <div key={c._id} className="d-flex align-items-center mb-2 gap-2">
          <input
            type="checkbox"
            checked={c.isCorrect}
            onChange={() => toggleCorrect(c._id)}
            title="Mark as correct answer"
          />
          <FormControl
            placeholder={c.isCorrect ? "Correct Answer" : "Possible Answer"}
            value={c.text}
            onChange={(e) => updateText(c._id, e.target.value)}
            className={c.isCorrect ? "border-success" : ""}
          />
          <button className="btn btn-sm btn-outline-danger" onClick={() => removeChoice(c._id)}>
            &#128465;
          </button>
        </div>
      ))}
      <button className="btn btn-link p-0 mt-1" onClick={addChoice}>
        + Add Another Answer
      </button>
    </div>
  );
}

function TrueFalseEditor({ q, onChange }: { q: any; onChange: (q: any) => void }) {
  return (
    <div>
      <FormLabel className="fw-semibold mt-2">Answers:</FormLabel>
      {["True", "False"].map((val) => (
        <div key={val} className="d-flex align-items-center mb-2 gap-2">
          <input
            type="radio"
            name={`tf-${q._id}`}
            checked={q.correctAnswer === val}
            onChange={() => onChange({ ...q, correctAnswer: val })}
          />
          <span className={q.correctAnswer === val ? "text-success fw-bold" : ""}>{val}</span>
        </div>
      ))}
    </div>
  );
}

function FillInBlankEditor({ q, onChange }: { q: any; onChange: (q: any) => void }) {
  const addAnswer = () => onChange({ ...q, possibleAnswers: [...(q.possibleAnswers || []), ""] });
  const removeAnswer = (idx: number) =>
    onChange({ ...q, possibleAnswers: q.possibleAnswers.filter((_: any, i: number) => i !== idx) });
  const updateAnswer = (idx: number, val: string) => {
    const updated = [...q.possibleAnswers];
    updated[idx] = val;
    onChange({ ...q, possibleAnswers: updated });
  };

  return (
    <div>
      <FormLabel className="fw-semibold mt-2">Answers:</FormLabel>
      {(q.possibleAnswers || []).map((ans: string, idx: number) => (
        <div key={idx} className="d-flex align-items-center mb-2 gap-2">
          <FormControl
            placeholder="Possible Answer"
            value={ans}
            onChange={(e) => updateAnswer(idx, e.target.value)}
          />
          <button className="btn btn-sm btn-outline-danger" onClick={() => removeAnswer(idx)}>
            &#128465;
          </button>
        </div>
      ))}
      <button className="btn btn-link p-0 mt-1" onClick={addAnswer}>
        + Add Another Answer
      </button>
    </div>
  );
}

function QuestionEditor({
  question,
  onSave,
  onCancel,
}: {
  question: any;
  onSave: (q: any) => void;
  onCancel: () => void;
}) {
  const [q, setQ] = useState<any>(question);

  return (
    <div className="border rounded p-3 mb-3 bg-light">
      <Row className="mb-2 align-items-center">
        <Col md={4}>
          <FormControl
            placeholder="Question Title"
            value={q.title}
            onChange={(e) => setQ({ ...q, title: e.target.value })}
          />
        </Col>
        <Col md={4}>
          <FormSelect
            value={q.type}
            onChange={(e) => setQ({ ...q, type: e.target.value })}
          >
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True/False</option>
            <option value="FILL_IN_BLANK">Fill In the Blank</option>
          </FormSelect>
        </Col>
        <Col md={2}>
          <div className="d-flex align-items-center gap-1">
            <span>pts:</span>
            <FormControl
              type="number"
              min={0}
              value={q.points}
              onChange={(e) => setQ({ ...q, points: Number(e.target.value) })}
              style={{ width: 70 }}
            />
          </div>
        </Col>
      </Row>

      <FormLabel className="fw-semibold">Question:</FormLabel>
      <FormControl
        as="textarea"
        rows={3}
        className="mb-2"
        placeholder="Enter your question text here"
        value={q.question}
        onChange={(e) => setQ({ ...q, question: e.target.value })}
      />

      {q.type === "MULTIPLE_CHOICE" && (
        <MultipleChoiceEditor q={q} onChange={setQ} />
      )}
      {q.type === "TRUE_FALSE" && (
        <TrueFalseEditor q={q} onChange={setQ} />
      )}
      {q.type === "FILL_IN_BLANK" && (
        <FillInBlankEditor q={q} onChange={setQ} />
      )}

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button className="btn btn-secondary btn-sm" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => onSave(q)}>
          Update Question
        </button>
      </div>
    </div>
  );
}

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes, questions } = useSelector((state: RootState) => state.quizzesReducer);
  const [activeTab, setActiveTab] = useState<"details" | "questions">("details");
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const quizFromStore = quizzes.find((q: any) => q._id === qid);
  const [quiz, setQuiz] = useState<any>(
    quizFromStore || {
      _id: qid,
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
    }
  );

  const quizQuestions = questions.filter((q: any) => q.quiz === qid);
  const totalPoints = quizQuestions.reduce((s: number, q: any) => s + (q.points || 0), 0);

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

  useEffect(() => {
    if (quizFromStore) setQuiz(quizFromStore);
  }, [quizFromStore]);

  const saveQuiz = async (andPublish = false, navigateTo?: string) => {
    const updated = { ...quiz, course: cid, published: andPublish ? true : quiz.published };
    try {
      await client.updateQuiz(updated);
    } catch {}
    dispatch(updateQuiz(updated));
    router.push(navigateTo ?? `/courses/${cid}/quizzes/${qid}`);
  };

  const handleAddQuestion = async () => {
    const newQ = blankQuestion(qid as string);
    try {
      const created = await client.createQuestionForQuiz(qid as string, newQ);
      dispatch(addQuestion(created));
      setEditingQuestionId(created._id);
    } catch {
      dispatch(addQuestion(newQ));
      setEditingQuestionId(newQ._id);
    }
  };

  const handleSaveQuestion = async (q: any) => {
    try {
      await client.updateQuestion(q);
    } catch {}
    dispatch(updateQuestion(q));
    setEditingQuestionId(null);
    const updatedPoints = quizQuestions
      .map((existing: any) => (existing._id === q._id ? q : existing))
      .reduce((s: number, item: any) => s + (item.points || 0), 0);
    const updatedQuiz = { ...quiz, points: updatedPoints };
    setQuiz(updatedQuiz);
    dispatch(updateQuiz(updatedQuiz));
  };

  const handleDeleteQuestion = async (questionId: string) => {
    const ok = window.confirm("Are you sure you want to delete this question?");
    if (!ok) return;
    try {
      await client.deleteQuestion(questionId);
    } catch {}
    dispatch(deleteQuestion(questionId));
  };

  return (
    <div id="wd-quiz-editor" className="p-3">
      <div className="d-flex justify-content-end mb-2">
        <span className="me-3 text-muted">Points {totalPoints}</span>
        <span className={`badge ${quiz.published ? "bg-success" : "bg-secondary"}`}>
          {quiz.published ? "Published" : "Not Published"}
        </span>
      </div>


      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "questions" ? "active" : ""}`}
            onClick={() => setActiveTab("questions")}
          >
            Questions
          </button>
        </li>
      </ul>


      {activeTab === "details" && (
        <div id="wd-quiz-details-editor">
          <FormLabel htmlFor="wd-quiz-title">
            <h5>Quiz Title</h5>
          </FormLabel>
          <FormControl
            id="wd-quiz-title"
            className="mb-3"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
          />

          <FormLabel htmlFor="wd-quiz-description">Quiz Instructions:</FormLabel>
          <FormControl
            as="textarea"
            id="wd-quiz-description"
            rows={5}
            className="mb-4"
            placeholder="Enter quiz instructions here"
            value={quiz.description}
            onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
          />

          <Row className="mb-3">
            <Col sm={4} className="text-end pt-1">
              <FormLabel>Quiz Type</FormLabel>
            </Col>
            <Col sm={8}>
              <FormSelect
                value={quiz.quizType}
                onChange={(e) => setQuiz({ ...quiz, quizType: e.target.value })}
              >
                <option value="GRADED_QUIZ">Graded Quiz</option>
                <option value="PRACTICE_QUIZ">Practice Quiz</option>
                <option value="GRADED_SURVEY">Graded Survey</option>
                <option value="UNGRADED_SURVEY">Ungraded Survey</option>
              </FormSelect>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={4} className="text-end pt-1">
              <FormLabel>Assignment Group</FormLabel>
            </Col>
            <Col sm={8}>
              <FormSelect
                value={quiz.assignmentGroup}
                onChange={(e) => setQuiz({ ...quiz, assignmentGroup: e.target.value })}
              >
                <option value="QUIZZES">Quizzes</option>
                <option value="EXAMS">Exams</option>
                <option value="ASSIGNMENTS">Assignments</option>
                <option value="PROJECT">Project</option>
              </FormSelect>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={4} className="text-end pt-1">
              <FormLabel htmlFor="wd-quiz-points">Points</FormLabel>
            </Col>
            <Col sm={8}>
              <FormControl
                id="wd-quiz-points"
                type="number"
                min={0}
                value={quiz.points}
                onChange={(e) => setQuiz({ ...quiz, points: Number(e.target.value) })}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={4} className="text-end pt-1">
              <FormLabel>Options</FormLabel>
            </Col>
            <Col sm={8}>
              <div className="border rounded p-3">
                <FormCheck
                  id="wd-shuffle-answers"
                  label="Shuffle Answers"
                  checked={quiz.shuffleAnswers}
                  onChange={(e) => setQuiz({ ...quiz, shuffleAnswers: e.target.checked })}
                  className="mb-2"
                />
                <div className="d-flex align-items-center mb-2 gap-2">
                  <FormCheck
                    id="wd-time-limit"
                    label="Time Limit"
                    checked={quiz.timeLimit > 0}
                    onChange={(e) => setQuiz({ ...quiz, timeLimit: e.target.checked ? 20 : 0 })}
                  />
                  {quiz.timeLimit > 0 && (
                    <>
                      <FormControl
                        type="number"
                        min={1}
                        value={quiz.timeLimit}
                        onChange={(e) => setQuiz({ ...quiz, timeLimit: Number(e.target.value) })}
                        style={{ width: 80 }}
                      />
                      <span>Minutes</span>
                    </>
                  )}
                </div>
                <FormCheck
                  id="wd-multiple-attempts"
                  label="Allow Multiple Attempts"
                  checked={quiz.multipleAttempts}
                  onChange={(e) => setQuiz({ ...quiz, multipleAttempts: e.target.checked })}
                  className="mb-2"
                />
                {quiz.multipleAttempts && (
                  <Row className="ms-3 mb-2">
                    <Col sm={6}>
                      <FormLabel className="small">How Many Attempts</FormLabel>
                      <FormControl
                        type="number"
                        min={1}
                        value={quiz.howManyAttempts}
                        onChange={(e) => setQuiz({ ...quiz, howManyAttempts: Number(e.target.value) })}
                      />
                    </Col>
                  </Row>
                )}
              </div>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={4} className="text-end pt-1">
              <FormLabel>Show Correct Answers</FormLabel>
            </Col>
            <Col sm={8}>
              <FormSelect
                value={quiz.showCorrectAnswers}
                onChange={(e) => setQuiz({ ...quiz, showCorrectAnswers: e.target.value })}
              >
                <option value="IMMEDIATELY">Immediately</option>
                <option value="NEVER">Never</option>
                <option value="AFTER_DUE_DATE">After Due Date</option>
              </FormSelect>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={4} className="text-end pt-1">
              <FormLabel>Access Code</FormLabel>
            </Col>
            <Col sm={8}>
              <FormControl
                placeholder="Leave blank for no access code"
                value={quiz.accessCode}
                onChange={(e) => setQuiz({ ...quiz, accessCode: e.target.value })}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={4} className="text-end pt-1">
              <FormLabel>One Question at a Time</FormLabel>
            </Col>
            <Col sm={8}>
              <FormSelect
                value={quiz.oneQuestionAtATime ? "yes" : "no"}
                onChange={(e) => setQuiz({ ...quiz, oneQuestionAtATime: e.target.value === "yes" })}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </FormSelect>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={4} className="text-end pt-1">
              <FormLabel>Webcam Required</FormLabel>
            </Col>
            <Col sm={8}>
              <FormSelect
                value={quiz.webcamRequired ? "yes" : "no"}
                onChange={(e) => setQuiz({ ...quiz, webcamRequired: e.target.value === "yes" })}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </FormSelect>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={4} className="text-end pt-1">
              <FormLabel>Lock Questions After Answering</FormLabel>
            </Col>
            <Col sm={8}>
              <FormSelect
                value={quiz.lockQuestionsAfterAnswering ? "yes" : "no"}
                onChange={(e) => setQuiz({ ...quiz, lockQuestionsAfterAnswering: e.target.value === "yes" })}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </FormSelect>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={4} className="text-end">
              <FormLabel>Assign</FormLabel>
            </Col>
            <Col sm={8}>
              <div className="border rounded p-3">
                <FormLabel className="fw-semibold">Assign To</FormLabel>
                <FormControl
                  className="mb-3"
                  placeholder="Everyone"
                  value={quiz.assignTo ?? "Everyone"}
                  onChange={(e) => setQuiz({ ...quiz, assignTo: e.target.value })}
                />
                <FormLabel className="fw-semibold">Due</FormLabel>
                <FormControl
                  type="date"
                  className="mb-3"
                  value={quiz.dueDate ? quiz.dueDate.substring(0, 10) : ""}
                  onChange={(e) => setQuiz({ ...quiz, dueDate: e.target.value })}
                />
                <Row>
                  <Col md={6}>
                    <FormLabel className="fw-semibold">Available from</FormLabel>
                    <FormControl
                      type="date"
                      value={quiz.availableDate ? quiz.availableDate.substring(0, 10) : ""}
                      onChange={(e) => setQuiz({ ...quiz, availableDate: e.target.value })}
                    />
                  </Col>
                  <Col md={6}>
                    <FormLabel className="fw-semibold">Until</FormLabel>
                    <FormControl
                      type="date"
                      value={quiz.availableUntil ? quiz.availableUntil.substring(0, 10) : ""}
                      onChange={(e) => setQuiz({ ...quiz, availableUntil: e.target.value })}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      )}


      {activeTab === "questions" && (
        <div id="wd-quiz-questions-editor">
          <div className="d-flex justify-content-end mb-2">
            <span className="text-muted">Points {totalPoints}</span>
          </div>
          {quizQuestions.length === 0 && (
            <div className="text-muted fst-italic mb-3">
              No questions yet. Click <strong>+ New Question</strong> to add one.
            </div>
          )}
          {quizQuestions.map((q: any) =>
            editingQuestionId === q._id ? (
              <QuestionEditor
                key={q._id}
                question={q}
                onSave={handleSaveQuestion}
                onCancel={() => setEditingQuestionId(null)}
              />
            ) : (
              <div
                key={q._id}
                className="border rounded p-3 mb-2 d-flex justify-content-between align-items-start"
              >
                <div>
                  <div className="fw-bold">{q.title}</div>
                  <div className="text-muted small">
                    {q.type === "MULTIPLE_CHOICE"
                      ? "Multiple Choice"
                      : q.type === "TRUE_FALSE"
                      ? "True/False"
                      : "Fill in the Blank"}{" "}
                    &mdash; {q.points} pts
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setEditingQuestionId(q._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteQuestion(q._id)}
                  >
                    &#128465;
                  </button>
                </div>
              </div>
            )
          )}
          <div className="d-flex justify-content-center mt-3">
            <button className="btn btn-outline-secondary" onClick={handleAddQuestion}>
              + New Question
            </button>
          </div>
        </div>
      )}

      <hr />
      <div className="d-flex justify-content-end gap-2">
        <button
          className="btn btn-secondary"
          onClick={() => router.push(`/courses/${cid}/quizzes`)}
        >
          Cancel
        </button>
        <Button variant="secondary" onClick={() => saveQuiz(true, `/courses/${cid}/quizzes`)}>
          Save &amp; Publish
        </Button>
        <Button variant="danger" onClick={() => saveQuiz(false)}>
          Save
        </Button>
      </div>
    </div>
  );
}
