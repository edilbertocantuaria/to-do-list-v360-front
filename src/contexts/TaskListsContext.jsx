import { createContext, useState } from "react";

const TaskListsContext = createContext();

export function MyTasksListsProvider({ children }) {
  const [myTaskLists, setMyTaskLists] = useState([]);
  const [myTags, setMyTags] = useState([]);

  return (
    <TaskListsContext.Provider
      value={{
        myTaskLists,
        setMyTaskLists,
        myTags,
        setMyTags
      }}
    >
      {children}
    </TaskListsContext.Provider>
  );
}

export default TaskListsContext;
