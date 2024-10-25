import { useContext } from "react";
import ReloadContext from "../contexts/ReloadContext.jsx";

export default function useReload() {
  return useContext(ReloadContext);
}
