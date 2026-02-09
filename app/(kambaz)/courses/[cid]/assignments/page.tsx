import Link from "next/link";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { FaSearch, FaRegEdit } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../modules/GreenCheckmark";

export default function Assignments() {
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
        <div>
          <button id="wd-add-assignment-group" className="btn btn-light me-2">
            <BsPlus /> Group
          </button>
          <button id="wd-add-assignment" className="btn btn-danger">
            <BsPlus /> Assignment
          </button>
        </div>
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
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <FaRegEdit className="me-3 text-success" />
              <div className="flex-fill">
                <Link
                  href="/courses/1234/assignments/123"
                  className="wd-assignment-link text-decoration-none text-dark fw-bold"
                >
                  A1 - ENV + HTML
                </Link>
                <br />
                <span className="text-muted">
                  Multiple Modules | <b>Not available until </b> May 6 at
                  12:00am |<b> Due </b> May 13 at 11:59pm | 100 pts
                </span>
              </div>
              <div className="float-end">
                <GreenCheckmark />
                <IoEllipsisVertical className="fs-4" />
              </div>
            </ListGroupItem>

            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <FaRegEdit className="me-3 text-success" />
              <div className="flex-fill">
                <Link
                  href="/courses/1234/assignments/124"
                  className="wd-assignment-link text-decoration-none text-dark fw-bold"
                >
                  A2 - CSS + BOOTSTRAP
                </Link>
                <br />
                <span className="text-muted">
                  Multiple Modules | <b>Not available until </b> May 13 at
                  12:00am |<b> Due </b> May 20 at 11:59pm | 100 pts
                </span>
              </div>
              <div className="float-end">
                <GreenCheckmark />
                <IoEllipsisVertical className="fs-4" />
              </div>
            </ListGroupItem>

            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <FaRegEdit className="me-3 text-success" />
              <div className="flex-fill">
                <Link
                  href="/courses/1234/assignments/123"
                  className="wd-assignment-link text-decoration-none text-dark fw-bold"
                >
                  A3 - JAVASCRIPT + REACT
                </Link>
                <br />
                <span className="text-muted">
                  Multiple Modules | <b>Not available until </b> May 20 at
                  12:00am |<b> Due </b> May 27 at 11:59pm | 100 pts
                </span>
              </div>
              <div className="float-end">
                <GreenCheckmark />
                <IoEllipsisVertical className="fs-4" />
              </div>
            </ListGroupItem>
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
