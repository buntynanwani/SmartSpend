import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">
          <span className="logo-icon">💰</span> SmartSpend
        </h1>
        <p className="tagline">Personal Expense Tracker</p>
      </div>
    </header>
  );
}

export default Header;
