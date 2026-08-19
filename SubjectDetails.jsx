import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FileText,
  BookOpen,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  MessageCircle,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";

export default function SubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ai study tool state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [aiAction, setAiAction] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchSubject = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(`http://127.0.0.1:8000/api/subjects/${id}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Failed to fetch subject.");
        }

        if (!ignore) {
          setSubject(data);
        }
      } catch (error) {
        console.error("Error fetching subject:", error);

        if (!ignore) {
          setError(
            error.message === "Authentication required"
              ? "Please log in again."
              : "Unable to load subject."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchSubject();

    return () => {
      ignore = true;
    };
  }, [id]);

  const runAITool = async (action) => {
    if (!subject) return;

    try {
      setAiLoading(true);
      setAiResult("");
      setAiAction(action);

      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Please log in again.");
        return;
      }

      let question = "";

      if (action === "explain") {
        question = window.prompt("What do you want PathPilot AI to explain?");

        if (!question || !question.trim()) {
          setAiLoading(false);
          setAiAction("");
          return;
        }
      }

      const response = await fetch("http://127.0.0.1:8000/api/subjects/ai-tools/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: subject.subject_name,
          topic: subject.topic_name,
          action: action,
          question: question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to generate AI response.");
      }

      setAiResult(data.reply || "No response received.");
    } catch (error) {
      console.error("AI Study Tool error:", error);
      setAiResult("Sorry, I couldn't generate the response right now. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${subject.subject_name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Please log in again.");
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/subjects/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to delete subject.");
      }

      alert("Subject deleted successfully.");
      navigate("/studyhub");
    } catch (error) {
      console.error("Delete subject error:", error);
      alert(error.message || "Unable to delete subject.");
    }
  };

  if (loading) {
    return (
      <div className="panel">
        <p className="empty-state">Loading subject...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <SectionHeader
          eyebrow="STUDYHUB"
          title="Subject unavailable."
          description="We couldn't load this subject."
        />

        <div className="panel">
          <p className="empty-state">{error}</p>

          <button className="ghost-button" onClick={() => navigate("/studyhub")}>
            ← Back to StudyHub
          </button>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="panel">
        <p className="empty-state">Subject not found.</p>

        <button className="ghost-button" onClick={() => navigate("/studyhub")}>
          ← Back to StudyHub
        </button>
      </div>
    );
  }

  const pdfUrl = subject.pdf
    ? subject.pdf.startsWith("http")
      ? subject.pdf
      : `http://127.0.0.1:8000${subject.pdf}`
    : null;

  return (
    <div>
      <button className="back-link" onClick={() => navigate("/studyhub")}>
        ← Back to StudyHub
      </button>

      <SectionHeader
        eyebrow="STUDYHUB · SUBJECT"
        title={subject.subject_name}
        description={subject.topic_name}
      />

      <div className="learning-layout">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Subject details</h3>
              <p>Information about this study topic.</p>
            </div>

            <div className="subject-icon">
              <BookOpen size={20} strokeWidth={1.8} />
            </div>
          </div>

          <div className="form-grid">
            <div>
              <small>Subject</small>
              <strong>{subject.subject_name}</strong>
            </div>

            <div>
              <small>Topic</small>
              <strong>{subject.topic_name}</strong>
            </div>

            <div>
              <small>Status</small>
              <strong>
                {subject.is_completed ? (
                  <>
                    <CheckCircle2
                      size={16}
                      style={{ verticalAlign: "middle", marginRight: 6 }}
                    />
                    Completed
                  </>
                ) : (
                  "In progress"
                )}
              </strong>
            </div>

            <div>
              <small>Created</small>
              <strong>
                {subject.created_at
                  ? new Date(subject.created_at).toLocaleDateString()
                  : "—"}
              </strong>
            </div>
          </div>

          {subject.description && (
            <div style={{ marginTop: 24 }}>
              <h4>Description</h4>
              <p>{subject.description}</p>
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Study resource</h3>
              <p>Your uploaded study material.</p>
            </div>

            <FileText size={20} strokeWidth={1.8} />
          </div>

          {pdfUrl ? (
            <div>
              <div className="tool-row" style={{ cursor: "default", marginBottom: 16 }}>
                <span className="tool-row-label">
                  <FileText size={17} strokeWidth={1.8} />
                  Study PDF
                </span>
                <span>PDF</span>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="primary-button">
                  Open PDF
                </a>

                <a href={pdfUrl} download className="ghost-button">
                  Download PDF
                </a>
              </div>
            </div>
          ) : (
            <p className="empty-state">No PDF has been uploaded for this subject.</p>
          )}
        </section>
      </div>

      <section className="panel" style={{ marginTop: 24 }}>
        <div className="panel-heading">
          <div>
            <h3>AI Study Tools</h3>
            <p>Use PathPilot AI to study this topic.</p>
          </div>

          <Sparkles size={20} strokeWidth={1.8} />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            className="primary-button"
            type="button"
            disabled={aiLoading}
            onClick={() => runAITool("summary")}
          >
            <Sparkles size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Quick Summary
          </button>

          <button
            className="ghost-button"
            type="button"
            disabled={aiLoading}
            onClick={() => runAITool("questions")}
          >
            <HelpCircle size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Practice Questions
          </button>

          <button
            className="ghost-button"
            type="button"
            disabled={aiLoading}
            onClick={() => runAITool("explain")}
          >
            <MessageCircle size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Explain Topic
          </button>
        </div>

        {aiLoading && (
          <div style={{ marginTop: 20 }}>
            <p className="empty-state">PathPilot AI is thinking...</p>
          </div>
        )}

        {!aiLoading && aiResult && (
          <div
            style={{
              marginTop: 20,
              padding: 20,
              borderRadius: 12,
              background: "rgba(171, 194, 112, 0.12)",
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
            }}
          >
            <strong>
              {aiAction === "summary"
                ? "Quick Summary"
                : aiAction === "questions"
                ? "Practice Questions"
                : "Explanation"}
            </strong>

            <p style={{ marginTop: 12 }}>{aiResult}</p>
          </div>
        )}
      </section>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
        <button type="button" className="ghost-button" onClick={handleDelete}>
          Delete Subject
        </button>
      </div>
    </div>
  );
}