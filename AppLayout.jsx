import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { navItems } from "../../data/modules.js";

export default function AppLayout() {
  const navigate = useNavigate();

  return (
    <div className="app-shell">

      <aside className="sidebar">

        <button className="brand" onClick={() => navigate("/home")}>
          <div className="brand-mark">
            <img src="/pathpilot-logo.png" alt="" />
          </div>
          <div>
            <strong>PathPilot</strong>
            <span>Learning companion</span>
          </div>
        </button>

        <p className="nav-label">Flight plan</p>

        <nav className="nav-list">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <item.icon className="nav-icon" size={17} strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="profile-mini" onClick={() => navigate("/profile")}>
            <span className="avatar">A</span>
            <span className="profile-mini-text">
              <strong>Anuja</strong>
              <small>Student</small>
            </span>
            <span className="chevron">›</span>
          </button>
        </div>

      </aside>

      <main className="main-area">

        <header className="topbar">
          <button className="mobile-brand" onClick={() => navigate("/home")}>
            <div className="brand-mark small">
              <img src="/pathpilot-logo.png" alt="" />
            </div>
            <strong>PathPilot</strong>
          </button>

          <div className="topbar-spacer" />

          <button className="top-icon" onClick={() => navigate("/profile")} title="Profile">
            A
          </button>
        </header>

        <div className="page-area">
          <Outlet />
        </div>

      </main>

    </div>
  );
}