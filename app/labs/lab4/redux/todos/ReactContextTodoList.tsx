"use client";
import { useTodos } from "./todosContext";
import { ListGroup, ListGroupItem, Button, FormControl } from "react-bootstrap";

export default function ReactContextTodoList() {
  const { todos, todo, addTodo, deleteTodo, updateTodo, setTodo } = useTodos();
  return (
    <div id="wd-todo-list-context">
      <h2>Todo List</h2>
      <ListGroup>
        <ListGroupItem className="d-flex align-items-center gap-2">
          <FormControl value={todo.title}
            onChange={(e: any) => setTodo({ ...todo, title: e.target.value })}/>
          <Button onClick={() => updateTodo(todo)}
            className="btn btn-warning text-nowrap"
            id="wd-update-todo-click"> Update </Button>
          <Button onClick={() => addTodo(todo)}
            className="btn btn-success text-nowrap"
            id="wd-add-todo-click"> Add </Button>
        </ListGroupItem>
        {todos.map((todo: any) => (
          <ListGroupItem key={todo.id}
            className="d-flex justify-content-between align-items-center">
            {todo.title}
            <div>
              <Button onClick={() => setTodo(todo)}
                className="btn btn-primary me-1"
                id="wd-set-todo-click"> Edit </Button>
              <Button onClick={() => deleteTodo(todo.id)}
                className="btn btn-danger"
                id="wd-delete-todo-click"> Delete </Button>
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
      <hr/>
    </div>
  );
}