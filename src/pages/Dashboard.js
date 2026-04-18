export default function Dashboard() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div style={styles.page}>
      <div style={styles.nav}>
        <h2 style={styles.logo}>🌿 GreenPath</h2>
        <button style={styles.logout} onClick={logout}>Logout</button>
      </div>
      <div style={styles.body}>
        <h2 style={styles.title}>Welcome to GreenPath!</h2>
        <p style={styles.sub}>Upload your CV and let AI analyse your career match.</p>
        <a href="/upload" style={styles.btn}>Upload CV →</a>
      </div>
    </div>
  );
}

const styles = {
  page:   { minHeight:"100vh", background:"#f0faf5" },
  nav:    { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 32px", background:"#fff", boxShadow:"0 1px 8px rgba(0,0,0,0.06)" },
  logo:   { color:"#0F6E56" },
  logout: { padding:"8px 16px", background:"transparent", border:"1px solid #0F6E56", color:"#0F6E56", borderRadius:"8px", cursor:"pointer" },
  body:   { maxWidth:"600px", margin:"60px auto", textAlign:"center", padding:"0 20px" },
  title:  { fontSize:"28px", color:"#1a1a1a", marginBottom:"12px" },
  sub:    { color:"#666", fontSize:"16px", marginBottom:"32px" },
  btn:    { display:"inline-block", padding:"14px 32px", background:"#0F6E56", color:"#fff", borderRadius:"10px", textDecoration:"none", fontSize:"16px" }
};