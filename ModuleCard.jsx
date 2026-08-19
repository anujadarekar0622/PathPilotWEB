import { useNavigate } from "react-router-dom";

export default function ModuleCard({ module, index }) {
  const navigate = useNavigate();
  const waypoint = typeof index === "number" ? String(index + 1).padStart(2, "0") : null;

  return (
    <article className="module-card" onClick={() => navigate(module.path)}>
      <div className="module-top">
        <div className="module-icon">
          <module.icon size={22} strokeWidth={1.8} />
        </div>
        {waypoint && <span className="module-waypoint">WP {waypoint}</span>}
      </div>
      <div>
        <h3>{module.title}</h3>
        <p>{module.description}</p>
      </div>
      <button
        className="card-button"
        onClick={(e) => {
          e.stopPropagation();
          navigate(module.path);
        }}
      >
        Open {module.title} <span>→</span>
      </button>
    </article>
  );
}