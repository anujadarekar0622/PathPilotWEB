import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoadmapInput() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    goal: "",
    education: "",
    semester: "",
    skills: "",
    hours: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("Please login first.");

      // send form data to django backend
      const response = await fetch("http://127.0.0.1:8000/api/ai/roadmap/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          goal: form.goal,
          education: form.education,
          semester: form.semester,
          skills: form.skills,
          hours: form.hours,
        }),
      });

      const data = await response.json();
      console.log("Roadmap API status:", response.status);
      console.log("Roadmap received:", data);

      if (!response.ok) throw new Error(data.detail || "Failed to generate roadmap.");

      // send the real ai-generated roadmap to result page
      navigate("/ai-roadmap/result", { state: { roadmap: data } });
    } catch (error) {
      console.error("Roadmap generation error:", error);
      setError(error.message || "Something went wrong while generating the roadmap.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="roadmap-hero">
        <div className="ai-orb">✦</div>
        <div>
          <div className="eyebrow">AI ROADMAP</div>
          <h1>Your next chapter, mapped out.</h1>
          <p>Tell PathPilot where you want to go. We'll turn it into a practical learning journey.</p>
        </div>
      </div>

      <form className="roadmap-form panel" onSubmit={submit}>
        <div className="form-section-title">
          <span>01</span>
          <div>
            <h3>About your goal</h3>
            <p>Start with the destination.</p>
          </div>
        </div>

        <div className="form-grid">
          <label>
            Career goal
            <input value={form.goal} onChange={update("goal")} placeholder="e.g. AI Engineer" required />
          </label>

          <label>
            Current education
            <input value={form.education} onChange={update("education")} placeholder="e.g. Diploma in Computer Engineering" required />
          </label>

          <label>
            Semester
            <input value={form.semester} onChange={update("semester")} placeholder="e.g. 2nd Semester" required />
          </label>

          <label>
            Hours available per day
            <input type="number" min="1" value={form.hours} onChange={update("hours")} placeholder="e.g. 3" required />
          </label>
        </div>

        <div className="form-section-title">
          <span>02</span>
          <div>
            <h3>What do you already know?</h3>
            <p>Separate skills with commas.</p>
          </div>
        </div>

        <label>
          Current skills
          <textarea value={form.skills} onChange={update("skills")} placeholder="Python, HTML, CSS, JavaScript..." required />
        </label>

        {error && <div className="error-message">{error}</div>}

        <div className="form-submit">
          <div>
            <strong>Project Based</strong>
            <small>Learning style selected for your roadmap</small>
          </div>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Generating Roadmap..." : "Generate AI Roadmap ✦"}
          </button>
        </div>
      </form>
    </div>
  );
}