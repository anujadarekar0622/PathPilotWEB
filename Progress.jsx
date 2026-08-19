import { Flame } from "lucide-react";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import ProgressBar from "../../components/ui/ProgressBar.jsx";

const weeks = [48, 62, 55, 72, 67, 82, 76];
const days = ["M", "T", "W", "T", "F", "S", "S"];

export default function Progress() {
  return (
    <div>
      <SectionHeader
        eyebrow="PROGRESS HUB"
        title="See how far you've come."
        description="A simple view of your consistency, goals and learning momentum."
        action={<button className="ghost-button">This week ▾</button>}
      />

      <div className="stats-grid">
        <StatCard label="Productivity score" value="84" helper="+8 from last week" icon="↗" />
        <StatCard label="Goals completed" value="12" helper="this semester" icon="◎" />
        <StatCard label="Study streak" value="7 days" helper="personal best: 12" icon={<Flame size={18} strokeWidth={2} />} />
        <StatCard label="Hours learned" value="26.5h" helper="this month" icon="◷" />
      </div>

      <div className="progress-layout">
        <section className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h3>Weekly activity</h3>
              <p>Your study time across the last seven days.</p>
            </div>
          </div>
          <div className="fake-chart">
            {weeks.map((height, i) => (
              <div className="bar-wrap" key={i}>
                <div className="bar" style={{ height: `${height}%` }} />
                <small>{days[i]}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Skill growth</h3>
              <p>Current confidence by area.</p>
            </div>
          </div>
          <ProgressBar label="Python" value={78} />
          <ProgressBar label="React" value={65} />
          <ProgressBar label="Django" value={57} />
          <ProgressBar label="Database" value={71} />
        </section>
      </div>
    </div>
  );
}