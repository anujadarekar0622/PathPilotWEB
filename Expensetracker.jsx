import { useEffect, useState } from "react";
import {
  IndianRupee,
  Target,
  TrendingUp,
  Receipt,
  Utensils,
  Bus,
  BookOpen,
  Gamepad2,
  ShoppingBag,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import ProgressBar from "../../components/ui/ProgressBar.jsx";

const API_URL = "http://127.0.0.1:8000/api/expenses/";

const categories = [
  { key: "food", label: "Food", icon: Utensils },
  { key: "travel", label: "Travel", icon: Bus },
  { key: "education", label: "Education", icon: BookOpen },
  { key: "shopping", label: "Shopping", icon: ShoppingBag },
  { key: "entertainment", label: "Entertainment", icon: Gamepad2 },
  { key: "other", label: "Other", icon: Receipt },
];

const monthlyBudget = 2500;

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "food",
    date: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("accessToken");

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();
      if (!token) {
        setError("You are not logged in. Please login again.");
        return;
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Your login session has expired. Please login again.");
          return;
        }
        throw new Error("Failed to load expenses.");
      }

      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = async (e) => {
    e.preventDefault();

    const amount = parseFloat(form.amount);

    if (!form.description.trim()) {
      setError("Please enter a description.");
      return;
    }

    if (!amount || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (!form.date) {
      setError("Please select a date.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token = getToken();
      if (!token) {
        setError("You are not logged in.");
        return;
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          category: form.category,
          description: form.description,
          date: form.date,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error(data);
        setError("Failed to add expense.");
        return;
      }

      // add newly created expense to ui
      setExpenses((prev) => [data, ...prev]);

      setForm({
        description: "",
        amount: "",
        category: "food",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      console.error(err);
      setError("Something went wrong while adding the expense.");
    } finally {
      setSaving(false);
    }
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  const byCategory = categories.map((category) => ({
    ...category,
    total: expenses
      .filter((expense) => expense.category === category.key)
      .reduce((sum, expense) => sum + Number(expense.amount), 0),
  }));

  const topCategory = byCategory.slice().sort((a, b) => b.total - a.total)[0];

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div>
      <SectionHeader
        eyebrow="FINANCE · EXPENSE TRACKER"
        title="See where it's actually going."
        description="Log spending by category and stay inside your monthly budget."
      />

      {error && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 16px",
            borderRadius: "10px",
            background: "#fff1f1",
            color: "#b42318",
          }}
        >
          {error}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <IndianRupee size={18} />
          </div>
          <div>
            <span>Spent this month</span>
            <strong>₹{totalSpent.toLocaleString("en-IN")}</strong>
            <small>of ₹{monthlyBudget.toLocaleString("en-IN")} budget</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Target size={18} />
          </div>
          <div>
            <span>Remaining</span>
            <strong>₹{Math.max(monthlyBudget - totalSpent, 0).toLocaleString("en-IN")}</strong>
            <small>left this month</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={18} />
          </div>
          <div>
            <span>Top category</span>
            <strong>{topCategory?.total > 0 ? topCategory.label : "None"}</strong>
            <small>highest spend</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Receipt size={18} />
          </div>
          <div>
            <span>Entries</span>
            <strong>{expenses.length}</strong>
            <small>logged so far</small>
          </div>
        </div>
      </div>

      <div className="expense-layout">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Budget usage</h3>
              <p>Monthly cap vs. what's spent by category.</p>
            </div>
          </div>

          <ProgressBar
            value={Math.min(100, Math.round((totalSpent / monthlyBudget) * 100))}
            label="Overall budget used"
          />

          <div className="expense-category-grid">
            {byCategory.map((category) => {
              const CategoryIcon = category.icon;

              return (
                <div className="expense-category" key={category.key}>
                  <div className="expense-category-top">
                    <span className="expense-category-label">
                      <CategoryIcon size={15} strokeWidth={1.8} />
                      {category.label}
                    </span>
                    <strong>₹{category.total.toLocaleString("en-IN")}</strong>
                  </div>

                  <div className="progress-track small">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.min(100, (category.total / monthlyBudget) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <form className="expense-form" onSubmit={addExpense}>
            <input
              placeholder="What did you spend on?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="₹ amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />

            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map((category) => (
                <option key={category.key} value={category.key}>
                  {category.label}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? "Saving..." : "+ Add expense"}
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Recent expenses</h3>
              <p>Latest first.</p>
            </div>
          </div>

          {loading ? (
            <p>Loading expenses...</p>
          ) : expenses.length === 0 ? (
            <p>No expenses recorded yet.</p>
          ) : (
            <div className="txn-list">
              {expenses.map((expense) => {
                const category = categories.find((c) => c.key === expense.category);
                const CategoryIcon = category?.icon || Receipt;

                return (
                  <div className="txn-item" key={expense.id}>
                    <div className="txn-icon out">
                      <CategoryIcon size={16} strokeWidth={1.8} />
                    </div>

                    <div className="txn-copy">
                      <strong>{expense.description || "Expense"}</strong>
                      <small>
                        {category?.label || expense.category} · {formatDate(expense.date)}
                      </small>
                    </div>

                    <div className="txn-amount out">
                      -₹{Number(expense.amount).toLocaleString("en-IN")}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}