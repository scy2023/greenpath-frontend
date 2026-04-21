import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Jobs() {
  const navigate = useNavigate();
  const results = JSON.parse(localStorage.getItem("results") || "{}");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [postcode, setPostcode] = useState("");
  const [searched, setSearched] = useState(false);
  const role = localStorage.getItem("searchedRole") || "";

  useEffect(() => {
    // Auto detect location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://api.postcodes.io/postcodes?lon=${longitude}&lat=${latitude}`
          );
          const data = await res.json();
          if (data.result && data.result[0]) {
            const pc = data.result[0].postcode;
            setPostcode(pc);
            setLocation(pc);
          }
        } catch (e) {
          console.log("Location detection failed");
        }
      });
    }
  }, []);

  const searchJobs = async () => {
    if (!location) {
      alert("Please enter your postcode or location");
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const keywords = role || "software engineer";
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/jobs/search?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(location)}&distancefromlocation=5`
      );
      const data = await res.json();
      setJobs(data.results || []);
    } catch (err) {
      alert("Error fetching jobs: " + err.message);
    }
    setLoading(false);
  };

  const score = results.match_score || 0;
  const missing = results.missing_skills || [];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7f5", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "white", padding: "16px 32px", display: "flex",
        justifyContent: "space-between", alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>🚀</span>
          <span style={{ fontSize: 20, fontWeight: "bold", color: "#1a237e" }}>CareerUpdater</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => navigate("/dashboard")}
            style={{ padding: "8px 16px", background: "#e8eaf6", color: "#1a237e",
              border: "none", borderRadius: 20, cursor: "pointer", fontWeight: "bold" }}>
            ← Results
          </button>
          <button onClick={() => { localStorage.clear(); navigate("/"); }}
            style={{ padding: "8px 16px", background: "#c62828", color: "white",
              border: "none", borderRadius: 20, cursor: "pointer", fontWeight: "bold" }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "30px auto", padding: "0 20px" }}>

        {/* CV Score Summary */}
        {score > 0 && (
          <div style={{ background: "white", borderRadius: 16, padding: 24,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: 24,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 16 }}>
            <div>
              <h3 style={{ margin: 0, color: "#1a237e" }}>Your CV Score for: <em>{role}</em></h3>
              <p style={{ margin: "4px 0 0", color: "#666" }}>
                Showing jobs within 5 miles that match your profile
              </p>
            </div>
            <div style={{ fontSize: 36, fontWeight: "bold",
              color: score >= 70 ? "#2e7d32" : score >= 40 ? "#f57c00" : "#c62828" }}>
              {score}%
            </div>
          </div>
        )}

        {/* Location Search */}
        <div style={{ background: "white", borderRadius: 16, padding: 24,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: 24 }}>
          <h3 style={{ margin: "0 0 16px", color: "#1a237e" }}>📍 Your Location</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <input
              placeholder="Enter postcode (e.g. SW1A 1AA)"
              value={location}
              onChange={e => setLocation(e.target.value)}
              style={{ flex: 1, minWidth: 200, padding: 12, borderRadius: 8,
                border: "1px solid #ddd", fontSize: 15 }}
            />
            <button onClick={searchJobs} disabled={loading}
              style={{ padding: "12px 24px", background: "#1a237e", color: "white",
                border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold",
                fontSize: 15, whiteSpace: "nowrap" }}>
              {loading ? "Searching... ⏳" : "Find Jobs Near Me 🔍"}
            </button>
          </div>
          {postcode && postcode !== location && (
            <p style={{ margin: "8px 0 0", color: "#666", fontSize: 13 }}>
              📡 Detected location: <strong>{postcode}</strong> —
              <button onClick={() => setLocation(postcode)}
                style={{ background: "none", border: "none", color: "#1a237e",
                  cursor: "pointer", fontWeight: "bold", fontSize: 13 }}>
                Use this
              </button>
            </p>
          )}
        </div>

        {/* Top 3 Best Match Jobs */}
        {jobs.length > 0 && (
          <>
            <div style={{ background: "linear-gradient(135deg, #1a237e, #283593)",
              borderRadius: 16, padding: 24, marginBottom: 24, color: "white" }}>
              <h3 style={{ margin: "0 0 20px" }}>⭐ Top 3 Best Matches For You</h3>
              {jobs.slice(0, 3).map((job, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.12)",
                  borderRadius: 12, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: 16 }}>{job.jobTitle}</div>
                      <div style={{ opacity: 0.9, marginTop: 4 }}>🏢 {job.employerName}</div>
                      <div style={{ opacity: 0.8, fontSize: 13, marginTop: 4 }}>
                        📍 {job.locationName} · {job.minimumSalary && job.maximumSalary
                          ? `£${job.minimumSalary.toLocaleString()} - £${job.maximumSalary.toLocaleString()}`
                          : job.minimumSalary
                          ? `From £${job.minimumSalary.toLocaleString()}`
                          : "Salary not specified"}
                      </div>
                    </div>
                    <a href={job.jobUrl} target="_blank" rel="noreferrer"
                      style={{ padding: "8px 16px", background: "#ffd700", color: "#1a237e",
                        borderRadius: 20, textDecoration: "none", fontWeight: "bold",
                        fontSize: 13, whiteSpace: "nowrap" }}>
                      Apply Now →
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* All Jobs */}
            <div style={{ background: "white", borderRadius: 16, padding: 24,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: 24 }}>
              <h3 style={{ margin: "0 0 20px", color: "#1a237e" }}>
                All Jobs Within 5 Miles ({jobs.length})
              </h3>
              {jobs.map((job, i) => (
                <div key={i} style={{ border: "1px solid #e0e0e0", borderRadius: 12,
                  padding: 16, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold", fontSize: 16, color: "#1a237e" }}>
                        {job.jobTitle}
                      </div>
                      <div style={{ color: "#555", marginTop: 4 }}>🏢 {job.employerName}</div>
                      <div style={{ color: "#777", fontSize: 13, marginTop: 4 }}>
                        📍 {job.locationName}
                      </div>
                      <div style={{ color: "#2e7d32", fontSize: 13, marginTop: 4, fontWeight: "bold" }}>
                        💰 {job.minimumSalary && job.maximumSalary
                          ? `£${job.minimumSalary.toLocaleString()} - £${job.maximumSalary.toLocaleString()}`
                          : job.minimumSalary
                          ? `From £${job.minimumSalary.toLocaleString()}`
                          : "Salary not specified"}
                      </div>
                      {job.expirationDate && (
                        <div style={{ color: "#999", fontSize: 12, marginTop: 4 }}>
                          ⏰ Expires: {new Date(job.expirationDate).toLocaleDateString("en-GB")}
                        </div>
                      )}
                    </div>
                    <a href={job.jobUrl} target="_blank" rel="noreferrer"
                      style={{ padding: "8px 16px", background: "#1a237e", color: "white",
                        borderRadius: 20, textDecoration: "none", fontWeight: "bold",
                        fontSize: 13, whiteSpace: "nowrap" }}>
                      Apply →
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Skills Gap Reminder */}
            {missing.length > 0 && (
              <div style={{ background: "#fff3e0", borderRadius: 16, padding: 24,
                marginBottom: 24, border: "1px solid #ffe0b2" }}>
                <h3 style={{ margin: "0 0 12px", color: "#e65100" }}>
                  💡 Improve Your Match Score
                </h3>
                <p style={{ color: "#666", margin: "0 0 12px" }}>
                  Learn these skills to get more job matches:
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {missing.slice(0, 5).map((skill, i) => (
                    <a key={i}
                      href={`https://www.coursera.org/search?query=${encodeURIComponent(skill)}&price=free`}
                      target="_blank" rel="noreferrer"
                      style={{ padding: "6px 14px", background: "#ff6f00", color: "white",
                        borderRadius: 20, textDecoration: "none", fontSize: 13,
                        fontWeight: "bold" }}>
                      Learn {skill} →
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {searched && !loading && jobs.length === 0 && (
          <div style={{ background: "white", borderRadius: 16, padding: 40,
            textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <span style={{ fontSize: 48 }}>🔍</span>
            <h3 style={{ color: "#333" }}>No jobs found within 5 miles</h3>
            <p style={{ color: "#666" }}>Try a different postcode or location</p>
          </div>
        )}
      </div>
    </div>
  );
}