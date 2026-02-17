# SmartSpend — Project Structure

> **Date:** February 16, 2026
> **Milestone:** Migration from Microsoft Access to a normalized SQL-based architecture — **Complete**

---

## Directory Tree

```
SmartSpend/
│
├── backend/                                  # FastAPI backend service
│   ├── __init__.py
│   ├── .env                                  # Environment variables (DB credentials, secrets)
│   ├── .env.example                          # Template for environment configuration
│   ├── requirements.txt                      # Python dependencies (FastAPI, SQLAlchemy, etc.)
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                           # Application entry point — FastAPI app factory & router mounting
│   │   │
│   │   ├── api/
│   │   │   └── __init__.py
│   │   │
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py                     # Centralised settings (Pydantic BaseSettings)
│   │   │   └── database.py                   # SQLAlchemy engine & session factory for the SQL database
│   │   │
│   │   ├── models/                           # ── SQLAlchemy ORM Models (normalised relational schema) ──
│   │   │   ├── __init__.py
│   │   │   ├── user.py                       # User model          — authenticated application users
│   │   │   ├── shop.py                       # Shop model          — retail locations / vendors
│   │   │   ├── product.py                    # Product model       — catalogue of purchasable items
│   │   │   ├── purchase.py                   # Purchase model      — transaction header (date, shop, user)
│   │   │   └── purchase_item.py              # PurchaseItem model  — line-items linking Purchase ↔ Product
│   │   │
│   │   ├── schemas/                          # ── Pydantic v2 Schemas (request / response validation) ──
│   │   │   ├── __init__.py
│   │   │   ├── schemas.py                    # Shared / base schema definitions
│   │   │   ├── user.py                       # User schemas        — create, read, update DTOs
│   │   │   ├── shop.py                       # Shop schemas        — create, read, update DTOs
│   │   │   ├── product.py                    # Product schemas     — create, read, update DTOs
│   │   │   └── purchase.py                   # Purchase schemas    — nested line-item validation
│   │   │
│   │   └── routers/                          # FastAPI route handlers (one per domain entity)
│   │       ├── __init__.py
│   │       ├── users.py                      # /users   endpoints
│   │       ├── shops.py                      # /shops   endpoints
│   │       ├── products.py                   # /products endpoints
│   │       └── purchases.py                  # /purchases endpoints (multi-item transaction support)
│   │
│   ├── database/                             # Local database working directory
│   │
│   └── scripts/
│       └── data_import/
│           ├── import_access_data.py          # ETL script — migrates legacy Access data into SQL tables
│           ├── raw/                           # Raw exports from the original Access database
│           └── cleaned/                       # Cleaned CSVs ready for SQL import
│
├── database/                                 # SQL schema & migration scripts
│   ├── init.sql                              # Initial database bootstrap
│   ├── 14-02-26-schema.sql                   # Full normalised schema (tables, keys, constraints)
│   └── fix_schema.sql                        # Schema patch / corrections
│
├── docs/                                     # Project documentation
│   ├── architecture.md                       # High-level architecture overview
│   ├── database_erd.md                       # Entity-Relationship Diagram for the SQL schema
│   ├── ProjectBriefing.md                    # Project brief (English)
│   ├── ProjectBriefingES.md                  # Project brief (Spanish)
│   ├── ProjectStructure14-02-26.md           # Previous project structure snapshot
│   └── ProjectStructure16-02-26.md           # ← This file
│
├── frontend/                                 # React single-page application
│   ├── .env                                  # Frontend environment variables (API base URL)
│   ├── package.json                          # npm dependencies & scripts
│   ├── package-lock.json
│   │
│   ├── public/
│   │   └── index.html                        # HTML shell for the React app
│   │
│   └── src/
│       ├── index.js                          # React DOM entry point
│       ├── index.css                         # Global styles
│       ├── App.js                            # Root component — routing & layout
│       ├── App.css                           # App-level styles
│       │
│       ├── components/
│       │   ├── Header.js                     # Navigation header component
│       │   ├── Header.css                    # Header styles
│       │   ├── TransactionForm.js            # ★ Primary entry point for multi-item purchase data
│       │   └── TransactionList.js            # Displays purchase history / transaction records
│       │
│       └── services/
│           └── api.js                        # Axios HTTP client — communicates with the FastAPI backend
│
├── powerbi/                                  # Power BI reports & dashboards (planned)
│
└── README.md                                 # Repository overview & setup instructions
```

---

## Architecture Highlights

| Layer | Technology | Role |
|-------|-----------|------|
| **Database** | PostgreSQL / SQL Server | Normalised relational store replacing the legacy Access file |
| **Backend** | FastAPI + SQLAlchemy | REST API with ORM models mirroring the 5-table schema |
| **Schemas** | Pydantic v2 | Request/response validation & serialisation |
| **Frontend** | React | SPA for data entry (`TransactionForm`) and review (`TransactionList`) |
| **BI** | Power BI | Reporting layer connected to the SQL database |

### Relational Models (`backend/app/models/`)

The five SQLAlchemy models map directly to the normalised SQL schema:

| Model | File | Description |
|-------|------|-------------|
| `User` | `user.py` | Application users who record purchases |
| `Shop` | `shop.py` | Retail locations / vendors |
| `Product` | `product.py` | Product catalogue entries |
| `Purchase` | `purchase.py` | Transaction header (date, total, shop FK, user FK) |
| `PurchaseItem` | `purchase_item.py` | Line-items with quantity & price, linking `Purchase` ↔ `Product` |

### Pydantic v2 Schemas (`backend/app/schemas/`)

Each schema module provides `Create`, `Read`, and `Update` DTOs with full type validation, ensuring data integrity at the API boundary before it reaches the database layer.

### Frontend Data Entry (`frontend/src/components/TransactionForm.js`)

`TransactionForm` is the primary UI component for recording multi-item purchases. It collects shop selection, date, and a dynamic list of line-items (product, quantity, price) that map to the `Purchase` + `PurchaseItem` models on the backend.
