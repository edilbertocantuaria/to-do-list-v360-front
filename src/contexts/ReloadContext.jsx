import { createContext, useState } from "react";

const ReloadContext = createContext();

export function ReloadProvider({ children }) {
  const [shouldReload, setShouldReload] = useState(true);

  return (
    <ReloadContext.Provider value={{ shouldReload, setShouldReload }}>
      {children}
    </ReloadContext.Provider>
  );
}

export default ReloadContext;
