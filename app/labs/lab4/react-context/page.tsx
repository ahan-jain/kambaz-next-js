"use client";
import { CounterProvider } from "./counter/context";
import CounterContext from "./counter";
import { TodosProvider } from "../redux/todos/todosContext";
import ReactContextTodoList from "../redux/todos/ReactContextTodoList";

export default function ReactContextExamples() {
  return (
    <div>
      <h1>React Context Examples</h1>
      <CounterProvider>
        <CounterContext />
      </CounterProvider>
      <TodosProvider>
        <ReactContextTodoList />
      </TodosProvider>
    </div>
  );
}
