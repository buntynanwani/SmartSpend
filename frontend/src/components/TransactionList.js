import React, { useState, useEffect } from "react";
import {
  getPurchases,
  getUsers,
  getProducts,
  getShops,
  deletePurchase,
} from "../services/api";

const eurFmt = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

function TransactionList({ refreshKey, onRefresh }) {
  const [purchases, setPurchases] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [productMap, setProductMap] = useState({});
  const [shopMap, setShopMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getPurchases(), getUsers(), getProducts(), getShops()])
      .then(([purchaseData, users, products, shops]) => {
        const uMap = {};
        users.forEach((u) => {
          uMap[u.id] = u.name;
        });
        setUserMap(uMap);

        const pMap = {};
        products.forEach((p) => {
          pMap[p.id] = { name: p.name, unit: p.unit_type || "" };
        });
        setProductMap(pMap);

        const sMap = {};
        shops.forEach((s) => {
          sMap[s.id] = s.name;
        });
        setShopMap(sMap);

        setPurchases(purchaseData);
      })
      .catch((err) => console.error("Failed to fetch data:", err))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this purchase and all its items?")) return;
    try {
      await deletePurchase(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete purchase.");
    }
  };

  if (loading) {
    return <p className="no-data">Loading transactions...</p>;
  }

  if (purchases.length === 0) {
    return (
      <p className="no-data">No transactions yet. Add one to get started!</p>
    );
  }

  return (
    <div className="purchase-list">
      {purchases.map((purchase) => {
        const itemRows = purchase.items || [];
        return (
          <div key={purchase.id} className="purchase-card">
            {/* ── Purchase Header ──────────────────────── */}
            <div className="purchase-header">
              <div className="purchase-meta">
                <span className="purchase-date">
                  {new Date(purchase.date).toLocaleDateString()}
                </span>
                <span className="purchase-shop">
                  {shopMap[purchase.shop_id] || purchase.shop_id}
                </span>
                <span className="purchase-user">
                  {userMap[purchase.user_id] || purchase.user_id}
                </span>
              </div>
              <div className="purchase-actions">
                <span className="amount purchase-total">
                  {eurFmt.format(purchase.total_amount || 0)}
                </span>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(purchase.id)}
                  title="Delete purchase"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* ── Items Table ──────────────────────────── */}
            {itemRows.length > 0 && (
              <table className="purchase-items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {itemRows.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td>
                        {productMap[item.product_id]?.name || item.product_id}
                      </td>
                      <td>
                        {item.quantity}{" "}
                        {productMap[item.product_id]?.unit || ""}
                      </td>
                      <td className="amount">
                        {eurFmt.format(item.unit_price || 0)}
                      </td>
                      <td className="amount">
                        {eurFmt.format(item.subtotal || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TransactionList;
