import { useLocation, useNavigate } from "react-router-dom";
import ProgressBar from "../../components/ui/ProgressBar.jsx";

const fallback = {
  career: "AI Engineer",
  estimated_duration: "13 Months",
  difficulty: "Advanced",
  phases: [
    { title: "Phase 1: Python & Core Foundations", duration: "2 Months", topics: ["Python", "OOP", "Data Structures", "Git & GitHub"], projects: ["CLI Task Manager", "Automated Web Scraper"], resources: ["Python for Everybody", "Automate the Boring Stuff"] },
    { title: "Phase 2: Mathematics & Data", duration: "3 Months", topics: ["Linear Algebra", "Calculus", "Probability", "NumPy & Pandas"], projects: ["Data Dashboard", "Matrix Library"], resources: ["Mathematics for Machine Learning", "Python for Data Analysis"] },
    { title: "Phase 3: Machine Learning", duration: "3 Months", topics: ["Regression", "Classification", "Clustering", "Model Evaluation"], projects: ["Customer Churn Predictor", "Prediction API"], resources: ["ML Specialization", "Kaggle Learn"] },
    { title: "Phase 4: Deep Learning", duration: "3 Months", topics: ["Neural Networks", "PyTorch", "CNNs", "NLP"], projects: ["Image Classifier", "Sentiment Analyzer"], resources: ["Fast.ai", "PyTorch Tutorials"] },
    { title: "Phase 5: Generative AI & Deployment", duration: "2 Months", topics: ["Transformers", "LLMs", "RAG", "MLOps"], projects: ["PDF Q&A Bot", "Production ML App"], resources: ["Hugging Face Course", "Made With ML"] }
  ]
};

export default function Roadmap() {
  const location = useLocation();
  const navigate = useNavigate();
  const roadmap = location.state?.roadmap || fallback;

  return (
    <div>
      <div className="roadmap-result-head">
        <button className="back-link" onClick={() => navigate("/ai-roadmap")}>← Edit inputs</button>
        <div className="roadmap-title-row">
          <div className="ai-orb">✦</div>
          <div>
            <div className="eyebrow">YOUR PERSONALIZED ROADMAP</div>
            <h1>{roadmap.career}</h1>
            <p>A practical path built around your current starting point.</p>
          </div>
        </div>
        <div className="roadmap-meta">
          <div><span>Duration</span><strong>{roadmap.estimated_duration}</strong></div>
          <div><span>Difficulty</span><strong>{roadmap.difficulty}</strong></div>
          <div><span>Phases</span><strong>{roadmap.phases?.length || 0}</strong></div>
        </div>
      </div>

      <div className="roadmap-timeline">
        {roadmap.phases?.map((phase, index) => (
          <article className="phase-card" key={phase.title}>
            <div className="phase-number">{String(index + 1).padStart(2, "0")}</div>
            <div className="phase-content">
              <div className="phase-heading">
                <div>
                  <span className="eyebrow">PHASE {index + 1}</span>
                  <h2>{phase.title}</h2>
                </div>
                <span className="duration">{phase.duration}</span>
              </div>
              <div className="phase-columns">
                <div>
                  <h4>Learn</h4>
                  {phase.topics?.map(t => <div className="bullet" key={t}>✓ <span>{t}</span></div>)}
                </div>
                <div>
                  <h4>Build</h4>
                  {phase.projects?.map(t => <div className="bullet project" key={t}>◆ <span>{t}</span></div>)}
                </div>
                <div>
                  <h4>Resources</h4>
                  {phase.resources?.map(t => <div className="resource" key={t}>{t}</div>)}
                </div>
              </div>
              <ProgressBar value={Math.max(12, Math.min(100, (index + 1) * 20))} label="Suggested phase completion" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}