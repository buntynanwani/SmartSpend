import React, { useState, useEffect, useMemo } from "react";
import {
  createPurchase,
  updatePurchase,
  createUser,
  createProduct,
  createShop,
  getUsers,
  getProducts,
  getShops,
} from "../services/api";

/** Format a number as euros */
const euro = (value) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(
    Number(value)
  );

const UNIT_OPTIONS = [
  { value: "unit", label: "Unit" },
  { value: "g", label: "Gram (g)" },
  { value: "kg", label: "Kilogram (kg)" },
  { value: "l", label: "Litre (l)" },
  { value: "ml", label: "Millilitre (ml)" },
];

const EMPTY_ITEM = {
  productId: "",
  useNewProduct: true,
  productName: "",
  productCategory: "",
  useNewCategory: true,
  quantity: 1,
  unitType: "unit",
  price: "",
};

function TransactionForm({ onSuccess, editData, onCancelEdit }) {
  // ── Reference data ─────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);

  // ── User state ─────────────────────────────────────────────
  const [selectedUserId, setSelectedUserId] = useState("");
  const [useNewUser, setUseNewUser] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // ── Shop state ─────────────────────────────────────────────
  const [selectedShopId, setSelectedShopId] = useState("");
  const [useNewShop, setUseNewShop] = useState(true);
  const [shopName, setShopName] = useState("");

  // ── Date ───────────────────────────────────────────────────
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // ── Items (multi-product) ─────────────────────────────────
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);

  // ── UI ─────────────────────────────────────────────────────
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ── Unique categories derived from products ────────────────
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return [...set].sort();
  }, [products]);

  // ── Fetch reference data on mount ─────────────────────────
  useEffect(() => {
    getUsers().then(setUsers).catch(() => {});
    getProducts().then(setProducts).catch(() => {});
    getShops().then(setShops).catch(() => {});
  }, []);

  // ── Populate form when editing ─────────────────────────────
  useEffect(() => {
    if (!editData) return;

    setUseNewUser(false);
    setSelectedUserId(String(editData.user_id));

    setUseNewShop(false);
    setSelectedShopId(String(editData.shop_id));

    const isoDate = editData.date
      ? new Date(editData.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    setDate(isoDate);

    const editItems = editData.items.map((it) => ({
      productId: String(it.product_id),
      useNewProduct: false,
      productName: "",
      productCategory: "",
      useNewCategory: true,
      quantity: it.quantity,
      unitType: "unit",
      price: it.unit_price,
    }));
    setItems(editItems.length ? editItems : [{ ...EMPTY_ITEM }]);
  }, [editData]);

  // ── Item helpers ───────────────────────────────────────────
  const updateItem = (index, field, value) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }]);

  const removeItem = (index) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  // ── Get unit label for an existing product ─────────────────
  const getProductUnit = (productId) => {
    const p = products.find((pr) => String(pr.id) === String(productId));
    if (!p || !p.unit_type) return null;
    const opt = UNIT_OPTIONS.find((o) => o.value === p.unit_type);
    return opt ? opt.label : p.unit_type;
  };

  // ── Total preview ──────────────────────────────────────────
  const totalPreview = items.reduce((sum, it) => {
    const q = parseFloat(it.quantity) || 0;
    const p = parseFloat(it.price) || 0;
    return sum + q * p;
  }, 0);

  // ── Reset ──────────────────────────────────────────────────
  const resetForm = () => {
    setSelectedUserId("");
    setUseNewUser(true);
    setUserName("");
    setUserEmail("");
    setSelectedShopId("");
    setUseNewShop(true);
    setShopName("");
    setDate(new Date().toISOString().split("T")[0]);
    setItems([{ ...EMPTY_ITEM }]);
    setMessage(null);
  };

  // ── Submit ─────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Resolve user
      let userId = selectedUserId;
      if (useNewUser) {
        const user = await createUser({ name: userName, email: userEmail });
        userId = user.id;
        setUsers((prev) => [...prev, user]);
      }

      // Resolve shop
      let shopId = selectedShopId;
      if (useNewShop) {
        const shop = await createShop({ name: shopName });
        shopId = shop.id;
        setShops((prev) => [...prev, shop]);
      }

      // Resolve each item's product
      const resolvedItems = [];
      for (const item of items) {
        let productId = item.productId;
        if (item.useNewProduct) {
          const category = item.useNewCategory
            ? item.productCategory || null
            : item.productCategory || null;
          const product = await createProduct({
            name: item.productName,
            category,
            unit_type: item.unitType || "unit",
          });
          productId = product.id;
          setProducts((prev) => [...prev, product]);
        }
        resolvedItems.push({
          product_id: Number(productId),
          quantity: parseFloat(item.quantity),
          price: parseFloat(item.price),
        });
      }

      if (!userId || !shopId) throw new Error("Missing user or shop.");

      const payload = {
        user_id: Number(userId),
        shop_id: Number(shopId),
        date,
        items: resolvedItems,
      };

      if (editData) {
        await updatePurchase(editData.id, payload);
      } else {
        await createPurchase(payload);
      }

      setMessage({ type: "success", text: "Purchase saved successfully!" });
      resetForm();
      if (onSuccess) onSuccess();
    } catch (err) {
      const detail =
        err.response?.data?.detail || err.message || "Error saving purchase";
      setMessage({
        type: "error",
        text: typeof detail === "string" ? detail : JSON.stringify(detail),
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      {message && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      {/* ──── User ──── */}
      <div className="form-group">
        <label>User</label>
        <select
          value={useNewUser ? "__new__" : selectedUserId}
          onChange={(e) => {
            const val = e.target.value;
            setUseNewUser(val === "__new__");
            setSelectedUserId(val === "__new__" ? "" : val);
          }}
        >
          <option value="__new__">+ New User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      {useNewUser && (
        <div className="nested-fields">
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Name"
            required
          />
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
      )}

      {/* ──── Shop ──── */}
      <div className="form-group">
        <label>Shop</label>
        <select
          value={useNewShop ? "__new__" : selectedShopId}
          onChange={(e) => {
            const val = e.target.value;
            setUseNewShop(val === "__new__");
            setSelectedShopId(val === "__new__" ? "" : val);
          }}
        >
          <option value="__new__">+ New Shop</option>
          {shops.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {useNewShop && (
        <div className="nested-fields">
          <input
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="Shop Name"
            required
          />
        </div>
      )}

      {/* ──── Date ──── */}
      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {/* ──── Items ──── */}
      <div className="form-group">
        <label>Products</label>
      </div>

      {items.map((item, idx) => (
        <div key={idx} className="item-card">
          <div className="item-card-header">
            <span className="item-card-title">Item {idx + 1}</span>
            {items.length > 1 && (
              <button
                type="button"
                className="btn btn-remove"
                onClick={() => removeItem(idx)}
              >
                ✕ Remove
              </button>
            )}
          </div>

          {/* Product selector */}
          <div className="form-group">
            <label>Product</label>
            <select
              value={item.useNewProduct ? "__new__" : item.productId}
              onChange={(e) => {
                const val = e.target.value;
                updateItem(idx, "useNewProduct", val === "__new__");
                updateItem(idx, "productId", val === "__new__" ? "" : val);
              }}
            >
              <option value="__new__">+ New Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                  {p.unit_type ? ` (${p.unit_type})` : ""}
                </option>
              ))}
            </select>
          </div>

          {item.useNewProduct && (
            <>
              <div className="nested-fields">
                <input
                  value={item.productName}
                  onChange={(e) =>
                    updateItem(idx, "productName", e.target.value)
                  }
                  placeholder="Product Name"
                  required
                />
              </div>

              {/* Smart Category — select or create */}
              <div className="form-group">
                <label>Category</label>
                <select
                  value={item.useNewCategory ? "__new__" : item.productCategory}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "__new__") {
                      updateItem(idx, "useNewCategory", true);
                      updateItem(idx, "productCategory", "");
                    } else {
                      updateItem(idx, "useNewCategory", false);
                      updateItem(idx, "productCategory", val);
                    }
                  }}
                >
                  <option value="__new__">+ New Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {item.useNewCategory && (
                <div className="nested-fields">
                  <input
                    value={item.productCategory}
                    onChange={(e) =>
                      updateItem(idx, "productCategory", e.target.value)
                    }
                    placeholder="New category name"
                  />
                </div>
              )}
            </>
          )}

          {/* Quantity / Unit type / Price */}
          <div className="form-row form-row-three">
            <div className="form-group">
              <label>
                Quantity
                {!item.useNewProduct && item.productId && (
                  <span className="unit-badge">
                    {getProductUnit(item.productId)}
                  </span>
                )}
              </label>
              <input
                type="number"
                min="0.001"
                step="0.001"
                value={item.quantity}
                onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Unit</label>
              <select
                value={item.unitType}
                onChange={(e) => updateItem(idx, "unitType", e.target.value)}
              >
                {UNIT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Price (€)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={item.price}
                onChange={(e) => updateItem(idx, "price", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Per-item subtotal */}
          {item.quantity && item.price && (
            <p className="item-subtotal">
              Subtotal:{" "}
              {euro(parseFloat(item.quantity) * parseFloat(item.price))}
            </p>
          )}
        </div>
      ))}

      <button type="button" className="btn btn-secondary" onClick={addItem}>
        + Add Product
      </button>

      {/* ──── Total preview ──── */}
      {totalPreview > 0 && (
        <div className="total-preview">
          <span>Estimated Total</span>
          <strong>{euro(totalPreview)}</strong>
        </div>
      )}

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading
            ? "Processing…"
            : editData
            ? "Update Purchase"
            : "Save Purchase"}
        </button>
        {editData && (
          <button
            type="button"
            className="btn btn-cancel"
            onClick={() => {
              resetForm();
              if (onCancelEdit) onCancelEdit();
            }}
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}

export default TransactionForm;
