-- ═══════════════════════════════════════════════════════════
-- SmartSpend — MySQL Database Initialization Script
-- ═══════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS smartspend
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smartspend;

-- ── Users ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- ── Products ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(200)  NOT NULL,
    category    VARCHAR(100)  DEFAULT NULL,
    created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_products_name (name)
) ENGINE=InnoDB;

-- ── Transactions ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS transactions (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT           NOT NULL,
    product_id  INT           NOT NULL,
    shop        VARCHAR(200)  NOT NULL,
    date        DATE          NOT NULL,
    quantity    INT           NOT NULL DEFAULT 1,
    unit_price  DOUBLE        NOT NULL,
    total_price DOUBLE        NOT NULL,
    created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_transactions_date (date),
    INDEX idx_transactions_user (user_id)
) ENGINE=InnoDB;

-- ── Sample Seed Data (optional) ─────────────────────────────

INSERT INTO users (name, email) VALUES
  ('Alice Johnson', 'alice@example.com'),
  ('Bob Smith',     'bob@example.com');

INSERT INTO products (name, category) VALUES
  ('Milk',    'Groceries'),
  ('Bread',   'Groceries'),
  ('Gasoline', 'Transport');

INSERT INTO transactions (user_id, product_id, shop, date, quantity, unit_price, total_price) VALUES
  (1, 1, 'Walmart',   '2026-02-10', 2, 3.49, 6.98),
  (1, 2, 'Walmart',   '2026-02-10', 1, 2.99, 2.99),
  (2, 3, 'Shell',     '2026-02-11', 1, 52.00, 52.00);
