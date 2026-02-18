import React, { useState, useEffect, useMemo } from "react";
import CreatableSelect from "react-select/creatable";
import {
  createPurchase,
  updatePurchase,
  createUser,
  createProduct,
  createShop,
  createCategory,
  getUsers,
  getProducts,
  getShops,
  getCategories,
} from "../services/api";

const UNIT_TYPES = ["unit", "kg", "g", "liter", "ml"];

const eurFmt = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

const EMPTY_ITEM = {
  selectedProduct: null,
  isNewProduct: false,
  newProductLabel: "",
  useNewCategory: false,
  selectedCategoryName: "",
  newCategoryName: "",
  productUnitType: "unit",
  quantity: "",
  unitPrice: "",
};

/* ── custom styles so react-select fits the existing form look ── */
const selectStyles = {
  control: (base) => ({
    ...base,
    minHeight: "38px",
    borderColor: "#ccc",
    boxShadow: "none",
    "&:hover": { borderColor: "#888" },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#f0f0f0" : "white",
    color: "#333",
  }),
};

function TransactionForm({ onSuccess, editingTransaction, setEditingTransaction }) {
  // ── Header-level state ──────────────────────────────────
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedUserId, setSelectedUserId] = useState("");
  const [useNewUser, setUseNewUser] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [selectedShopId, setSelectedShopId] = useState("");
  const [useNewShop, setUseNewShop] = useState(true);
  const [shopName, setShopName] = useState("");

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // ── Items-level state ───────────────────────────────────
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ── Fetch reference data ────────────────────────────────
  useEffect(() => {
    getUsers().then(setUsers).catch(() => {});
    getProducts().then(setProducts).catch(() => {});
    getShops().then(setShops).catch(() => {});
    getCategories().then(setCategories).catch(() => {});
  }, []);

  // ── Populate form when editing a transaction ────────────
  useEffect(() => {
    if (!editingTransaction) return;

    const tx = editingTransaction;

    // Set user (always existing)
    setUseNewUser(false);
    setSelectedUserId(String(tx.user_id));
    setUserName("");
    setUserEmail("");

    // Set shop (always existing)
    setUseNewShop(false);
    setSelectedShopId(String(tx.shop_id));
    setShopName("");

    // Set date
    const txDate = tx.date ? new Date(tx.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
    setDate(txDate);

    // Set items — map from purchase response items to form items
    if (tx.items && tx.items.length > 0) {
      setItems(
        tx.items.map((item) => {
          // Try to find matching product option
          const matchedProduct = products.find((p) => p.id === item.product_id);
          const option = matchedProduct
            ? {
                value: matchedProduct.id,
                label: matchedProduct.reference
                  ? `${matchedProduct.name} [${matchedProduct.reference}]`
                  : matchedProduct.name,
                product: matchedProduct,
              }
            : { value: item.product_id, label: `Product #${item.product_id}` };

          return {
            ...EMPTY_ITEM,
            selectedProduct: option,
            isNewProduct: false,
            quantity: String(item.quantity),
            unitPrice: String(item.unit_price),
          };
        })
      );
    }
  }, [editingTransaction, products]);

  // ── Build react-select options from products ────────────
  const productOptions = useMemo(
    () =>
      products.map((p) => ({
        value: p.id,
        label: p.reference ? `${p.name} [${p.reference}]` : p.name,
        product: p,
      })),
    [products]
  );

  // ── Item helpers ────────────────────────────────────────
  const updateItem = (index, patch) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  };

  const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }]);

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Real-time subtotal per item ─────────────────────────
  const itemSubtotals = useMemo(
    () =>
      items.map((item) => {
        const q = parseFloat(item.quantity) || 0;
        const p = parseFloat(item.unitPrice) || 0;
        return q * p;
      }),
    [items]
  );

  // ── Real-time total amount ──────────────────────────────
  const totalAmount = useMemo(
    () => itemSubtotals.reduce((sum, s) => sum + s, 0),
    [itemSubtotals]
  );

  // ── Pending new-category names across items ─────────────
  const pendingCategoryNames = useMemo(() => {
    const names = new Set();
    items.forEach((item) => {
      if (item.useNewCategory && item.newCategoryName.trim()) {
        names.add(item.newCategoryName.trim());
      }
    });
    return names;
  }, [items]);

  // ── Merged category options: DB + pending ───────────────
  const mergedCategories = useMemo(() => {
    const dbNames = new Set(categories.map((c) => c.name));
    const merged = [...categories];
    pendingCategoryNames.forEach((name) => {
      if (!dbNames.has(name)) {
        merged.push({ id: `pending-${name}`, name });
      }
    });
    return merged;
  }, [categories, pendingCategoryNames]);

  // ── Submit ──────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // ── Resolve User ────────────────────────────────
      let userId = selectedUserId;
      if (useNewUser) {
        const user = await createUser({
          name: userName,
          email: userEmail,
        });
        userId = user.id;
        setUsers((prev) => [...prev, user]);
      }

      // ── Resolve Shop ────────────────────────────────
      let shopId = selectedShopId;
      if (useNewShop) {
        const shop = await createShop({ name: shopName });
        shopId = shop.id;
        setShops((prev) => [...prev, shop]);
      }

      // ── Deduplicate new categories ──────────────────
      const categoryCache = {};
      for (const item of items) {
        if (!item.isNewProduct) continue;
        const rawName = item.useNewCategory
          ? item.newCategoryName.trim()
          : item.selectedCategoryName || "";
        if (!rawName) continue;
        const key = rawName.toLowerCase();
        if (!categoryCache[key]) {
          const cat = await createCategory({ name: rawName });
          categoryCache[key] = cat.name;
          setCategories((prev) =>
            prev.some((c) => c.id === cat.id) ? prev : [...prev, cat]
          );
        }
      }

      // ── Resolve each item's product ─────────────────
      const resolvedItems = [];
      for (const item of items) {
        let productId;

        if (item.isNewProduct) {
          const rawName = item.useNewCategory
            ? item.newCategoryName.trim()
            : item.selectedCategoryName || "";
          const categoryName = rawName
            ? categoryCache[rawName.toLowerCase()] || rawName
            : null;

          const product = await createProduct({
            name: item.newProductLabel,
            category: categoryName,
            unit_type: item.productUnitType || null,
          });
          productId = product.id;
          setProducts((prev) => [...prev, product]);
        } else if (item.selectedProduct) {
          productId = item.selectedProduct.value;
        } else {
          throw new Error("Please select or create a product for every item.");
        }

        resolvedItems.push({
          product_id: parseInt(productId, 10),
          quantity: parseFloat(item.quantity) || 0,
          price: parseFloat(item.unitPrice) || 0,
        });
      }

      // ── Create or Update Purchase ───────────────────────
      if (editingTransaction) {
        await updatePurchase(editingTransaction.id, {
          user_id: parseInt(userId, 10),
          shop_id: parseInt(shopId, 10),
          date: date,
          items: resolvedItems,
        });
        setMessage({ type: "success", text: "Transaction updated successfully!" });
      } else {
        await createPurchase({
          user_id: parseInt(userId, 10),
          shop_id: parseInt(shopId, 10),
          date: date,
          items: resolvedItems,
        });
        setMessage({ type: "success", text: "Transaction added successfully!" });
      }

      // Reset form
      setUserName("");
      setUserEmail("");
      setShopName("");
      setSelectedUserId("");
      setSelectedShopId("");
      setUseNewUser(true);
      setUseNewShop(true);
      setDate(new Date().toISOString().split("T")[0]);
      setItems([{ ...EMPTY_ITEM }]);
      if (editingTransaction && setEditingTransaction) {
        setEditingTransaction(null);
      }
      onSuccess();
    } catch (err) {
      const detail =
        err.response?.data?.detail || err.message || "Something went wrong";
      setMessage({ type: "error", text: detail });
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────
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
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="form-group">
            <label>User Email</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>
        </>
      )}

      {/* ── Shop (Select or Create) ───────────────────────── */}
      <div className="form-group">
        <label>Shop</label>
        <select
          value={useNewShop ? "__new__" : selectedShopId}
          onChange={(e) => {
            if (e.target.value === "__new__") {
              setUseNewShop(true);
              setSelectedShopId("");
            } else {
              setUseNewShop(false);
              setSelectedShopId(e.target.value);
            }
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
        <div className="form-group">
          <label>Shop Name</label>
          <input
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="Mercadona"
            required
          />
        </div>
      )}

      {/* ── Date ──────────────────────────────────────────── */}
      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {/* ── Items ─────────────────────────────────────────── */}
      <h4 style={{ marginTop: "1rem" }}>Products</h4>

      {items.map((item, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "0.75rem",
            marginBottom: "0.75rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <strong>Item {idx + 1}</strong>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span className="amount">
                Subtotal: {eurFmt.format(itemSubtotals[idx])}
              </span>
              {items.length > 1 && (
                <button
                  type="button"
                  className="btn"
                  style={{
                    color: "red",
                    padding: "0.2rem 0.5rem",
                    fontSize: "0.85rem",
                  }}
                  onClick={() => removeItem(idx)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* ── Product: Searchable CreatableSelect ──────── */}
          <div className="form-group">
            <label>Product</label>
            <CreatableSelect
              isClearable
              styles={selectStyles}
              options={productOptions}
              value={item.selectedProduct}
              placeholder="Search or type a new product..."
              formatCreateLabel={(input) => `+ Create "${input}"`}
              onChange={(option) => {
                if (!option) {
                  updateItem(idx, {
                    selectedProduct: null,
                    isNewProduct: false,
                    newProductLabel: "",
                    unitPrice: "",
                  });
                } else if (option.__isNew__) {
                  updateItem(idx, {
                    selectedProduct: option,
                    isNewProduct: true,
                    newProductLabel: option.label,
                    unitPrice: "",
                  });
                } else {
                  updateItem(idx, {
                    selectedProduct: option,
                    isNewProduct: false,
                    newProductLabel: "",
                    unitPrice: option.product?.unit_price
                      ? String(option.product.unit_price)
                      : item.unitPrice,
                  });
                }
              }}
            />
          </div>

          {/* ── New-product fields (only if creating) ───── */}
          {item.isNewProduct && (
            <>
              {/* Category (Select or Create) */}
              <div className="form-group">
                <label>Category</label>
                <select
                  value={
                    item.useNewCategory ? "__new__" : item.selectedCategoryName
                  }
                  onChange={(e) => {
                    if (e.target.value === "__new__") {
                      updateItem(idx, {
                        useNewCategory: true,
                        selectedCategoryName: "",
                      });
                    } else {
                      updateItem(idx, {
                        useNewCategory: false,
                        selectedCategoryName: e.target.value,
                      });
                    }
                  }}
                >
                  <option value="">— None —</option>
                  <option value="__new__">+ New Category</option>
                  {mergedCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {item.useNewCategory && (
                <div className="form-group">
                  <label>New Category Name</label>
                  <input
                    value={item.newCategoryName}
                    onChange={(e) =>
                      updateItem(idx, { newCategoryName: e.target.value })
                    }
                    placeholder="Groceries"
                    required
                  />
                </div>
              )}

              {/* Unit Type */}
              <div className="form-group">
                <label>Unit Type</label>
                <select
                  value={item.productUnitType}
                  onChange={(e) =>
                    updateItem(idx, { productUnitType: e.target.value })
                  }
                >
                  {UNIT_TYPES.map((ut) => (
                    <option key={ut} value={ut}>
                      {ut}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* ── Quantity & Price ─────────────────────────── */}
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              min="0.001"
              step="any"
              value={item.quantity}
              onChange={(e) => updateItem(idx, { quantity: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Unit Price (€)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={item.unitPrice}
              onChange={(e) => updateItem(idx, { unitPrice: e.target.value })}
              placeholder="4.99"
              required
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        className="btn"
        onClick={addItem}
        style={{ marginBottom: "1rem" }}
      >
        + Add Product
      </button>

      {/* ── Purchase Total ────────────────────────────────── */}
      <div
        style={{
          textAlign: "right",
          fontSize: "1.1rem",
          fontWeight: 700,
          marginBottom: "0.75rem",
          color: "var(--primary-dark)",
        }}
      >
        Total: {eurFmt.format(totalAmount)}
      </div>

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading
          ? "Saving..."
          : editingTransaction
          ? "Update Transaction"
          : "Add Transaction"}
      </button>

      {editingTransaction && (
        <button
          type="button"
          className="btn"
          style={{
            marginTop: "0.5rem",
            width: "100%",
            background: "#6c757d",
            color: "#fff",
            borderRadius: "8px",
          }}
          onClick={() => {
            setEditingTransaction(null);
            setUserName("");
            setUserEmail("");
            setShopName("");
            setSelectedUserId("");
            setSelectedShopId("");
            setUseNewUser(true);
            setUseNewShop(true);
            setDate(new Date().toISOString().split("T")[0]);
            setItems([{ ...EMPTY_ITEM }]);
            setMessage(null);
          }}
        >
          Cancel Edit
        </button>
      )}
    </form>
  );
}

export default TransactionForm;
