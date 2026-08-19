import { useState } from "react";
import SectionHeader from "../../components/ui/SectionHeader.jsx";

export default function Profile() {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <SectionHeader
        eyebrow="PROFILE"
        title="Your learning identity."
        description="Keep your profile and preferences up to date."
        action={
          <button className="primary-button" onClick={() => setSaved(true)}>
            {saved ? "Saved ✓" : "Save changes"}
          </button>
        }
      />

      <div className="profile-layout">
        <section className="panel profile-card">
          <div className="profile-hero">
            <div className="profile-avatar">A</div>
            <div>
              <h2>Anuja Darekar</h2>
              <p>Computer Engineering · Student</p>
            </div>
          </div>
          <div className="profile-form">
            <label>
              Full name
              <input defaultValue="Anuja Darekar" onChange={() => setSaved(false)} />
            </label>
            <label>
              Email
              <input defaultValue="anuja@example.com" onChange={() => setSaved(false)} />
            </label>
            <label>
              Education
              <input defaultValue="Diploma in Computer Engineering" onChange={() => setSaved(false)} />
            </label>
            <label>
              Current semester
              <input defaultValue="Second Semester" onChange={() => setSaved(false)} />
            </label>
          </div>
        </section>

        <aside className="panel">
          <div className="panel-heading">
            <div>
              <h3>Learning preferences</h3>
              <p>Used to personalize PathPilot.</p>
            </div>
          </div>
          <label>
            Daily study target
            <select defaultValue="3" onChange={() => setSaved(false)}>
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
              <option value="4">4 hours</option>
              <option value="5">5+ hours</option>
            </select>
          </label>
          <label>
            Preferred learning style
            <select defaultValue="project" onChange={() => setSaved(false)}>
              <option value="project">Project Based</option>
              <option value="visual">Visual</option>
              <option value="reading">Reading</option>
            </select>
          </label>
          <div className="preference-note">✦ These preferences will also help the AI Roadmap create a more useful plan.</div>
        </aside>
      </div>
    </div>
  );
}