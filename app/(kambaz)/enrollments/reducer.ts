import { createSlice } from "@reduxjs/toolkit";
import { enrollments } from "../database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  enrollments: enrollments,
  showAllCourses: false,
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    toggleEnrollments: (state) => {
      state.showAllCourses = !state.showAllCourses;
    },
    enroll: (state, { payload }) => {
      state.enrollments = [
        ...state.enrollments,
        { _id: uuidv4(), user: payload.user, course: payload.course },
      ] as any;
    },
    unenroll: (state, { payload }) => {
      state.enrollments = state.enrollments.filter(
        (e: any) => !(e.user === payload.user && e.course === payload.course)
      ) as any;
    },
  },
});

export const { toggleEnrollments, enroll, unenroll } =
  enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
