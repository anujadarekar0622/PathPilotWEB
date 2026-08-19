import { useEffect, useState } from "react";
import SectionHeader from "../../components/ui/SectionHeader.jsx";

const API_URL = "http://127.0.0.1:8000/api/tasks/";

const TAGS = [
  "Study",
  "Coding",
  "Project",
  "Personal",
  "Other",
];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("today");

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [duration, setDuration] = useState(30);
  const [tag, setTag] = useState("Study");

  // =========================================================
  // FETCH TASKS
  // =========================================================

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Please log in again.");
        return;
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load tasks."
        );
      }

      setTasks(data);
    } catch (error) {
      console.error("Fetch tasks error:", error);
      alert("Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // =========================================================
  // ADD TASK
  // =========================================================

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Please log in again.");
        return;
      }

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          due_date: dueDate || null,
          duration: Number(duration),
          tag,
          is_completed: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);

        throw new Error(
          data.detail || "Failed to create task."
        );
      }

      setTasks((prev) => [data, ...prev]);

      // Clear form
      setTitle("");
      setDescription("");
      setDueDate("");
      setDuration(30);
      setTag("Study");

      setShowForm(false);

    } catch (error) {
      console.error("Add task error:", error);
      alert(error.message || "Unable to create task.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // TOGGLE COMPLETE
  // =========================================================

  const toggleTask = async (task) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${API_URL}${task.id}/`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            is_completed: !task.is_completed,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to update task."
        );
      }

      setTasks((prev) =>
        prev.map((item) =>
          item.id === task.id ? data : item
        )
      );

    } catch (error) {
      console.error("Toggle task error:", error);
      alert("Unable to update task.");
    }
  };

  // =========================================================
  // DELETE TASK
  // =========================================================

  const deleteTask = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${API_URL}${id}/`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        throw new Error(
          data.detail || "Failed to delete task."
        );
      }

      setTasks((prev) =>
        prev.filter((task) => task.id !== id)
      );

    } catch (error) {
      console.error("Delete task error:", error);
      alert(error.message || "Unable to delete task.");
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "No due date";
    }

    const taskDate = new Date(`${date}T00:00:00`);

    return taskDate.toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // FILTER TASKS
  // =========================================================

  const today = new Date();

  const todayString =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  const completedCount = tasks.filter(
    (task) => task.is_completed
  ).length;

  const todayCount = tasks.filter(
    (task) =>
      !task.is_completed &&
      task.due_date === todayString
  ).length;

  const visibleTasks = tasks.filter((task) => {

    if (filter === "completed") {
      return task.is_completed;
    }

    if (filter === "today") {
      return (
        !task.is_completed &&
        task.due_date === todayString
      );
    }

    if (filter === "upcoming") {
      return (
        !task.is_completed &&
        task.due_date !== todayString
      );
    }

    return true;
  });

  // =========================================================
  // UI
  // =========================================================

  return (
    <div>

      <SectionHeader
        eyebrow="TASKS"
        title="Stay on top of your day."
        description="Turn your goals into clear, manageable actions."
        action={
          <button
            className="primary-button"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "+ New task"}
          </button>
        }
      />

      {/* =====================================================
          ADD TASK FORM
      ===================================================== */}

      {showForm && (
        <section
          className="panel"
          style={{ marginBottom: 20 }}
        >

          <div className="panel-heading">
            <div>
              <h3>Create task</h3>
              <p>Add something you want to complete.</p>
            </div>
          </div>

          <form
            className="form-grid"
            onSubmit={handleAddTask}
          >

            <label>
              Task title

              <input
                type="text"
                placeholder="e.g. Practice Python"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />
            </label>

            <label>
              Category

              <select
                value={tag}
                onChange={(e) =>
                  setTag(e.target.value)
                }
              >
                {TAGS.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Due date

              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
              />
            </label>

            <label>
              Duration (minutes)

              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) =>
                  setDuration(e.target.value)
                }
              />
            </label>

            <label
              style={{
                gridColumn: "1 / -1",
              }}
            >
              Description

              <textarea
                placeholder="Optional description..."
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows="3"
              />
            </label>

            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving
                  ? "Creating..."
                  : "Create task"}
              </button>
            </div>

          </form>
        </section>
      )}

      {/* =====================================================
          FILTER TABS
      ===================================================== */}

      <div className="task-tabs">

        <button
          className={
            filter === "today"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("today")
          }
        >
          Today
          <span>{todayCount}</span>
        </button>

        <button
          className={
            filter === "upcoming"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("upcoming")
          }
        >
          Upcoming
          <span>
            {
              tasks.filter(
                (task) =>
                  !task.is_completed &&
                  task.due_date !== todayString
              ).length
            }
          </span>
        </button>

        <button
          className={
            filter === "completed"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("completed")
          }
        >
          Completed
          <span>{completedCount}</span>
        </button>

      </div>

      {/* =====================================================
          TASK LIST
      ===================================================== */}

      <section className="panel task-list">

        {loading ? (

          <p className="empty-state">
            Loading tasks...
          </p>

        ) : visibleTasks.length === 0 ? (

          <p className="empty-state">
            Nothing here yet — add a task to get started.
          </p>

        ) : (

          visibleTasks.map((task) => (

            <div
              className={`full-task ${
                task.is_completed
                  ? "completed"
                  : ""
              }`}
              key={task.id}
            >

              {/* CHECK */}

              <button
                className={`task-check ${
                  task.is_completed
                    ? "checked"
                    : ""
                }`}
                onClick={() =>
                  toggleTask(task)
                }
              >
                {task.is_completed
                  ? "✓"
                  : ""}
              </button>

              {/* TASK INFO */}

              <div className="task-copy">

                <strong>
                  {task.title}
                </strong>

                <small>
                  {formatDate(task.due_date)}
                  {" · "}
                  {task.duration} min
                </small>

                {task.description && (
                  <small
                    style={{
                      display: "block",
                      marginTop: 3,
                    }}
                  >
                    {task.description}
                  </small>
                )}

              </div>

              {/* TAG */}

              <span className="tag">
                {task.tag}
              </span>

              {/* DELETE */}

              <button
                className="more-button"
                onClick={() =>
                  deleteTask(task.id)
                }
                title="Delete task"
              >
                •••
              </button>

            </div>

          ))

        )}

      </section>

    </div>
  );
}