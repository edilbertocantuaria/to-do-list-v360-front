import { useContext } from "react";
import TaskListsContext from "../contexts/TaskListsContext.jsx";

export default function useMyTasksList() {
  return useContext(TaskListsContext);
}
