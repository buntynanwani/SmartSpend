import React, { useState, useEffect, useCallback, useMemo } from "react";
import CreatableSelect from "react-select/creatable";
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getShops,
  createShop,
  deleteShop,
  updateShop,
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  getPurchases,
  deletePurchase,
} from "../services/api";
import TransactionList from "./TransactionList";
import "./DashboardManager.css";

/* ══════════════════════════════════════════════════════════
   Reusable sub-components
   ══════════════════════════════════════════════════════════ */

function DataCard({ icon, title, subtitle, onClick }) {
  return (
    <div className="data-card" onClick={onClick} role="button" tabIndex={0}>
      <span className="data-card-icon">{icon}</span>
      <div className="data-card-title">{title}</div>
      <div className="data-card-subtitle">{subtitle}</div>
    </div>
  );
}

function PanelHeader({ title, onBack, onAdd, addLabel = "+ Add New" }) {
  return (
    <div className="panel-header">
      <div className="panel-header-left">
        <button className="btn-back" onClick={onBack}>
          ← Go Back
        </button>
        <span className="panel-title">{title}</span>
      </div>
      {onAdd && (
        <button className="btn-add" onClick={onAdd}>
          {addLabel}
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Panel: Users
   ══════════════════════════════════════════════════════════ */

function UsersPanel({ onBack }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });

  const load = useCallback(() => {
    setLoading(true);
    getUsers()
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const resetForm = () => {
    setForm({ name: "", email: "" });
    setShowAdd(false);
    setEditId(null);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    try {
      if (editId) {
        await updateUser(editId, form);
      } else {
        await createUser(form);
      }
      resetForm();
      load();
    } catch (err) {
      alert(err.response?.data?.detail || "Operation failed");
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setForm({ name: user.name, email: user.email });
    setShowAdd(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      load();
    } catch (err) {
      alert(err.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div className="panel">
      <PanelHeader
        title="Users Management"
        onBack={onBack}
        onAdd={() => {
          resetForm();
          setShowAdd(true);
        }}
        addLabel="+ Add User"
      />
      <div className="panel-body">
        {showAdd && (
          <div className="inline-form">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <button className="btn-save" onClick={handleSave}>
              {editId ? "Update" : "Save"}
            </button>
            <button className="btn-cancel" onClick={resetForm}>
              Cancel
            </button>
          </div>
        )}

        {loading ? (
          <p className="panel-loading">Loading users…</p>
        ) : users.length === 0 ? (
          <p className="panel-empty">No users found.</p>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button className="btn-edit" onClick={() => handleEdit(u)}>
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Panel: Shops
   ══════════════════════════════════════════════════════════ */

function ShopsPanel({ onBack }) {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "" });

  const load = useCallback(() => {
    setLoading(true);
    getShops()
      .then(setShops)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const resetForm = () => {
    setForm({ name: "" });
    setShowAdd(false);
    setEditId(null);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    try {
      if (editId) {
        await updateShop(editId, form);
      } else {
        await createShop(form);
      }
      resetForm();
      load();
    } catch (err) {
      alert(err.response?.data?.detail || "Operation failed");
    }
  };

  const handleEdit = (shop) => {
    setEditId(shop.id);
    setForm({ name: shop.name });
    setShowAdd(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this shop?")) return;
    try {
      await deleteShop(id);
      load();
    } catch (err) {
      alert(err.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div className="panel">
      <PanelHeader
        title="Shops Management"
        onBack={onBack}
        onAdd={() => {
          resetForm();
          setShowAdd(true);
        }}
        addLabel="+ Add Shop"
      />
      <div className="panel-body">
        {showAdd && (
          <div className="inline-form">
            <input
              placeholder="Shop name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <button className="btn-save" onClick={handleSave}>
              {editId ? "Update" : "Save"}
            </button>
            <button className="btn-cancel" onClick={resetForm}>
              Cancel
            </button>
          </div>
        )}

        {loading ? (
          <p className="panel-loading">Loading shops…</p>
        ) : shops.length === 0 ? (
          <p className="panel-empty">No shops found.</p>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shops.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{new Date(s.created_at).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button className="btn-edit" onClick={() => handleEdit(s)}>
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(s.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Panel: Transactions
   ══════════════════════════════════════════════════════════ */

function TransactionsPanel({ onBack, refreshKey, onRefresh, setEditingTransaction }) {
  return (
    <div className="panel">
      <PanelHeader title="Transactions" onBack={onBack} />
      <div className="panel-body">
        <TransactionList
          refreshKey={refreshKey}
          onRefresh={onRefresh}
          setEditingTransaction={setEditingTransaction}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Panel: Products Hub  (Nested Grid → drill-down panels)
   ══════════════════════════════════════════════════════════ */

/* ── Products Secondary Grid Menu ─────────────────────────── */

function ProductsGridMenu({ onBack, onNavigate }) {
  return (
    <div className="panel">
      <PanelHeader title="Edit Products" onBack={onBack} />
      <div className="panel-body">
        <div className="dashboard-grid">
          <DataCard
            icon="📋"
            title="All Products"
            subtitle="Browse & manage products"
            onClick={() => onNavigate("manage_products")}
          />
          <DataCard
            icon="🏷️"
            title="Categories"
            subtitle="Manage product categories"
            onClick={() => onNavigate("manage_categories")}
          />
          <DataCard
            icon="🔖"
            title="Brands"
            subtitle="Manage product brands"
            onClick={() => onNavigate("manage_brands")}
          />
        </div>
      </div>
    </div>
  );
}

/* ── CreatableSelect styles (matches form look) ───────────── */

const creatableStyles = {
  control: (base) => ({
    ...base,
    minHeight: "36px",
    borderColor: "var(--border)",
    boxShadow: "none",
    flex: 1,
    minWidth: "160px",
    "&:hover": { borderColor: "#888" },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#f0f0f0" : "white",
    color: "#333",
  }),
};

/* ── Products Management Panel ────────────────────────────── */

function ProductsManagePanel({ onBack }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    name: "",
    reference: "",
    category_id: null,
    unit_type: "unit",
  });
  const [selectedCategory, setSelectedCategory] = useState(null);

  const loadProducts = useCallback(() => {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadCategories = useCallback(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  // Build react-select options from categories
  const categoryOptions = useMemo(
    () =>
      categories.map((c) => ({
        value: c.id,
        label: c.name,
      })),
    [categories]
  );

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.reference && p.reference.toLowerCase().includes(q))
    );
  }, [products, searchQuery]);

  const resetForm = () => {
    setForm({ name: "", reference: "", category_id: null, unit_type: "unit" });
    setSelectedCategory(null);
    setShowAdd(false);
    setEditId(null);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    try {
      // If the user typed a new category, create it first
      let categoryId = form.category_id;
      if (
        selectedCategory &&
        selectedCategory.__isNew__ &&
        selectedCategory.label.trim()
      ) {
        const newCat = await createCategory({ name: selectedCategory.label.trim() });
        categoryId = newCat.id;
        loadCategories(); // refresh the list
      }

      const payload = { ...form, category_id: categoryId, brand_id: null };

      if (editId) {
        await updateProduct(editId, payload);
      } else {
        await createProduct(payload);
      }
      resetForm();
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.detail || "Operation failed");
    }
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      reference: p.reference || "",
      category_id: p.category_id || null,
      unit_type: p.unit_type || "unit",
    });
    const matchedCat = categories.find((c) => c.id === p.category_id);
    setSelectedCategory(
      matchedCat ? { value: matchedCat.id, label: matchedCat.name } : null
    );
    setShowAdd(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div className="panel">
      <PanelHeader
        title="All Products"
        onBack={onBack}
        onAdd={() => {
          resetForm();
          setShowAdd(true);
        }}
        addLabel="+ Add Product"
      />
      <div className="panel-body">
        {/* Search bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or reference…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {showAdd && (
          <div className="inline-form">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Reference"
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
            />
            <CreatableSelect
              isClearable
              styles={creatableStyles}
              options={categoryOptions}
              value={selectedCategory}
              placeholder="Category…"
              formatCreateLabel={(input) => `+ Create "${input}"`}
              onChange={(option) => {
                setSelectedCategory(option);
                setForm({
                  ...form,
                  category_id: option && !option.__isNew__ ? option.value : null,
                });
              }}
            />
            <select
              value={form.unit_type}
              onChange={(e) => setForm({ ...form, unit_type: e.target.value })}
            >
              {["unit", "kg", "g", "liter", "ml", "bill", "session", "minute", "hour"].map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <button className="btn-save" onClick={handleSave}>
              {editId ? "Update" : "Save"}
            </button>
            <button className="btn-cancel" onClick={resetForm}>
              Cancel
            </button>
          </div>
        )}

        {loading ? (
          <p className="panel-loading">Loading products…</p>
        ) : filteredProducts.length === 0 ? (
          <p className="panel-empty">
            {searchQuery.trim()
              ? "No products match your search."
              : "No products found."}
          </p>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Reference</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Unit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.reference || "—"}</td>
                    <td>{p.name}</td>
                    <td>
                      {(categories.find((c) => c.id === p.category_id) || {})
                        .name || "—"}
                    </td>
                    <td>{p.unit_type}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Categories Management Panel ──────────────────────────── */

function CategoriesManagePanel({ onBack }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "" });

  const load = useCallback(() => {
    setLoading(true);
    getCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const resetForm = () => {
    setForm({ name: "" });
    setShowAdd(false);
    setEditId(null);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    try {
      if (editId) {
        await updateCategory(editId, form);
      } else {
        await createCategory(form);
      }
      resetForm();
      load();
    } catch (err) {
      alert(err.response?.data?.detail || "Operation failed");
    }
  };

  const handleEdit = (c) => {
    setEditId(c.id);
    setForm({ name: c.name });
    setShowAdd(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      load();
    } catch (err) {
      alert(err.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div className="panel">
      <PanelHeader
        title="Categories Management"
        onBack={onBack}
        onAdd={() => {
          resetForm();
          setShowAdd(true);
        }}
        addLabel="+ Add Category"
      />
      <div className="panel-body">
        {showAdd && (
          <div className="inline-form">
            <input
              placeholder="Category name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <button className="btn-save" onClick={handleSave}>
              {editId ? "Update" : "Save"}
            </button>
            <button className="btn-cancel" onClick={resetForm}>
              Cancel
            </button>
          </div>
        )}

        {loading ? (
          <p className="panel-loading">Loading categories…</p>
        ) : categories.length === 0 ? (
          <p className="panel-empty">No categories found.</p>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(c.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Brands Panel (placeholder) ───────────────────────────── */

function BrandsManagePanel({ onBack }) {
  return (
    <div className="panel">
      <PanelHeader title="Brands" onBack={onBack} />
      <div className="panel-body">
        <div className="panel-empty">
          <p>🚧 Brands management is coming soon.</p>
          <p style={{ fontSize: "0.82rem", marginTop: "0.5rem" }}>
            Products now support a <strong>brand_id</strong> foreign key.
            Full CRUD for brands will be available in a future update.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   DashboardManager — main export
   ══════════════════════════════════════════════════════════ */

function DashboardManager({ refreshKey, onRefresh, setEditingTransaction }) {
  const [currentView, setCurrentView] = useState("grid");

  const goGrid = () => setCurrentView("grid");

  /* ── Grid View ─────────────────────────────────────────── */
  if (currentView === "grid") {
    return (
      <div className="dashboard-grid">
        <DataCard
          icon="👥"
          title="Users"
          subtitle="Manage user accounts"
          onClick={() => setCurrentView("users")}
        />
        <DataCard
          icon="🏪"
          title="Shops"
          subtitle="Manage shop locations"
          onClick={() => setCurrentView("shops")}
        />
        <DataCard
          icon="💳"
          title="Transactions"
          subtitle="Browse all purchases"
          onClick={() => setCurrentView("transactions")}
        />
        <DataCard
          icon="📦"
          title="Edit Products"
          subtitle="Products, categories & brands"
          onClick={() => setCurrentView("products")}
        />
      </div>
    );
  }

  /* ── Drill-down panels ─────────────────────────────────── */
  if (currentView === "users") return <UsersPanel onBack={goGrid} />;
  if (currentView === "shops") return <ShopsPanel onBack={goGrid} />;
  if (currentView === "transactions")
    return (
      <TransactionsPanel
        onBack={goGrid}
        refreshKey={refreshKey}
        onRefresh={onRefresh}
        setEditingTransaction={setEditingTransaction}
      />
    );
  if (currentView === "products")
    return (
      <ProductsGridMenu
        onBack={goGrid}
        onNavigate={(view) => setCurrentView(view)}
      />
    );
  if (currentView === "manage_products")
    return (
      <ProductsManagePanel onBack={() => setCurrentView("products")} />
    );
  if (currentView === "manage_categories")
    return (
      <CategoriesManagePanel onBack={() => setCurrentView("products")} />
    );
  if (currentView === "manage_brands")
    return (
      <BrandsManagePanel onBack={() => setCurrentView("products")} />
    );

  return null;
}

export default DashboardManager;
