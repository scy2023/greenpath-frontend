import { useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const register = async () => {
    try {
      await axios.post(`${API}/api/auth/register`, { email, password });
      setMsg("Registered! Please login.");
      setTimeout(() => window.location.href = "/", 1500);
    } catch {
      setMsg("Registration failed.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.logo}>🌿 GreenPath</h1>
        <p style={styles.sub}>Create your account</p>
        <input style={styles.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button style={styles.btn} onClick={register}>Create Account</button>
        {msg && <p style={styles.ok}>{msg}</p>}
        <p style={styles.link}>Have account? <a href="/">Login</a></p>
      </div>
    </div>
  );
}

const styles = {
  page:  { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f0faf5" },
  card:  { background:"#fff", padding:"40px", borderRadius:"16px", boxShadow:"0 4px 24px rgba(0,0,0,0.08)", width:"360px", textAlign:"center" },
  logo:  { color:"#0F6E56", fontSize:"28px", marginBottom:"4px" },
  sub:   { color:"#888", fontSize:"14px", marginBottom:"24px" },
  input: { display:"block", width:"100%", padding:"12px", marginBottom:"12px", borderRadius:"8px", border:"1px solid #ddd", fontSize:"14px" },
  btn:   { width:"100%", padding:"12px", background:"#0F6E56", color:"#fff", border:"none", borderRadius:"8px", fontSize:"15px", cursor:"pointer" },
  ok:    { color:"green", fontSize:"13px", marginTop:"8px" },
  link:  { marginTop:"16px", fontSize:"13px", color:"#666" }
};