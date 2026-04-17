import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  quizzes: [] as any[],
  questions: [] as any[],
  attempts: [] as any[],
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, { payload: quizzes }) => {
      state.quizzes = quizzes;
    },
    addQuiz: (state, { payload: quiz }) => {
      const newQuiz: any = { _id: uuidv4(), ...quiz };
      state.quizzes = [...state.quizzes, newQuiz];
    },
    deleteQuiz: (state, { payload: quizId }) => {
      state.quizzes = state.quizzes.filter((q: any) => q._id !== quizId);
    },
    updateQuiz: (state, { payload: quiz }) => {
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === quiz._id ? quiz : q
      );
    },
    togglePublishQuiz: (state, { payload: quizId }) => {
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === quizId ? { ...q, published: !q.published } : q
      );
    },
    setQuestions: (state, { payload: questions }) => {
      state.questions = questions;
    },
    addQuestion: (state, { payload: question }) => {
      const newQuestion: any = { _id: uuidv4(), ...question };
      state.questions = [...state.questions, newQuestion];
    },
    deleteQuestion: (state, { payload: questionId }) => {
      state.questions = state.questions.filter(
        (q: any) => q._id !== questionId
      );
    },
    updateQuestion: (state, { payload: question }) => {
      state.questions = state.questions.map((q: any) =>
        q._id === question._id ? question : q
      );
    },
    setAttempts: (state, { payload: attempts }) => {
      state.attempts = attempts;
    },
    addAttempt: (state, { payload: attempt }) => {
      const newAttempt: any = { _id: uuidv4(), ...attempt };
      state.attempts = [...state.attempts, newAttempt];
    },
  },
});

export const {
  setQuizzes,
  addQuiz,
  deleteQuiz,
  updateQuiz,
  togglePublishQuiz,
  setQuestions,
  addQuestion,
  deleteQuestion,
  updateQuestion,
  setAttempts,
  addAttempt,
} = quizzesSlice.actions;
export default quizzesSlice.reducer;
