import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function getCourseLink(skill) {
  return `https://www.coursera.org/search?query=${encodeURIComponent(skill)}&price=free`;
}
function getYouTubeLink(skill) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + " tutorial free")}`;
}
function ScoreCircle({ score }) {
  const color = score >= 70 ? "#2e7d32" : score >= 40 ? "#f57c00" : "#c62828";
  return (
    <div style={{ width: 140, height: 140, borderRadius: "50%",
      background: `conic-gradient(${color} ${score * 3.6}deg, #e0e0e0 0deg)`,
      display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
      <div style={{ width: 110, height: 110, borderRadius: "50%", background: "white",
        display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <span style={{ fontSize: 32, fontWeight: "bold", color }}>{score}%</span>
        <span style={{ fontSize: 12, color: "#666" }}>Match</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const results = JSON.parse(localStorage.getItem("results") || "{}");
  const history = JSON.parse(localStorage.getItem("history") || "[]");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("premium") === "true") {
      localStorage.setItem("premium", "true");
      setIsPremium(true);
    } else {
      setIsPremium(localStorage.getItem("premium") === "true");
    }
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  const handleNewAnalysis = () => {
    if (results.match_score !== undefined) {
      const newHistory = [...history, { ...results, date: new Date().toLocaleDateString() }];
      localStorage.setItem("history", JSON.stringify(newHistory.slice(-5)));
    }
    navigate("/upload");
  };

  const handleUpgrade = async () => {
    setLoading(true);
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/checkout`, {
      method: "POST", headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(false);
  };

  const score = results.match_score || 0;
  const missing = results.missing_skills || [];
  const roadmap = results.roadmap || [];
  const scoreLabel = score >= 70 ? "Strong Match 🎉" : score >= 40 ? "Moderate Match 💪" : "Needs Work 📚";

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7f5", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "white", padding: "16px 32px", display: "flex",
        justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>🚀</span>
          <span style={{ fontSize: 20, fontWeight: "bold", color: "#1a237e" }}>CareerUpdater</span>
          {isPremium && <span style={{ background: "#ffd700", padding: "2px 10px",
            borderRadius: 20, fontSize: 12, fontWeight: "bold" }}>⭐ PREMIUM</span>}
        </div>
        <button onClick={handleLogout} style={{ padding: "8px 20px", background: "#c62828",
          color: "white", border: "none", borderRadius: 20, cursor: "pointer", fontWeight: "bold" }}>
          Logout
        </button>
      </div>

      <div style={{ maxWidth: 800, margin: "30px auto", padding: "0 20px" }}>
        {results.match_score !== undefined ? (
          <>
            {/* Score Card */}
            <div style={{ background: "white", borderRadius: 16, padding: 30,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: 24, textAlign: "center" }}>
              <h2 style={{ color: "#333", marginBottom: 20 }}>Your Career Match Analysis</h2>
              <ScoreCircle score={score} />
              <p style={{ fontSize: 20, fontWeight: "bold", marginTop: 16,
                color: score >= 70 ? "#2e7d32" : score >= 40 ? "#f57c00" : "#c62828" }}>
                {scoreLabel}
              </p>
              <div style={{ background: "#e0e0e0", borderRadius: 10, height: 12,
                margin: "16px 0", overflow: "hidden" }}>
                <div style={{ width: `${score}%`, height: "100%", borderRadius: 10,
                  background: score >= 70 ? "#2e7d32" : score >= 40 ? "#f57c00" : "#c62828" }} />
              </div>
              <p style={{ color: "#666", fontSize: 14 }}>You match {score}% of the required skills</p>
            </div>

            {/* Missing Skills */}
            {missing.length > 0 && (
              <div style={{ background: "white", borderRadius: 16, padding: 30,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: 24 }}>
                <h3 style={{ color: "#333", marginBottom: 20 }}>📚 Skills to Learn ({missing.length})</h3>
                {missing.map((skill, i) => (
                  <div key={i} style={{ border: "1px solid #e0e0e0", borderRadius: 12, padding: 16,
                    marginBottom: 12, display: "flex", justifyContent: "space-between",
                    alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span>🎯</span>
                      <span style={{ fontWeight: "600" }}>{skill}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <a href={getCourseLink(skill)} target="_blank" rel="noreferrer"
                        style={{ padding: "6px 14px", background: "#0056d2", color: "white",
                          borderRadius: 20, textDecoration: "none", fontSize: 13, fontWeight: "bold" }}>
                        Coursera
                      </a>
                      <a href={getYouTubeLink(skill)} target="_blank" rel="noreferrer"
                        style={{ padding: "6px 14px", background: "#ff0000", color: "white",
                          borderRadius: 20, textDecoration: "none", fontSize: 13, fontWeight: "bold" }}>
                        YouTube
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Premium Roadmap */}
            {isPremium && roadmap.length > 0 && (
              <div style={{ background: "white", borderRadius: 16, padding: 30,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: 24 }}>
                <h3 style={{ color: "#333", marginBottom: 20 }}>🗺️ Your Personal Learning Roadmap</h3>
                {roadmap.map((item, i) => (
                  <div key={i} style={{ border: "1px solid #e0e0e0", borderRadius: 12,
                    padding: 16, marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontWeight: "bold", fontSize: 16 }}>{item.skill}</span>
                      <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 12,
                        background: item.priority === "high" ? "#ffebee" : item.priority === "medium" ? "#fff3e0" : "#e8f5e9",
                        color: item.priority === "high" ? "#c62828" : item.priority === "medium" ? "#f57c00" : "#2e7d32",
                        fontWeight: "bold" }}>
                        {item.priority} priority
                      </span>
                    </div>
                    <p style={{ color: "#666", fontSize: 14, margin: "4px 0" }}>
                      ⏱ Estimated: {item.weeks_to_learn} weeks
                    </p>
                    {item.free_resources && (
                      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                        {item.free_resources.map((url, j) => (
                          <a key={j} href={url} target="_blank" rel="noreferrer"
                            style={{ padding: "4px 12px", background: "#e8f5e9", color: "#2e7d32",
                              borderRadius: 20, textDecoration: "none", fontSize: 13, fontWeight: "bold" }}>
                            Resource {j + 1} 🔗
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upgrade Banner */}
            {!isPremium && (
              <div style={{ background: "linear-gradient(135deg, #1a237e, #283593)",
                borderRadius: 16, padding: 30, marginBottom: 24, color: "white", textAlign: "center" }}>
                <h3 style={{ margin: "0 0 8px" }}>⭐ Upgrade to Premium</h3>
                <p style={{ margin: "0 0 20px", opacity: 0.9 }}>
                  Get a detailed skill roadmap with learning timeline and free resources
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: 20,
                  marginBottom: 20, flexWrap: "wrap" }}>
                  {["🗺️ Personal learning roadmap", "⏱️ Time estimates per skill",
                    "🔗 Curated free resources", "📈 Priority skill ordering"].map((f, i) => (
                    <span key={i} style={{ background: "rgba(255,255,255,0.15)",
                      padding: "6px 14px", borderRadius: 20, fontSize: 14 }}>{f}</span>
                  ))}
                </div>
                <button onClick={handleUpgrade} disabled={loading}
                  style={{ padding: "14px 40px", background: "#ffd700", color: "#1a237e",
                    border: "none", borderRadius: 25, cursor: "pointer", fontSize: 16,
                    fontWeight: "bold", boxShadow: "0 4px 15px rgba(255,215,0,0.4)" }}>
                  {loading ? "Loading..." : "Upgrade for £4.99/month →"}
                </button>
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div style={{ background: "white", borderRadius: 16, padding: 30,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: 24 }}>
                <h3 style={{ color: "#333", marginBottom: 20 }}>📈 Progress History</h3>
                {history.map((h, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between",
                    padding: "10px 0", borderBottom: i < history.length - 1 ? "1px solid #eee" : "none" }}>
                    <span style={{ color: "#666" }}>Analysis {i + 1} — {h.date}</span>
                    <span style={{ fontWeight: "bold",
                      color: h.match_score >= 70 ? "#2e7d32" : h.match_score >= 40 ? "#f57c00" : "#c62828" }}>
                      {h.match_score}%
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Find Jobs Button */}
            <button onClick={() => navigate("/jobs")}
              style={{ width: "100%", padding: 16, background: "#e8f5e9", color: "#2e7d32",
                border: "2px solid #2e7d32", borderRadius: 12, cursor: "pointer", fontSize: 16,
                fontWeight: "bold", marginBottom: 12 }}>
              🔍 Find Matching Jobs Near Me
            </button>

            <button onClick={handleNewAnalysis}
              style={{ width: "100%", padding: 16, background: "#1a237e", color: "white",
                border: "none", borderRadius: 12, cursor: "pointer", fontSize: 16,
                fontWeight: "bold", boxShadow: "0 4px 12px rgba(26,35,126,0.3)" }}>
              🔄 Analyse Another CV
            </button>
          </>
        ) : (
          <div style={{ background: "white", borderRadius: 16, padding: 60,
            textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <span style={{ fontSize: 60 }}>🚀</span>
            <h2 style={{ color: "#333", marginTop: 20 }}>Welcome to CareerUpdater!</h2>
            <p style={{ color: "#666", marginBottom: 30 }}>Upload your CV and let AI analyse your career match.</p>
            <button onClick={() => navigate("/upload")}
              style={{ padding: "14px 32px", background: "#1a237e", color: "white",
                border: "none", borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: "bold" }}>
              Upload CV →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}