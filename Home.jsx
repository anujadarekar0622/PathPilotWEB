import { Flame } from "lucide-react";
import { modules } from "../../data/modules.js";
import ModuleCard from "../../components/ui/ModuleCard.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import ProgressBar from "../../components/ui/ProgressBar.jsx";

export default function Home() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <section className="dashboard-hero">
        <div>
          <div className="eyebrow">{greeting.toUpperCase()} · WELCOME BACK</div>
          <h1>Hello, Anuja <span className="wave">👋</span></h1>
          <p>Let's continue your journey today. Here's where things stand.</p>
        </div>
        <div className="hero-badge">
          <Flame size={20} strokeWidth={2} className="hero-badge-icon" />
          <div>
            <strong>7-day streak</strong>
            <small>Personal best: 12 days</small>
          </div>
        </div>
      </section>

      <div className="stats-grid">
        <StatCard label="Productivity score" value="84" helper="+8 from last week" icon="↗" />
        <StatCard label="Tasks due today" value="2" helper="1 already done" icon="✓" />
        <StatCard label="Active goals" value="3" helper="1 due this month" icon="◎" />
        <StatCard label="Hours learned" value="26.5h" helper="this month" icon="◷" />
      </div>

      <div className="content-heading">
        <h2>Your modules</h2>
        <p>Everything PathPilot tracks for you, laid out as your flight plan.</p>
      </div>

      <div className="modules-grid waypoint-grid">
        {modules.map((module, index) => (
          <ModuleCard module={module} index={index} key={module.key} />
        ))}
      </div>

      <div className="home-lower">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Today's tasks</h3>
              <p>A quick look before you dive in.</p>
            </div>
            <span>2 remaining</span>
          </div>
          <div className="task-preview">
            <div className="check done">✓</div>
            <div>
              <strong>Finish DBMS notes</strong>
              <small>Today · 45 min · Study</small>
            </div>
          </div>
          <div className="task-preview">
            <div className="check" />
            <div>
              <strong>Practice Python problems</strong>
              <small>Today · 60 min · Coding</small>
            </div>
          </div>
        </section>

        <section className="panel accent-panel">
          <div className="panel-kicker">NEXT WAYPOINT</div>
          <h3>Build your AI Roadmap</h3>
          <p>Tell PathPilot your career goal and get a phased, personalized learning path.</p>
          <ProgressBar value={0} label="Roadmap generated" right="Not started" />
        </section>
      </div>
    </div>
  );
}