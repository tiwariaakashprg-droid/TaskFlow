import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { getCurrentUser } from "./api/client";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import Projects from "./pages/Projects.jsx";
import Sidebar from "./components/Sidebar.jsx";

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("taskflow_token");
    const cachedUser = localStorage.getItem("taskflow_user");
    if (token && cachedUser) {
      setUser(JSON.parse(cachedUser));
      getCurrentUser()
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("taskflow_user", JSON.stringify(res.data));
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("taskflow_token", token);
    localStorage.setItem("taskflow_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading TaskFlow…</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  );
}

function LoginRoute() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (user) return <Navigate to="/" replace />;
  return <Login onSuccess={() => navigate("/")} />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route
            path="/"
            element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedLayout>
                <Tasks />
              </ProtectedLayout>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedLayout>
                <Projects />
              </ProtectedLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
