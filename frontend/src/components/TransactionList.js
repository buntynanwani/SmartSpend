import React, { useState, useEffect } from "react";
import {
  getPurchases,
  getUsers,
  getProducts,
  getShops,
  deletePurchase,
} from "../services/api";

/** Format a number as euros */
const euro = (value) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(
    Number(value)
  );

/** Format ISO date string as DD/MM/YYYY */
const formatDate = (iso) => {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

function TransactionList({ refreshKey, onEdit }) {
  const [purchases, setPurchases] = useState([]);
  const [users, setUsers] = useState({});
  const [products, setProducts] = useState({});
  const [shops, setShops] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([getPurchases(), getUsers(), getProducts(), getShops()])
      .then(([purchaseData, userData, productData, shopData]) => {
        setPurchases(purchaseData);

        const uMap = {};
        userData.forEach((u) => (uMap[u.id] = u.name));
        setUsers(uMap);

        const pMap = {};
        productData.forEach((p) => (pMap[p.id] = p.name));
        setProducts(pMap);

        const sMap = {};
        shopData.forEach((s) => (sMap[s.id] = s.name));
        setShops(sMap);
      })
      .catch((err) => console.error("Failed to fetch data:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, [refreshKey]);

  // ── Delete handler ─────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this purchase?"))
      return;

    setDeleting(id);
    try {
      await deletePurchase(id);
      setPurchases((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete purchase.");
    } finally {
      setDeleting(null);
    }
  };

  // ── Grand total ────────────────────────────────────────────
  const grandTotal = purchases.reduce(
    (sum, p) => sum + Number(p.total_amount),
    0
  );

  if (loading) {
    return <p className="no-data">Loading purchases…</p>;
  }

  if (purchases.length === 0) {
    return <p className="no-data">No purchases yet. Add one to get started!</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>User</th>
            <th>Shop</th>
            <th>Items</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase, idx) => (
            <tr key={purchase.id}>
              <td>{idx + 1}</td>
              <td>{formatDate(purchase.date)}</td>
              <td>{users[purchase.user_id] || `#${purchase.user_id}`}</td>
              <td>{shops[purchase.shop_id] || `#${purchase.shop_id}`}</td>

              <td className="items-cell">
                {purchase.items.map((item) => (
                  <div key={item.id} className="item-row">
                    <span className="item-name">
                      {products[item.product_id] ||
                        `Product #${item.product_id}`}
                    </span>
                    <span className="item-detail">
                      {item.quantity} × {euro(item.unit_price)} ={" "}
                      <strong>{euro(item.subtotal)}</strong>
                    </span>
                  </div>
                ))}
              </td>

              <td className="amount">{euro(purchase.total_amount)}</td>

              <td className="actions-cell">
                <button
                  className="btn btn-action btn-edit"
                  title="Edit"
                  onClick={() => onEdit && onEdit(purchase)}
                >
                  ✎
                </button>
                <button
                  className="btn btn-action btn-delete"
                  title="Delete"
                  disabled={deleting === purchase.id}
                  onClick={() => handleDelete(purchase.id)}
                >
                  {deleting === purchase.id ? "…" : "🗑"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr className="grand-total-row">
            <td colSpan="5" className="grand-total-label">
              Grand Total
            </td>
            <td className="amount grand-total-amount">{euro(grandTotal)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default TransactionList;
