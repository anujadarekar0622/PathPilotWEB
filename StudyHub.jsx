import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, CalendarDays, Timer } from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import ProgressBar from "../../components/ui/ProgressBar.jsx";

const tools = [
  {
    label: "Timetable",
    icon: CalendarDays,
    path: "/timetable",
  },
  {
    label: "Study Timer",
    icon: Timer,
    path: "/study-timer",
  },
];

export default function StudyHub() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("accessToken");

        if (!token) {
          setError("Please log in again.");
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/api/subjects/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Failed to load subjects.");
        }

        setSubjects(data);
      } catch (error) {
        console.error("Error loading subjects:", error);
        setError("Unable to load your subjects.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div>
      <SectionHeader
        eyebrow="STUDYHUB"
        title="Learn with structure."
        description="Keep your subjects, notes and study activity in one place."
        action={
          <button className="primary-button" onClick={() => navigate("/add-subject")}>
            + Add subject
          </button>
        }
      />

      <div className="learning-layout">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>My subjects</h3>
              <p>Your current learning progress.</p>
            </div>
          </div>

          {loading && <p className="empty-state">Loading subjects...</p>}

          {!loading && error && <p className="empty-state">{error}</p>}

          {!loading &&
            !error &&
            subjects.map((subject) => (
              <div className="subject-card" key={subject.id}>
                <div className="subject-icon">
                  <BookOpen size={19} strokeWidth={1.8} />
                </div>

                <div className="subject-main">
                  <strong>{subject.subject_name}</strong>
                  <small>{subject.topic_name}</small>

                  <ProgressBar
                    value={subject.is_completed ? 100 : 0}
                    label="Progress"
                  />
                </div>

                <button
                  className="ghost-button"
                  onClick={() => navigate(`/subjects/${subject.id}`)}
                >
                  Open →
                </button>
              </div>
            ))}

          {!loading && !error && subjects.length === 0 && (
            <div className="empty-state">
              <p>No subjects yet — add your first one to get started.</p>

              <button className="primary-button" onClick={() => navigate("/add-subject")}>
                + Add subject
              </button>
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Quick tools</h3>
              <p>Jump into your study workflow.</p>
            </div>
          </div>

          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <button
                className="tool-row"
                key={tool.path}
                onClick={() => navigate(tool.path)}
              >
                <span className="tool-row-label">
                  <Icon size={16} strokeWidth={1.8} />
                  {tool.label}
                </span>
                <span>→</span>
              </button>
            );
          })}
        </section>
      </div>
    </div>
  );
}