import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { loginUser, registerUser } from "../api/client";
import { useAuth } from "../App.jsx";

export default function Login({ onSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res =
        mode === "login"
          ? await loginUser({ email: form.email, password: form.password })
          : await registerUser(form);
      login(res.data.access_token, res.data.user);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="sidebar-logo-icon">
            <Sparkles size={18} color="white" />
          </div>
          TaskFlow
        </div>

        <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <p className="sub">
          {mode === "login"
            ? "Sign in to manage your tasks and projects."
            : "Start organizing your work in minutes."}
        </p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="form-group">
              <label>Full name</label>
              <input
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Jane Doe"
              />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
              placeholder="••••••••"
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
            {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          {mode === "login" ? (
            <>
              Don't have an account? <span onClick={() => setMode("register")}>Sign up</span>
            </>
          ) : (
            <>
              Already have an account? <span onClick={() => setMode("login")}>Sign in</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
