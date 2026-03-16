import { create } from "zustand";

export const useTodoStore = create((set: any) => ({
  todos: [
    { id: "1", title: "Learn React" },
    { id: "2", title: "Learn Node" },
  ],
  todo: { title: "Learn Mongo" },
  addTodo: (todo: any) =>
    set((state: any) => ({
      todos: [
        ...state.todos,
        { ...todo, id: new Date().getTime().toString() },
      ],
      todo: { title: "" },
    })),
  deleteTodo: (id: string) =>
    set((state: any) => ({
      todos: state.todos.filter((todo: any) => todo.id !== id),
    })),
  updateTodo: (todo: any) =>
    set((state: any) => ({
      todos: state.todos.map((item: any) =>
        (item.id === todo.id ? todo : item)),
      todo: { title: "" },
    })),
  setTodo: (todo: any) => set({ todo }),
}));