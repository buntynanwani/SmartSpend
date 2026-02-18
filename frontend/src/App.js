import React, { useState } from "react";
import Header from "./components/Header";
import TransactionForm from "./components/TransactionForm";
import DashboardManager from "./components/DashboardManager";
import "./App.css";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleTransactionAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="app">
      <Header />
      <div className="app-layout">
        {/* ── Left / Top: Transaction Form (always visible) ── */}
        <section className="app-layout__form">
          <div className="card">
            <h2>{editingTransaction ? "Edit Transaction" : "Add Transaction"}</h2>
            <TransactionForm
              onSuccess={handleTransactionAdded}
              editingTransaction={editingTransaction}
              setEditingTransaction={setEditingTransaction}
            />
          </div>
        </section>

        {/* ── Right / Bottom: Management Dashboard ────────── */}
        <section className="app-layout__dashboard">
          <DashboardManager
            refreshKey={refreshKey}
            onRefresh={handleTransactionAdded}
            setEditingTransaction={setEditingTransaction}
          />
        </section>
      </div>
    </div>
  );
}

export default App;
