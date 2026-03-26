"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { FaSearch, FaRegEdit, FaTrash } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../modules/GreenCheckmark";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setAssignments } from "./reducer";
import * as client from "../../client";

export default function Assignments() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer,
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );

  const fetchAssignments = async () => {
    const assignments = await client.findAssignmentsForCourse(cid as string);
    dispatch(setAssignments(assignments));
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const onDeleteAssignment = async (assignmentId: string) => {
    const ok = window.confirm("Are you sure you want to delete this assignment?");
    if (!ok) return;
    await client.deleteAssignment(assignmentId);
    dispatch(setAssignments(assignments.filter((a: any) => a._id !== assignmentId)));
  };

  return (
    <div id="wd-assignments">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="position-relative">
          <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
          <input
            id="wd-search-assignment"
            className="form-control ps-5"
            placeholder="Search for Assignments"
          />
        </div>
        {currentUser?.role === "FACULTY" && (
          <div>
            <button id="wd-add-assignment-group" className="btn btn-light me-2">
              <BsPlus /> Group
            </button>
            <Link href={`/courses/${cid}/assignments/new`}>
              <button id="wd-add-assignment" className="btn btn-danger">
                <BsPlus /> Assignment
              </button>
            </Link>
          </div>
        )}
      </div>

      <ListGroup className="rounded-0" id="wd-assignment-list">
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
            <div>
              <BsGripVertical className="me-2 fs-3" />
              ASSIGNMENTS
            </div>
            <div>
              <span className="badge bg-secondary border border-dark text-dark rounded-pill me-2">
                40% of Total
              </span>
              <BsPlus className="fs-4" />
              <IoEllipsisVertical className="fs-4" />
            </div>
          </div>

          <ListGroup className="rounded-0">
            {assignments
              .map((assignment: any) => (
                <ListGroupItem
                  key={assignment._id}
                  className="wd-lesson p-3 ps-1 d-flex align-items-center"
                >
                  <BsGripVertical className="me-2 fs-3" />
                  <FaRegEdit className="me-3 text-success" />
                  <div className="flex-fill">
                    <Link
                      href={`/courses/${cid}/assignments/${assignment._id}`}
                      className="wd-assignment-link text-decoration-none text-dark fw-bold"
                    >
                      {assignment.title}
                    </Link>
                    <br />
                    <span className="text-muted">
                      Multiple Modules | <b>Not available until</b>{" "}
                      {assignment.availableDate} | <b>Due</b>{" "}
                      {assignment.dueDate} | {assignment.points} pts
                    </span>
                  </div>
                  <div className="float-end d-flex align-items-center">
                    {currentUser?.role === "FACULTY" && (
                      <button
                        className="btn btn-danger btn-sm me-2"
                        onClick={(event) => {
                          event.preventDefault();
                          onDeleteAssignment(assignment._id);
                        }}
                      >
                        <FaTrash />
                      </button>
                    )}
                    <GreenCheckmark />
                    <IoEllipsisVertical className="fs-4" />
                  </div>
                </ListGroupItem>
              ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}