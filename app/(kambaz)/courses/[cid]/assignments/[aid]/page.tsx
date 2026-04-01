"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button, FormControl, FormLabel, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { addAssignment, updateAssignment } from "../reducer";
import * as client from "../../../client";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer,
  );

  const assignmentFromStore = assignments.find((a: any) => a._id === aid);

  const [assignment, setAssignment] = useState<any>(
    assignmentFromStore || {
      _id: "new",
      title: "New Assignment",
      description: "",
      course: cid,
      points: 100,
      dueDate: "",
      availableDate: "",
      availableUntil: "",
    },
  );

  const save = async () => {
    if (aid === "new") {
      const newAssignment = await client.createAssignmentForCourse(cid as string, { ...assignment, course: cid });
      dispatch(addAssignment(newAssignment));
    } else {
      await client.updateAssignment({ ...assignment, course: cid });
      dispatch(updateAssignment({ ...assignment, course: cid }));
    }
    router.push(`/courses/${cid}/assignments`);
  };

  return (
    <div id="wd-assignments-editor">
      <FormLabel htmlFor="wd-name">
        <h4>Assignment Name</h4>
      </FormLabel>
      <FormControl
        id="wd-name"
        className="mb-3"
        value={assignment.title}
        onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })
        }
      />

      <FormControl
        as="textarea"
        id="wd-description"
        rows={6}
        className="mb-3"
        value={assignment.description}
        onChange={(e) =>
          setAssignment({ ...assignment, description: e.target.value })
        }
      />

      <Row className="mb-3">
        <Col sm={4} className="text-end">
          <FormLabel htmlFor="wd-points" className="pt-1">
            Points
          </FormLabel>
        </Col>
        <Col sm={8}>
          <FormControl
            id="wd-points"
            type="number"
            value={assignment.points}
            onChange={(e) =>
              setAssignment({ ...assignment, points: Number(e.target.value) })
            }
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={4} className="text-end pt-1">
          <FormLabel className="pt-1">Assign</FormLabel>
        </Col>

        <Col sm={8}>
          <div className="border rounded p-3">
            <FormLabel htmlFor="wd-due-date" className="pt-1 mb-1">
              Due
            </FormLabel>
            <FormControl
              type="date"
              id="wd-due-date"
              className="mb-4"
              value={assignment.dueDate}
              onChange={(e) =>
                setAssignment({ ...assignment, dueDate: e.target.value })
              }
            />
            <Row>
              <Col md={6}>
                <FormLabel
                  htmlFor="wd-available-from"
                  className="pt-1 mb-1"
                >
                  Available from
                </FormLabel>
                <FormControl
                  type="date"
                  id="wd-available-from"
                  value={assignment.availableDate}
                  onChange={(e) =>
                    setAssignment({
                      ...assignment,
                      availableDate: e.target.value,
                    })
                  }
                />
              </Col>

              <Col md={6}>
                <FormLabel
                  htmlFor="wd-available-until"
                  className="pt-1 mb-1"
                >
                  Until
                </FormLabel>
                <FormControl
                  type="date"
                  id="wd-available-until"
                  value={assignment.availableUntil}
                  onChange={(e) =>
                    setAssignment({
                      ...assignment,
                      availableUntil: e.target.value,
                    })
                  }
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <hr />
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-secondary me-2"
          onClick={() => router.push(`/courses/${cid}/assignments`)}
        >
          Cancel
        </button>
        <Button variant="danger" onClick={save}>
          Save
        </Button>
      </div>
    </div>
  );
}
