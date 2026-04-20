import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      const pending = localStorage.getItem("pendingCV");
      if (pending) navigate("/upload");
      else navigate("/dashboard");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7f5", display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: "white", borderRadius: 16, padding: 40,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)", width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <span style={{ fontSize: 40 }}>🚀</span>
          <h2 style={{ color: "#1a237e", margin: "10px 0 4px" }}>CareerUpdater</h2>
          <p style={{ color: "#666", margin: 0 }}>Sign in to see your results</p>
        </div>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          style={{ display: "block", width: "93%", marginBottom: 12,
            padding: 12, borderRadius: 8, border: "1px solid #ddd", fontSize: 15 }} />
        <input placeholder="Password" type="password" value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ display: "block", width: "93%", marginBottom: 20,
            padding: 12, borderRadius: 8, border: "1px solid #ddd", fontSize: 15 }} />
        <button onClick={handleLogin}
          style={{ width: "100%", padding: 12, background: "#1a237e", color: "white",
            border: "none", borderRadius: 8, cursor: "pointer", fontSize: 16, fontWeight: "bold" }}>
          Login
        </button>
        <p style={{ textAlign: "center", marginTop: 16, color: "#666" }}>
          No account? <a href="/register" style={{ color: "#1a237e", fontWeight: "bold" }}>Register here</a>
        </p>
      </div>
    </div>
  );
}