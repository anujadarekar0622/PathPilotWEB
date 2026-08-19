import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Splash.css";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1900);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <img className="splash-logo" src="/pathpilot-logo.png" alt="PathPilot" />
      <h1>PathPilot</h1>
      <p>Charting your next chapter.</p>
    </div>
  );
}