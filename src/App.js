import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import MyTaskLists from "./pages/MyTaskLists.jsx";
import Header from "./components/Header.jsx";
import "./styles/app.css";

export const pathsWithoutHeaderAndMenu = ["/", "/register"];

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/myTaskLists" element={<MyTaskLists />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
