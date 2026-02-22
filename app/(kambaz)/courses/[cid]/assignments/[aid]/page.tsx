"use client";
import { useParams } from "next/navigation";
import * as db from "../../../../database";
import Link from "next/link";
import {
  Button,
  FormControl,
  FormLabel,
  FormSelect,
  FormCheck,
  Row,
  Col,
} from "react-bootstrap";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const assignment = db.assignments.find((a: any) => a._id === aid);

  return (
    <div id="wd-assignments-editor">
      <FormLabel htmlFor="wd-name">
        <h4>Assignment Name</h4>
      </FormLabel>
      <FormControl
        id="wd-name"
        defaultValue={assignment?.title}
        className="mb-3"
      />
      <FormControl
        as="textarea"
        id="wd-description"
        rows={6}
        className="mb-3"
        defaultValue={
          assignment?.description ||
          "The assignment is available online.\n\n" +
            "Submit a link to the landing page of your Web application running on Netlify.\n\n" +
            "The landing page should include the following:\n" +
            ". Your full name and section\n" +
            ". Links to each of the lab assignments\n" +
            ". Link to the Kanbas application\n" +
            ". Links to all relevant source code repositories\n\n" +
            "The Kanbas application should include a link to navigate back to the landing page."
        }
      />
      <Row className="mb-3">
        <Col sm={4} className="text-end">
          <FormLabel htmlFor="wd-points" className="pt-1">
            Points
          </FormLabel>
        </Col>
        <Col sm={8}>
          <FormControl id="wd-points" defaultValue={assignment?.points} />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={4} className="text-end">
          <FormLabel htmlFor="wd-groups" className="pt-1">
            Assignment Groups
          </FormLabel>
        </Col>
        <Col sm={8}>
          <FormSelect defaultValue="ASSIGNMENTS" id="wd-groups">
            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
            <option value="QUIZZES">QUIZZES</option>
            <option value="EXAMS">EXAMS</option>
          </FormSelect>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={4} className="text-end">
          <FormLabel htmlFor="wd-score" className="pt-1">
            Display Grade as
          </FormLabel>
        </Col>
        <Col sm={8}>
          <FormSelect defaultValue="Percentage" id="wd-score">
            <option value="Percentage">Percentage</option>
            <option value="Points">Points</option>
          </FormSelect>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={4} className="text-end">
          <FormLabel htmlFor="wd-submission" className="pt-1">
            Submission Type
          </FormLabel>
        </Col>
        <Col sm={8}>
          <div className="border rounded p-3">
            <FormSelect
              defaultValue="Online"
              id="wd-submission"
              className="mb-3"
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </FormSelect>
            <label className="fw-bold mb-2">Online Entry Options</label>
            <FormCheck
              type="checkbox"
              id="wd-chkbox-text-entry"
              label="Text Entry"
            />
            <FormCheck type="checkbox" id="wd-chkbox-url" label="Website URL" />
            <FormCheck
              type="checkbox"
              id="wd-chkbox-recordings"
              label="Media Recordings"
            />
            <FormCheck
              type="checkbox"
              id="wd-chkbox-annotations"
              label="Student Annotations"
            />
            <FormCheck
              type="checkbox"
              id="wd-chkbox-uploads"
              label="File Uploads"
            />
          </div>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={4} className="text-end">
          <FormLabel className="pt-1">Assign</FormLabel>
        </Col>
        <Col sm={8}>
          <div className="border rounded p-3">
            <FormLabel htmlFor="wd-assignval" className="fw-bold">
              Assign to
            </FormLabel>
            <FormControl
              id="wd-assignval"
              defaultValue="Everyone"
              className="mb-3"
            />
            <FormLabel htmlFor="wd-due-date" className="fw-bold">
              Due
            </FormLabel>
            <FormControl
              type="date"
              id="wd-due-date"
              defaultValue={assignment?.dueDate}
              className="mb-3"
            />
            <Row>
              <Col>
                <FormLabel htmlFor="wd-available-from" className="fw-bold">
                  Available from
                </FormLabel>
                <FormControl
                  type="date"
                  id="wd-available-from"
                  defaultValue={assignment?.availableDate}
                />
              </Col>
              <Col>
                <FormLabel htmlFor="wd-available-until" className="fw-bold">
                  Until
                </FormLabel>
                <FormControl
                  type="date"
                  id="wd-available-until"
                  defaultValue=""
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <hr />
      <div className="d-flex justify-content-end">
        <Link href={`/courses/${cid}/assignments`}>
          <Button variant="secondary" className="me-2">
            Cancel
          </Button>
        </Link>
        <Link href={`/courses/${cid}/assignments`}>
          <Button variant="danger">Save</Button>
        </Link>
      </div>
    </div>
  );
}
