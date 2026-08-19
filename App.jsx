import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./app.css";
import AppLayout from "./components/layout/AppLayout.jsx";

import Splash from "./pages/Splash/Splash.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";

import Home from "./pages/Home/Home.jsx";
import StudyHub from "./pages/StudyHub/StudyHub.jsx";
import Tasks from "./pages/Tasks/Tasks.jsx";
import Goals from "./pages/Goals/Goals.jsx";
import Progress from "./pages/Progress/Progress.jsx";
import Profile from "./pages/Profile/Profile.jsx";

import RoadmapInput from "./pages/AIRoadmap/RoadmapInput.jsx";
import Roadmap from "./pages/AIRoadmap/Roadmap.jsx";

import Timetable from "./pages/StudyHub/Timetable.jsx";
import StudyTimer from "./pages/StudyHub/StudyTimer.jsx";

import AddSubject from "./pages/StudyHub/AddSubject.jsx";
import SubjectDetails from "./pages/StudyHub/SubjectDetails.jsx";

import MentorChat from "./pages/AIRoadmap/MentorCha.jsx";

import PocketMoney from "./pages/PocketMoney/Pocketmoney.jsx";
import ExpenseTracker from "./pages/Expensetracker/Expensetracker.jsx";

import KnowledgeVault from "./pages/KnowledgeVault/Knowledgevault.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* auth routes */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* main app, everything inside the sidebar layout */}
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/studyhub" element={<StudyHub />} />

          {/* studyhub tools */}
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/study-timer" element={<StudyTimer />} />
          <Route path="/add-subject" element={<AddSubject />} />
          <Route path="/subjects/:id" element={<SubjectDetails />} />

          <Route path="/tasks" element={<Tasks />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />

          {/* ai */}
          <Route path="/ai-mentor" element={<MentorChat />} />

          {/* finance */}
          <Route path="/pocket-money" element={<PocketMoney />} />
          <Route path="/expense-tracker" element={<ExpenseTracker />} />

          {/* knowledge vault */}
          <Route path="/knowledge-vault" element={<KnowledgeVault />} />

          {/* ai roadmap */}
          <Route path="/ai-roadmap" element={<RoadmapInput />} />
          <Route path="/ai-roadmap/result" element={<Roadmap />} />
        </Route>

        {/* catch-all, keep this last */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;