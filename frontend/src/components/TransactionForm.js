import React, { useState, useEffect } from "react";
import {
  createTransaction,
  createUser,
  createProduct,
  getUsers,
  getProducts,
} from "../services/api";

const INITIAL_FORM = {
  userName: "",
  userEmail: "",
  productName: "",
  productCategory: "",
  shop: "",
  date: new Date().toISOString().split("T")[0],
  quantity: 1,
  unitPrice: "",
};

function TransactionForm({ onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [useNewUser, setUseNewUser] = useState(true);
  const [useNewProduct, setUseNewProduct] = useState(true);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch existing users & products
  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => {});
    getProducts()
      .then(setProducts)
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Resolve user
      let userId = selectedUserId;
      if (useNewUser) {
        const user = await createUser({
          name: form.userName,
          email: form.userEmail,
        });
        userId = user.id;
        setUsers((prev) => [...prev, user]);
      }

      // Resolve product
      let productId = selectedProductId;
      if (useNewProduct) {
        const product = await createProduct({
          name: form.productName,
          category: form.productCategory || null,
        });
        productId = product.id;
        setProducts((prev) => [...prev, product]);
      }

      // Create transaction
      await createTransaction({
        user_id: Number(userId),
        product_id: Number(productId),
        shop: form.shop,
        date: form.date,
        quantity: Number(form.quantity),
        unit_price: Number(form.unitPrice),
      });

      setMessage({ type: "success", text: "Transaction added successfully!" });
      setForm(INITIAL_FORM);
      setSelectedUserId("");
      setSelectedProductId("");
      onSuccess();
    } catch (err) {
      const detail =
        err.response?.data?.detail || err.message || "Something went wrong";
      setMessage({ type: "error", text: detail });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      {/* ── User ──────────────────────────────────────────── */}
      <div className="form-group">
        <label>User</label>
        <select
          value={useNewUser ? "__new__" : selectedUserId}
          onChange={(e) => {
            if (e.target.value === "__new__") {
              setUseNewUser(true);
              setSelectedUserId("");
            } else {
              setUseNewUser(false);
              setSelectedUserId(e.target.value);
            }
          }}
        >
          <option value="__new__">+ New User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      </div>

      {useNewUser && (
        <>
          <div className="form-group">
            <label>User Name</label>
            <input
              name="userName"
              value={form.userName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="form-group">
            <label>User Email</label>
            <input
              name="userEmail"
              type="email"
              value={form.userEmail}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>
        </>
      )}

      {/* ── Product ───────────────────────────────────────── */}
      <div className="form-group">
        <label>Product</label>
        <select
          value={useNewProduct ? "__new__" : selectedProductId}
          onChange={(e) => {
            if (e.target.value === "__new__") {
              setUseNewProduct(true);
              setSelectedProductId("");
            } else {
              setUseNewProduct(false);
              setSelectedProductId(e.target.value);
            }
          }}
        >
          <option value="__new__">+ New Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {useNewProduct && (
        <>
          <div className="form-group">
            <label>Product Name</label>
            <input
              name="productName"
              value={form.productName}
              onChange={handleChange}
              placeholder="Milk"
              required
            />
          </div>
          <div className="form-group">
            <label>Category (optional)</label>
            <input
              name="productCategory"
              value={form.productCategory}
              onChange={handleChange}
              placeholder="Groceries"
            />
          </div>
        </>
      )}

      {/* ── Transaction Details ───────────────────────────── */}
      <div className="form-group">
        <label>Shop</label>
        <input
          name="shop"
          value={form.shop}
          onChange={handleChange}
          placeholder="Walmart"
          required
        />
      </div>

      <div className="form-group">
        <label>Date</label>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Quantity</label>
        <input
          name="quantity"
          type="number"
          min="1"
          value={form.quantity}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Unit Price ($)</label>
        <input
          name="unitPrice"
          type="number"
          step="0.01"
          min="0.01"
          value={form.unitPrice}
          onChange={handleChange}
          placeholder="4.99"
          required
        />
      </div>

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add Transaction"}
      </button>
    </form>
  );
}

export default TransactionForm;
