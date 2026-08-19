import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import SectionHeader from "../../components/ui/SectionHeader.jsx";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function Timetable() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [title, setTitle] = useState("");
  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const fetchSchedules = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Please log in again.");
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/subjects/schedules/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to load timetable.");
      }

      setSchedules(data);
    } catch (error) {
      console.error("Timetable error:", error);
      alert("Unable to load timetable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleAddSchedule = async (e) => {
    e.preventDefault();

    if (!title.trim() || !startTime || !endTime) {
      alert("Please fill all fields.");
      return;
    }

    if (startTime >= endTime) {
      alert("End time must be after start time.");
      return;
    }

    try {
      setAdding(true);

      const token = localStorage.getItem("accessToken");

      const response = await fetch("http://127.0.0.1:8000/api/subjects/schedules/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          day,
          start_time: startTime,
          end_time: endTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        throw new Error(data.detail || "Failed to add schedule.");
      }

      setSchedules((prev) => [...prev, data]);

      setTitle("");
      setDay("Monday");
      setStartTime("");
      setEndTime("");

      alert("Schedule added successfully.");
    } catch (error) {
      console.error("Add schedule error:", error);
      alert(error.message || "Unable to add schedule.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this schedule?");

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://127.0.0.1:8000/api/subjects/schedules/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete schedule.");
      }

      setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
    } catch (error) {
      console.error("Delete schedule error:", error);
      alert("Unable to delete schedule.");
    }
  };

  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getDaySchedules = (selectedDay) => {
    return schedules
      .filter((schedule) => schedule.day === selectedDay)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  return (
    <div>
      <SectionHeader
        eyebrow="STUDYHUB"
        title="Timetable."
        description="Plan your classes and study sessions."
      />

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Add schedule</h3>
            <p>Create a class or study block.</p>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleAddSchedule}>
          <label>
            Title
            <input
              type="text"
              placeholder="e.g. Python Study"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label>
            Day
            <select value={day} onChange={(e) => setDay(e.target.value)}>
              {DAYS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            Start time
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </label>

          <label>
            End time
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </label>

          <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="primary-button" disabled={adding}>
              {adding ? "Adding..." : "+ Add schedule"}
            </button>
          </div>
        </form>
      </section>

      <section className="panel" style={{ marginTop: 20 }}>
        <div className="panel-heading">
          <div>
            <h3>Weekly timetable</h3>
            <p>Your saved classes and study sessions.</p>
          </div>
        </div>

        {loading ? (
          <p className="empty-state">Loading timetable...</p>
        ) : schedules.length === 0 ? (
          <p className="empty-state">
            Nothing scheduled yet — add your first class or study block.
          </p>
        ) : (
          <div>
            {DAYS.map((selectedDay) => {
              const daySchedules = getDaySchedules(selectedDay);

              if (daySchedules.length === 0) {
                return null;
              }

              return (
                <div key={selectedDay} style={{ marginBottom: 24 }}>
                  <h4>{selectedDay}</h4>

                  {daySchedules.map((schedule) => (
                    <div
                      className="tool-row"
                      key={schedule.id}
                      style={{ cursor: "default", marginBottom: 8 }}
                    >
                      <div className="tool-row-label">
                        <div>
                          <strong>{schedule.title}</strong>

                          <small style={{ display: "block", marginTop: 3 }}>
                            {formatTime(schedule.start_time)} –{" "}
                            {formatTime(schedule.end_time)}
                          </small>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => handleDelete(schedule.id)}
                        title="Delete schedule"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}