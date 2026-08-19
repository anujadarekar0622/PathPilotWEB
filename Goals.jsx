import { Code2, Rocket, Database } from "lucide-react";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import ProgressBar from "../../components/ui/ProgressBar.jsx";

const goals = [
  { title: "Become a strong Python developer", type: "Yearly", progress: 62, due: "Dec 2026", icon: Code2 },
  { title: "Build PathPilot", type: "Project", progress: 74, due: "Aug 2026", icon: Rocket },
  { title: "Complete DBMS module", type: "Monthly", progress: 48, due: "Aug 31", icon: Database },
];

export default function Goals() {
  return (
    <div>
      <SectionHeader
        eyebrow="GOALS"
        title="Give your plans a direction."
        description="Track what matters from today's target to your long-term vision."
        action={<button className="primary-button">+ Add goal</button>}
      />

      <div className="goal-grid">
        {goals.map((goal) => (
          <article className="goal-card" key={goal.title}>
            <div className="goal-top">
              <goal.icon className="goal-icon" size={22} strokeWidth={1.8} />
              <span className="tag">{goal.type}</span>
            </div>
            <h3>{goal.title}</h3>
            <div className="goal-due">Target · {goal.due}</div>
            <ProgressBar value={goal.progress} label="Completed" />
            <button className="ghost-button">View goal →</button>
          </article>
        ))}
      </div>

      <section className="quote-panel">
        <div>✦</div>
        <div>
          <strong>Progress, not perfection.</strong>
          <p>A goal becomes achievable when you turn it into the next small action.</p>
        </div>
      </section>
    </div>
  );
}