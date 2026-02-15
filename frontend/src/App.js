import React, { useState } from "react";
import Header from "./components/Header";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import "./App.css";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editData, setEditData] = useState(null);

  const handleTransactionAdded = () => {
    setRefreshKey((prev) => prev + 1);
    setEditData(null);
  };

  const handleEdit = (purchase) => {
    setEditData(purchase);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="grid">
            <section className="card form-section">
              <h2>{editData ? "Edit Purchase" : "Add Purchase"}</h2>
              <TransactionForm
                onSuccess={handleTransactionAdded}
                editData={editData}
                onCancelEdit={handleCancelEdit}
              />
            </section>
            <section className="card list-section">
              <h2>Recent Purchases</h2>
              <TransactionList
                refreshKey={refreshKey}
                onEdit={handleEdit}
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
