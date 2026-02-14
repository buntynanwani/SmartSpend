import React, { useState, useEffect } from "react";
import { getTransactions } from "../services/api";

function TransactionList({ refreshKey }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTransactions()
      .then((data) => {
        setTransactions(data);
      })
      .catch((err) => {
        console.error("Failed to fetch transactions:", err);
      })
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading) {
    return <p className="no-data">Loading transactions...</p>;
  }

  if (transactions.length === 0) {
    return <p className="no-data">No transactions yet. Add one to get started!</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>User</th>
            <th>Product</th>
            <th>Shop</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, idx) => (
            <tr key={t.id}>
              <td>{idx + 1}</td>
              <td>{t.date}</td>
              <td>{t.user?.name || t.user_id}</td>
              <td>{t.product?.name || t.product_id}</td>
              <td>{t.shop}</td>
              <td>{t.quantity}</td>
              <td className="amount">${Number(t.unit_price).toFixed(2)}</td>
              <td className="amount">${Number(t.total_price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;
