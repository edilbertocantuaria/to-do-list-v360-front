import { createContext, useState } from "react";

const TaskListsContext = createContext();

export function MyTasksListsProvider({ children }) {
  const [myTaskLists, setMyTaskLists] = useState([]);

  return (
    <TaskListsContext.Provider
      value={{
        myTaskLists,
        setMyTaskLists
      }}
    >
      {children}
    </TaskListsContext.Provider>
  );
}

export default TaskListsContext;
