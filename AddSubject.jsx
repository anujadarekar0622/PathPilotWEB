import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../../components/ui/SectionHeader.jsx";

export default function AddSubject() {
  const navigate = useNavigate();

  const [subjectName, setSubjectName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subjectName.trim() || !topicName.trim()) {
      alert("Please enter the subject name and topic name.");
      return;
    }

    const formData = new FormData();
    formData.append("subject_name", subjectName.trim());
    formData.append("topic_name", topicName.trim());

    // pdf is optional
    if (pdf) {
      formData.append("pdf", pdf);
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Your session has expired. Please log in again.");
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/subjects/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Add subject error:", data);
        alert(data.detail || "Failed to add subject.");
        return;
      }

      alert("Subject added successfully!");
      navigate("/studyhub");
    } catch (error) {
      console.error("Error adding subject:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader
        eyebrow="STUDYHUB"
        title="Add a subject."
        description="Attach a topic and a study PDF so it shows up in your subject list."
      />

      <form className="panel roadmap-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Subject name
            <input
              type="text"
              placeholder="e.g. Java"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />
          </label>

          <label>
            Topic name
            <input
              type="text"
              placeholder="e.g. Unit 1"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
            />
          </label>
        </div>

        <label>
          Upload PDF
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPdf(e.target.files[0] || null)}
          />
        </label>

        <div className="form-submit">
          <div>
            <strong>Study resource</strong>
            <small>
              PDF is optional and can be attached to this subject's topic.
            </small>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              className="ghost-button"
              onClick={() => navigate("/studyhub")}
              disabled={loading}
            >
              Cancel
            </button>

            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Adding..." : "Add subject"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}