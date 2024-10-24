import { createContext, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const persistedAuth = JSON.parse(localStorage.getItem("auth"));
  const [auth, setAuth] = useState(persistedAuth);

  function login(authData) {
    setAuth(authData);
    localStorage.setItem("auth", JSON.stringify(authData));
  }
  function logout() {
    setAuth(null);
    localStorage.removeItem("auth");
  }

  async function user() {
    if (!auth || !auth.token) return;

    try {
      const response = await api.getMe(auth.token);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
