import { useState, useEffect } from "react";
import {
  PlayCircle,
  Sparkles,
  FileText,
  Link2,
  Star,
  Trash2,
  ExternalLink,
  Search,
  Loader2,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";

const API_URL = "http://127.0.0.1:8000/api/ai/vault/";

const categories = [
  {
    key: "all",
    label: "All",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: PlayCircle,
  },
  {
    key: "ai-tool",
    label: "AI Tools",
    icon: Sparkles,
  },
  {
    key: "article",
    label: "Articles",
    icon: FileText,
  },
  {
    key: "other",
    label: "Other",
    icon: Link2,
  },
];

function faviconFor(url) {
  try {
    const host = new URL(url).hostname;

    return `https://www.google.com/s2/favicons?sz=64&domain=${host}`;
  } catch {
    return null;
  }
}

export default function KnowledgeVault() {
  const [items, setItems] = useState([]);

  const [activeCategory, setActiveCategory] = useState("all");

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    url: "",
    category: "youtube",
    tags: "",
    is_favorite: false,
  });

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");


  // ============================================================
  // GET TOKEN
  // ============================================================
  // NOTE: This now checks every common key name your login page
  // might be using, in both localStorage and sessionStorage.
  // Once you confirm the exact key your login code uses
  // (check DevTools -> Application -> Local Storage after logging in),
  // you can trim this back down to just that one key if you want.

  const getToken = () => {
    const possibleKeys = [
      "access",
      "access_token",
      "accessToken",
      "token",
      "authToken",
      "auth_token",
      "jwt",
      "idToken",
      "id_token",
    ];

    for (const key of possibleKeys) {
      const value = localStorage.getItem(key);
      if (value) return value;
    }

    // Fallback: check sessionStorage too, in case login stores it there
    for (const key of possibleKeys) {
      const value = sessionStorage.getItem(key);
      if (value) return value;
    }

    // Fallback: some apps store a JSON object like
    // localStorage.setItem("user", JSON.stringify({ access: "...", ... }))
    try {
      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        const user = JSON.parse(userRaw);
        if (user?.access) return user.access;
        if (user?.token) return user.token;
        if (user?.accessToken) return user.accessToken;
      }
    } catch {
      // ignore parse errors
    }

    return null;
  };


  // ============================================================
  // LOAD VAULT RESOURCES
  // ============================================================

  const loadItems = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Please login again. Authentication token not found.");
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
        const data = await response.json().catch(() => ({}));

        throw new Error(
          data.detail ||
            `Failed to load vault (${response.status})`
        );
      }

      const data = await response.json();

      setItems(data);

    } catch (err) {
      console.error("Knowledge Vault GET error:", err);
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // LOAD DATA WHEN PAGE OPENS
  // ============================================================

  useEffect(() => {
    loadItems();
  }, []);


  // ============================================================
  // ADD RESOURCE
  // ============================================================

  const addItem = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.url.trim()) {
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

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: form.title.trim(),
          url: form.url.trim(),
          category: form.category,
          tags: form.tags.trim(),
          is_favorite: form.is_favorite,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            Object.values(data)
              .flat()
              .join(", ") ||
            "Failed to save resource."
        );
      }

      // Add newly created resource at beginning
      setItems((prev) => [data, ...prev]);

      // Reset form
      setForm({
        title: "",
        url: "",
        category: "youtube",
        tags: "",
        is_favorite: false,
      });

      setShowForm(false);

    } catch (err) {
      console.error("Knowledge Vault POST error:", err);
      setError(err.message);

    } finally {
      setSaving(false);
    }
  };


  // ============================================================
  // TOGGLE FAVORITE
  // ============================================================

  const toggleFavorite = async (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = getToken();

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await fetch(
        `${API_URL}${item.id}/`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            is_favorite: !item.is_favorite,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to update favorite."
        );
      }

      setItems((prev) =>
        prev.map((resource) =>
          resource.id === item.id
            ? data
            : resource
        )
      );

    } catch (err) {
      console.error(
        "Favorite update error:",
        err
      );

      setError(err.message);
    }
  };


  // ============================================================
  // DELETE RESOURCE
  // ============================================================

  const deleteItem = async (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      `Delete "${item.title}" from your Knowledge Vault?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await fetch(
        `${API_URL}${item.id}/`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data =
          await response
            .json()
            .catch(() => ({}));

        throw new Error(
          data.detail ||
            "Failed to delete resource."
        );
      }

      setItems((prev) =>
        prev.filter(
          (resource) =>
            resource.id !== item.id
        )
      );

    } catch (err) {
      console.error(
        "Delete resource error:",
        err
      );

      setError(err.message);
    }
  };


  // ============================================================
  // FILTER ITEMS
  // ============================================================

  const filtered = items.filter((item) => {
    const matchesCategory =
      activeCategory === "all" ||
      item.category === activeCategory;

    const searchText =
      search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      item.title
        ?.toLowerCase()
        .includes(searchText) ||
      item.url
        ?.toLowerCase()
        .includes(searchText) ||
      item.tags
        ?.toLowerCase()
        .includes(searchText);

    return (
      matchesCategory &&
      matchesSearch
    );
  });


  // ============================================================
  // CATEGORY COUNT
  // ============================================================

  const getCategoryCount = (category) => {
    if (category === "all") {
      return items.length;
    }

    return items.filter(
      (item) =>
        item.category === category
    ).length;
  };


  // ============================================================
  // CATEGORY ICON
  // ============================================================

  const getCategoryIcon = (category) => {
    return (
      categories.find(
        (c) => c.key === category
      )?.icon || Link2
    );
  };


  // ============================================================
  // UI
  // ============================================================

  return (
    <div>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <SectionHeader
        eyebrow="SMART KNOWLEDGE VAULT"
        title="Every useful link, in one place."
        description="Save YouTube videos, AI tools and articles — organized by category so you can actually find them again."
        action={
          <button
            className="primary-button"
            onClick={() =>
              setShowForm((s) => !s)
            }
          >
            {showForm
              ? "Close"
              : "+ Save a link"}
          </button>
        }
      />


      {/* ======================================================
          ERROR MESSAGE
      ====================================================== */}

      {error && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 16px",
            borderRadius: "10px",
            background: "#fff1f0",
            border: "1px solid #ffccc7",
            color: "#cf1322",
          }}
        >
          {error}
        </div>
      )}


      {/* ======================================================
          ADD RESOURCE FORM
      ====================================================== */}

      {showForm && (
        <form
          className="vault-add-form panel"
          onSubmit={addItem}
        >

          <div className="form-grid">

            {/* TITLE */}

            <label>
              Title

              <input
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="e.g. Neural Networks from Scratch"
                required
              />
            </label>


            {/* URL */}

            <label>
              URL

              <input
                value={form.url}
                onChange={(e) =>
                  setForm({
                    ...form,
                    url: e.target.value,
                  })
                }
                placeholder="https://..."
                required
              />
            </label>


            {/* CATEGORY */}

            <label>
              Category

              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
              >

                {categories
                  .filter(
                    (c) => c.key !== "all"
                  )
                  .map((c) => (
                    <option
                      key={c.key}
                      value={c.key}
                    >
                      {c.label}
                    </option>
                  ))}

              </select>
            </label>


            {/* TAGS */}

            <label>
              Tags

              <input
                value={form.tags}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tags: e.target.value,
                  })
                }
                placeholder="python, AI, machine learning"
              />
            </label>

          </div>


          {/* FAVORITE */}

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >

            <input
              type="checkbox"
              checked={form.is_favorite}
              onChange={(e) =>
                setForm({
                  ...form,
                  is_favorite:
                    e.target.checked,
                })
              }
            />

            Add to favorites

          </label>


          {/* SAVE BUTTON */}

          <button
            className="primary-button"
            type="submit"
            disabled={saving}
          >

            {saving ? (
              <>
                <Loader2
                  size={16}
                  className="spin"
                />

                Saving...
              </>
            ) : (
              "Save to vault"
            )}

          </button>

        </form>
      )}


      {/* ======================================================
          SEARCH
      ====================================================== */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          margin: "20px 0",
        }}
      >

        <Search size={18} />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search your saved resources..."
          style={{
            width: "100%",
            padding: "10px 12px",
          }}
        />

      </div>


      {/* ======================================================
          CATEGORY TABS
      ====================================================== */}

      <div className="vault-tabs">

        {categories.map((c) => {

          const CategoryIcon = c.icon;

          return (
            <button
              key={c.key}
              className={
                activeCategory === c.key
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveCategory(c.key)
              }
            >

              {CategoryIcon && (
                <CategoryIcon
                  size={14}
                  strokeWidth={1.8}
                />
              )}

              {c.label}

              <span>
                {" "}
                {getCategoryCount(c.key)}
              </span>

            </button>
          );
        })}

      </div>


      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading ? (

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "50px",
          }}
        >

          <Loader2
            size={28}
            className="spin"
          />

        </div>

      ) : (

        <div className="vault-grid">

          {filtered.map((item) => {

            const favicon =
              faviconFor(item.url);

            const CategoryIcon =
              getCategoryIcon(
                item.category
              );

            return (

              <div
                className="vault-card"
                key={item.id}
              >

                {/* ICON */}

                <div className="vault-card-icon">

                  {favicon ? (

                    <img
                      src={favicon}
                      alt=""
                    />

                  ) : (

                    <CategoryIcon
                      size={20}
                      strokeWidth={1.8}
                    />

                  )}

                </div>


                {/* BODY */}

                <div className="vault-card-body">

                  <strong>
                    {item.title}
                  </strong>


                  {/* TAGS */}

                  {item.tags && (
                    <p>
                      {item.tags}
                    </p>
                  )}


                  {/* CATEGORY */}

                  <span className="tag">

                    {
                      categories.find(
                        (c) =>
                          c.key ===
                          item.category
                      )?.label ||
                        item.category
                    }

                  </span>


                  {/* ACTIONS */}

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "12px",
                    }}
                  >

                    {/* OPEN */}

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                      title="Open resource"
                    >
                      <ExternalLink
                        size={16}
                      />
                    </a>


                    {/* FAVORITE */}

                    <button
                      onClick={(e) =>
                        toggleFavorite(
                          e,
                          item
                        )
                      }
                      title={
                        item.is_favorite
                          ? "Remove favorite"
                          : "Add favorite"
                      }
                      style={{
                        border: "none",
                        background:
                          "transparent",
                        cursor:
                          "pointer",
                      }}
                    >

                      <Star
                        size={17}
                        fill={
                          item.is_favorite
                            ? "currentColor"
                            : "none"
                        }
                      />

                    </button>


                    {/* DELETE */}

                    <button
                      onClick={(e) =>
                        deleteItem(
                          e,
                          item
                        )
                      }
                      title="Delete resource"
                      style={{
                        border: "none",
                        background:
                          "transparent",
                        cursor:
                          "pointer",
                      }}
                    >

                      <Trash2
                        size={17}
                      />

                    </button>

                  </div>

                </div>

              </div>

            );
          })}


          {/* EMPTY STATE */}

          {filtered.length === 0 && (
            <p className="vault-empty">

              {items.length === 0
                ? "Your Knowledge Vault is empty. Save your first resource!"
                : "Nothing found for this search or category."}

            </p>
          )}

        </div>

      )}

    </div>
  );
}