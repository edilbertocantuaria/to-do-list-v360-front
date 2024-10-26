import { createContext, useState } from "react";

const ReloadContext = createContext();

export function ReloadProvider({ children }) {
  const [shouldReload, setShouldReload] = useState(true);
  const [shouldReloadTaskList, setShouldReloadTaskList] = useState(true);
  const [openedTaskList, setOpenedTaskList] = useState(null);

  return (
    <ReloadContext.Provider
      value={{
        shouldReload,
        setShouldReload,
        shouldReloadTaskList,
        setShouldReloadTaskList,
        openedTaskList,
        setOpenedTaskList
      }}
    >
      {children}
    </ReloadContext.Provider>
  );
}

export default ReloadContext;
