import React, { useState } from "react";
import Header from "./components/Header";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import "./App.css";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTransactionAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="grid">
            <section className="card form-section">
              <h2>Add Transaction</h2>
              <TransactionForm onSuccess={handleTransactionAdded} />
            </section>
            <section className="card list-section">
              <h2>Recent Transactions</h2>
              <TransactionList
                refreshKey={refreshKey}
                onRefresh={handleTransactionAdded}
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
