import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ReloadProvider } from "./contexts/ReloadContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import MyTaskLists from "./pages/MyTaskLists.jsx";
import "./styles/app.css";

export const pathsWithoutHeaderAndMenu = ["/", "/register"];

export default function App() {
  return (
    <AuthProvider>
      <ReloadProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/myTaskLists" element={<MyTaskLists />} />
          </Routes>
        </BrowserRouter>
      </ReloadProvider>
    </AuthProvider>
  );
}
