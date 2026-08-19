import { useEffect, useRef, useState } from "react";
import SectionHeader from "../../components/ui/SectionHeader.jsx";

const BASE_URL = "http://127.0.0.1:8000/api/study-timer";

export default function StudyTimer() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [displaySeconds, setDisplaySeconds] = useState(0);

  const tickRef = useRef(null);

  const getToken = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Please log in again.");
      return null;
    }
    return token;
  };

  const authHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  const fetchActiveSession = async () => {
    try {
      setLoading(true);

      const token = getToken();
      if (!token) return;

      const response = await fetch(`${BASE_URL}/active/`, {
        method: "GET",
        headers: authHeaders(token),
      });

      if (response.status === 404) {
        setSession(null);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to load session.");
      }

      setSession(data);
    } catch (error) {
      console.error("Study timer error:", error);
      alert("Unable to load study timer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSession();
  }, []);

  // keeps the timer display ticking every second while a session is running
  useEffect(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }

    if (!session) {
      setDisplaySeconds(0);
      return;
    }

    if (session.status === "running") {
      const base = session.accumulated_seconds;
      const anchor = Date.now();

      setDisplaySeconds(base);

      tickRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - anchor) / 1000);
        setDisplaySeconds(base + elapsed);
      }, 1000);
    } else {
      setDisplaySeconds(session.accumulated_seconds);
    }

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [session]);

  const handleStart = async () => {
    try {
      setBusy(true);
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${BASE_URL}/start/`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({
          is_pomodoro: true,
          pomodoro_work_minutes: 25,
          pomodoro_break_minutes: 5,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to start session.");
      }

      setSession(data);
    } catch (error) {
      console.error("Start session error:", error);
      alert(error.message || "Unable to start timer.");
    } finally {
      setBusy(false);
    }
  };

  const handleAction = async (action) => {
    if (!session) return;

    try {
      setBusy(true);
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${BASE_URL}/${session.id}/${action}/`, {
        method: "POST",
        headers: authHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || `Failed to ${action} session.`);
      }

      if (action === "stop") {
        setSession(null);
      } else {
        setSession(data);
      }
    } catch (error) {
      console.error(`${action} session error:`, error);
      alert(error.message || `Unable to ${action} timer.`);
    } finally {
      setBusy(false);
    }
  };

  const handlePause = () => handleAction("pause");
  const handleResume = () => handleAction("resume");

  const handleStop = () => {
    const confirmed = window.confirm("End this study session?");
    if (!confirmed) return;
    handleAction("stop");
  };

  const formatDuration = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div>
      <SectionHeader
        eyebrow="STUDYHUB"
        title="Study timer."
        description="Focus on your studies with a simple study timer."
      />

      <section className="panel timer-panel">
        <div className="panel-heading">
          <div>
            <h3>Focus session</h3>
            <p>
              {session
                ? session.status === "running"
                  ? "Session in progress."
                  : "Session paused."
                : "25-minute Pomodoro block."}
            </p>
          </div>
        </div>

        <div className="timer-display">
          {loading ? "--:--" : formatDuration(displaySeconds)}
        </div>

        {!session ? (
          <button
            className="primary-button wide"
            onClick={handleStart}
            disabled={busy || loading}
          >
            {busy ? "Starting..." : "Start timer"}
          </button>
        ) : (
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            {session.status === "running" ? (
              <button className="primary-button" onClick={handlePause} disabled={busy}>
                Pause
              </button>
            ) : (
              <button className="primary-button" onClick={handleResume} disabled={busy}>
                Resume
              </button>
            )}

            <button className="ghost-button" onClick={handleStop} disabled={busy}>
              Stop
            </button>
          </div>
        )}
      </section>
    </div>
  );
}