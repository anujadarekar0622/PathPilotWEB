import { useEffect, useState } from "react";
import SectionHeader from "../../components/ui/SectionHeader.jsx";

const API_BASE = "http://127.0.0.1:8000";

export default function PocketMoney() {
  const [txns, setTxns] = useState([]);

  const [analytics, setAnalytics] = useState({
    current_balance: 0,
    total_income: 0,
    total_spent: 0,
  });

  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getToken = () => {
    return localStorage.getItem("accessToken");
  };

  const getSourceLabel = (sourceValue) => {
    const labels = {
      parents: "Parents",
      scholarship: "Scholarship",
      gift: "Gift",
      part_time: "Part Time",
      other: "Other",
    };

    return labels[sourceValue] || sourceValue;
  };

  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date);

    return d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Please login again.");
        return;
      }

      const [moneyResponse, analyticsResponse] = await Promise.all([
        fetch(`${API_BASE}/api/pocket-money/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch(`${API_BASE}/api/pocket-money/analytics/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (!moneyResponse.ok) {
        const data = await moneyResponse.json().catch(() => ({}));
        console.error("Money API error:", data);
        throw new Error("Failed to load pocket money.");
      }

      if (!analyticsResponse.ok) {
        const data = await analyticsResponse.json().catch(() => ({}));
        console.error("Analytics API error:", data);
        throw new Error("Failed to load analytics.");
      }

      const moneyData = await moneyResponse.json();
      const analyticsData = await analyticsResponse.json();

      setAnalytics({
        current_balance: Number(analyticsData.current_balance || 0),
        total_income: Number(analyticsData.total_income || 0),
        total_spent: Number(analyticsData.total_spent || 0),
      });

      const incomeTransactions = moneyData.map((item) => ({
        id: item.id,
        title: getSourceLabel(item.source),
        amount: Number(item.amount),
        date: formatDate(item.date),
        type: "in",
      }));

      setTxns(incomeTransactions);
    } catch (err) {
      console.error("Pocket money load error:", err);
      setError("Unable to load pocket money.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addFunds = async (e) => {
    e.preventDefault();

    const value = parseFloat(amount);

    if (!value || value <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (!source) {
      setError("Please select a source.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await fetch(`${API_BASE}/api/pocket-money/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: value,
          source: source,
          date: new Date().toISOString().split("T")[0],
        }),
      });

      const data = await response.json();

      console.log("Add money response:", data);

      if (!response.ok) {
        console.error("Backend validation error:", data);

        if (data.source) {
          throw new Error(Array.isArray(data.source) ? data.source[0] : data.source);
        }

        if (data.amount) {
          throw new Error(Array.isArray(data.amount) ? data.amount[0] : data.amount);
        }

        if (data.date) {
          throw new Error(Array.isArray(data.date) ? data.date[0] : data.date);
        }

        throw new Error("Failed to add money.");
      }

      setAmount("");
      setSource("");

      await loadData();
    } catch (err) {
      console.error("Add money error:", err);
      setError(err.message || "Unable to add money.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <SectionHeader
        eyebrow="FINANCE · POCKET MONEY"
        title="Keep an eye on what's coming in."
        description="Track allowance, gigs and any extra income alongside what you spend."
      />

      {error && (
        <div className="panel" style={{ marginBottom: "16px" }}>
          {error}
        </div>
      )}

      <div className="finance-layout">
        <section className="panel accent-panel finance-balance-card">
          <div className="panel-kicker">CURRENT BALANCE</div>

          <h3>₹{Number(analytics.current_balance).toLocaleString("en-IN")}</h3>

          <div className="finance-split">
            <div>
              <span>Income</span>
              <strong className="txn-amount in">
                +₹{Number(analytics.total_income).toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Spent</span>
              <strong className="txn-amount out">
                -₹{Number(analytics.total_spent).toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          <form className="finance-add-form" onSubmit={addFunds}>
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <select value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="">Select source</option>
              <option value="parents">Parents</option>
              <option value="scholarship">Scholarship</option>
              <option value="gift">Gift</option>
              <option value="part_time">Part Time</option>
              <option value="other">Other</option>
            </select>

            <button className="primary-button wide" type="submit" disabled={saving}>
              {saving ? "Adding..." : "+ Add money"}
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Recent activity</h3>
              <p>Every rupee in and out.</p>
            </div>

            <span>{txns.length} entries</span>
          </div>

          <div className="txn-list">
            {loading ? (
              <p>Loading...</p>
            ) : txns.length === 0 ? (
              <p>No pocket money added yet.</p>
            ) : (
              txns.map((t) => (
                <div className="txn-item" key={t.id}>
                  <div className={`txn-icon ${t.type}`}>
                    {t.type === "in" ? "↓" : "↑"}
                  </div>

                  <div className="txn-copy">
                    <strong>{t.title}</strong>
                    <small>{t.date}</small>
                  </div>

                  <div className={`txn-amount ${t.type}`}>
                    {t.type === "in" ? "+" : "-"}₹
                    {Math.abs(t.amount).toLocaleString("en-IN")}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}