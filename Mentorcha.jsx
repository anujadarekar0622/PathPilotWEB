import { useState, useRef, useEffect } from "react";
import SectionHeader from "../../components/ui/SectionHeader.jsx";

const starterPrompts = [
  "Help me plan today's study session",
  "I'm stuck on recursion, explain it simply",
  "Am I on track for my AI Engineer roadmap?",
  "Suggest a break routine for long study hours",
];

export default function MentorChat() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hey Anuja 👋 I'm your PathPilot mentor. I can help you plan study time, unblock tricky topics, or check how you're tracking against your roadmap. What's on your mind?",
    },
  ]);

  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const scrollRef = useRef(null);

  const getAccessToken = () => {
    return localStorage.getItem("accessToken");
  };

  // load previous chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      const token = getAccessToken();

      if (!token) {
        setLoadingHistory(false);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/chatbot/history/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load chat history.");
        }

        const data = await response.json();

        const formattedMessages = data.map((message) => ({
          role: message.role === "assistant" ? "ai" : "user",
          text: message.message,
        }));

        if (formattedMessages.length > 0) {
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Chat history error:", error);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  const send = async (text) => {
    const content = (text ?? draft).trim();

    if (!content || typing) {
      return;
    }

    const token = getAccessToken();

    if (!token) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Your session has expired. Please log in again.",
        },
      ]);

      return;
    }

    // show the user's message right away, before the API responds
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: content,
      },
    ]);

    setDraft("");
    setTyping(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chatbot/chat/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to generate AI response.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Sorry, I couldn't connect to PathPilot AI right now. Please try again.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    send();
  };

  return (
    <div>
      <SectionHeader
        eyebrow="AI MENTOR"
        title="Talk it through with your mentor."
        description="Ask about your subjects, your schedule, or how you're tracking — PathPilot's mentor keeps context on your progress."
      />

      <div className="chat-shell panel">
        <div className="chat-messages" ref={scrollRef}>
          {loadingHistory ? (
            <div className="chat-bubble-row ai">
              <div className="chat-avatar ai">✦</div>

              <div className="chat-bubble ai">Loading conversation...</div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div className={`chat-bubble-row ${m.role}`} key={i}>
                {m.role === "ai" && <div className="chat-avatar ai">✦</div>}

                <div className={`chat-bubble ${m.role}`}>{m.text}</div>

                {m.role === "user" && <div className="chat-avatar user">A</div>}
              </div>
            ))
          )}

          {typing && (
            <div className="chat-bubble-row ai">
              <div className="chat-avatar ai">✦</div>

              <div className="chat-bubble ai chat-typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
        </div>

        {!loadingHistory && messages.length <= 1 && (
          <div className="chat-suggestions">
            {starterPrompts.map((p) => (
              <button key={p} className="chat-chip" onClick={() => send(p)} type="button">
                {p}
              </button>
            ))}
          </div>
        )}

        <form className="chat-input-row" onSubmit={submit}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask your mentor anything..."
            disabled={typing}
          />

          <button className="primary-button" type="submit" disabled={!draft.trim() || typing}>
            {typing ? "Thinking..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}