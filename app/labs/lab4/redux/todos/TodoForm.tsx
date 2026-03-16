import { ListGroupItem, Button, FormControl } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";
import { RootState } from "../../store";
export default function TodoForm() {
  const { todo } = useSelector((state: RootState) => state.todosReducer);
  const dispatch = useDispatch();
  return (
    <ListGroupItem className="d-flex align-items-center gap-2">
      <FormControl
        value={todo.title}
        onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))}
      />
      <Button
        onClick={() => dispatch(updateTodo(todo))}
        className="btn btn-warning text-nowrap"
        id="wd-update-todo-click"
      >
        Update
      </Button>
      <Button
        onClick={() => dispatch(addTodo(todo))}
        className="btn btn-success text-nowrap"
        id="wd-add-todo-click"
      >
        Add
      </Button>
    </ListGroupItem>
  );
}
