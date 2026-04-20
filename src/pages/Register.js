import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.text();
    if (data === "User registered") {
      alert("Registered! Please login.");
      navigate("/");
    } else {
      alert("Registration failed");
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
          <p style={{ color: "#666", margin: 0 }}>Create your free account</p>
        </div>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          style={{ display: "block", width: "93%", marginBottom: 12,
            padding: 12, borderRadius: 8, border: "1px solid #ddd", fontSize: 15 }} />
        <input placeholder="Password" type="password" value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ display: "block", width: "93%", marginBottom: 20,
            padding: 12, borderRadius: 8, border: "1px solid #ddd", fontSize: 15 }} />
        <button onClick={handleRegister}
          style={{ width: "100%", padding: 12, background: "#1a237e", color: "white",
            border: "none", borderRadius: 8, cursor: "pointer", fontSize: 16, fontWeight: "bold" }}>
          Create Account
        </button>
        <p style={{ textAlign: "center", marginTop: 16, color: "#666" }}>
          Already have an account? <a href="/" style={{ color: "#1a237e", fontWeight: "bold" }}>Login here</a>
        </p>
      </div>
    </div>
  );
}