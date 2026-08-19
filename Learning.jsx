import SectionHeader from "../../components/ui/SectionHeader.jsx";
import ProgressBar from "../../components/ui/ProgressBar.jsx";

const subjects = [
  ["Python", "Programming", 78],
  ["DBMS", "Computer Engineering", 64],
  ["Data Structures", "Programming", 52],
  ["Computer Networks", "Computer Engineering", 41],
];

export default function Learning() {
  return (
    <div>
      <SectionHeader eyebrow="STUDYHUB" title="Learn with structure." description="Keep your subjects, notes and study activity in one place." action={<button className="primary-button">+ Add subject</button>} />

      <div className="learning-layout">
        <section className="panel">
          <div className="panel-heading"><div><h3>My subjects</h3><p>Your current learning progress.</p></div></div>
          {subjects.map(([name, type, progress]) => (
            <div className="subject-card" key={name}>
              <div className="subject-icon">📘</div>
              <div className="subject-main">
                <strong>{name}</strong><small>{type}</small>
                <ProgressBar value={progress} label="Progress" />
              </div>
              <button className="ghost-button">Open →</button>
            </div>
          ))}
        </section>

        <section className="panel">
          <div className="panel-heading"><div><h3>Quick tools</h3><p>Jump into your study workflow.</p></div></div>
          {["📅 Timetable", "✓ Attendance", "⏱ Study Timer"].map(item => (
            <button className="tool-row" key={item}><span>{item}</span><span>→</span></button>
          ))}
        </section>
      </div>
    </div>
  );
}