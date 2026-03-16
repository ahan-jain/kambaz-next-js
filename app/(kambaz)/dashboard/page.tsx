"use client";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse } from "../courses/reducer";
import { toggleEnrollments, enroll, unenroll } from "../enrollments/reducer";
import { RootState } from "../store";
import {
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Row,
  Button,
  FormControl,
} from "react-bootstrap";

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments, showAllCourses } = useSelector(
    (state: RootState) => state.enrollmentsReducer
  );
  const dispatch = useDispatch();

  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  const enrolled = (courseId: string) =>
    enrollments.some(
      (e: any) => e.user === currentUser?._id && e.course === courseId
    );

  const visibleCourses =
    showAllCourses || currentUser?.role === "FACULTY"
      ? courses
      : courses.filter((c: any) => enrolled(c._id));

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />

      <h5>
        New Course
        {currentUser?.role === "FACULTY" && (
          <>
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={() => dispatch(addNewCourse(course))}
            >
              Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={() => dispatch(updateCourse(course))}
              id="wd-update-course-click"
            >
              Update
            </button>
          </>
        )}
        {currentUser?.role !== "FACULTY" && (
          <button
            className="btn btn-primary float-end"
            onClick={() => dispatch(toggleEnrollments())}
            id="wd-enrollments-click"
          >
            Enrollments
          </button>
        )}
      </h5>

      {currentUser?.role === "FACULTY" && (
        <>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            as="textarea"
            value={course.description}
            rows={3}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
          <hr />
        </>
      )}

      <h2 id="wd-dashboard-published">Published Courses {visibleCourses.length}</h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {visibleCourses.map((course: any) => (
            <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link
                  href={`/courses/${course._id}/home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  <CardImg
                    variant="top"
                    src="/images/reactjs.jpg"
                    width="100%"
                    height={160}
                  />
                  <CardBody>
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {course.name}
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      {course.description}
                    </CardText>

                    <Button variant="primary">Go</Button>

                    {currentUser?.role === "FACULTY" && (
                      <>
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            dispatch(deleteCourse(course._id));
                          }}
                          className="btn btn-danger float-end"
                          id="wd-delete-course-click"
                        >
                          Delete
                        </button>
                        <button
                          id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className="btn btn-warning me-2 float-end"
                        >
                          Edit
                        </button>
                      </>
                    )}

                    {currentUser?.role !== "FACULTY" && showAllCourses && (
                      <>
                        {enrolled(course._id) ? (
                          <button
                            className="btn btn-danger float-end"
                            onClick={(event) => {
                              event.preventDefault();
                              dispatch(
                                unenroll({ user: currentUser?._id, course: course._id })
                              );
                            }}
                          >
                            Unenroll
                          </button>
                        ) : (
                          <button
                            className="btn btn-success float-end"
                            onClick={(event) => {
                              event.preventDefault();
                              dispatch(
                                enroll({ user: currentUser?._id, course: course._id })
                              );
                            }}
                          >
                            Enroll
                          </button>
                        )}
                      </>
                    )}
                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
