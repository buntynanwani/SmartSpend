# SmartSpend — Final Project Structure

> **Date:** February 2026
> **Milestone:** Database normalization complete · Full CRUD API · Split-screen dashboard · Power BI analytics layer documented
> **Branch:** `7-refactor-normalize-products-table-for-power-bi-readiness-category-brand-ids`

---

## Table of Contents

1. [Directory Tree](#directory-tree)
2. [Tier Map](#tier-map)
3. [Key Files & Locations](#key-files--locations)
4. [Folder Descriptions](#folder-descriptions)
5. [Architecture Evolution Notes](#architecture-evolution-notes)

---

## Directory Tree

```
SmartSpend/
│
├── README.md                                     # Repository overview, setup guide & API reference
├── .gitignore                                    # Git exclusion rules (venv, node_modules, .env, __pycache__)
│
│
│   ═══════════════════════════════════════════════
│   TIER 1 — APPLICATION LAYER  (FastAPI + Python)
│   ═══════════════════════════════════════════════
│
├── backend/                                      # FastAPI backend service
│   ├── __init__.py                               # Package marker
│   ├── .env                                      # ⚙ Environment variables (DB creds, CORS, app settings)
│   ├── .env.example                              # Template for new developer onboarding
│   ├── requirements.txt                          # Python dependencies (fastapi, sqlalchemy, pymysql, etc.)
│   │
│   ├── app/                                      # Application root package
│   │   ├── __init__.py
│   │   ├── main.py                               # ⚙ FastAPI entry point — CORS, router mounting, health checks
│   │   │
│   │   ├── core/                                 # ── Infrastructure & Configuration ──
│   │   │   ├── __init__.py
│   │   │   ├── config.py                         # Pydantic BaseSettings — loads .env automatically
│   │   │   └── database.py                       # SQLAlchemy engine, SessionLocal factory & get_db dependency
│   │   │
│   │   ├── models/                               # ── SQLAlchemy ORM Models (normalized relational schema) ──
│   │   │   ├── __init__.py                       # Barrel export: User, Shop, Product, Category, Brand, Purchase, PurchaseItem
│   │   │   ├── user.py                           # User model          — household members
│   │   │   ├── shop.py                           # Shop model          — retail locations / vendors
│   │   │   ├── product.py                        # Product model       — catalog with category_id & brand_id FKs
│   │   │   ├── category.py                       # Category model      — product classification dimension
│   │   │   ├── brand.py                          # Brand model         — product brand dimension
│   │   │   ├── purchase.py                       # Purchase model      — transaction header (date, shop, user, total)
│   │   │   └── purchase_item.py                  # PurchaseItem model  — line-items linking Purchase ↔ Product
│   │   │
│   │   ├── schemas/                              # ── Pydantic v2 Schemas (request / response validation) ──
│   │   │   ├── __init__.py
│   │   │   ├── schemas.py                        # Shared / legacy base schema definitions
│   │   │   ├── user.py                           # UserCreate, UserUpdate, UserResponse
│   │   │   ├── shop.py                           # ShopCreate, ShopUpdate, ShopResponse
│   │   │   ├── product.py                        # ProductCreate, ProductUpdate, ProductResponse
│   │   │   ├── category.py                       # CategoryCreate, CategoryUpdate, CategoryResponse
│   │   │   └── purchase.py                       # PurchaseCreate, PurchaseUpdate, PurchaseResponse (nested items)
│   │   │
│   │   └── routers/                              # ── FastAPI Route Handlers (one per domain entity) ──
│   │       ├── __init__.py
│   │       ├── users.py                          # /users       — full CRUD (GET, POST, PUT, DELETE)
│   │       ├── shops.py                          # /shops       — full CRUD, unique name enforcement
│   │       ├── products.py                       # /products    — full CRUD, accepts category_id & brand_id FKs
│   │       ├── categories.py                     # /categories  — full CRUD, get-or-create on POST
│   │       └── purchases.py                      # /purchases   — atomic multi-item transaction CRUD
│   │
│   │   ── Legacy / Deprecated ──
│   │   ├── api/                                  # (Deprecated) Original monolithic endpoint module
│   │   │   └── __init__.py                       # Superseded by modular routers/
│   │
│   ├── database/                                 # Local database working directory (backend-internal)
│   │
│   └── scripts/                                  # ── Utility & ETL Scripts ──
│       └── data_import/                          # Historical data migration pipeline
│           ├── import_access_data.py             # Main ETL: products + orders import with FK management
│           ├── import_orders.py                  # Standalone orders/details CSV import
│           ├── raw/                              # Raw CSV exports from MS Access (cp1252 encoded)
│           │   ├── Productos.csv                 # Product catalog export
│           │   ├── Pedidos-cabecera.csv          # Order headers export
│           │   └── Pedidos-detalles.csv          # Order line-items export
│           └── cleaned/                          # Cleaned CSVs ready for SQL import
│
│
│   ═══════════════════════════════════════════════
│   TIER 2 — PRESENTATION LAYER  (React 18 SPA)
│   ═══════════════════════════════════════════════
│
├── frontend/                                     # React single-page application
│   ├── .env                                      # ⚙ Frontend environment (REACT_APP_API_URL)
│   ├── package.json                              # npm dependencies & scripts (react, axios, react-select)
│   ├── package-lock.json                         # Deterministic dependency lock
│   │
│   ├── public/
│   │   └── index.html                            # HTML shell — React mount point
│   │
│   └── src/
│       ├── index.js                              # React DOM entry point — renders <App />
│       ├── index.css                             # Global CSS reset & CSS custom properties
│       ├── App.js                                # ⚙ Root component — split-screen layout orchestrator
│       ├── App.css                               # Responsive Flexbox layout (mobile-first → side-by-side)
│       │
│       ├── components/                           # ── UI Components ──
│       │   ├── Header.js                         # Navigation header with app branding
│       │   ├── Header.css                        # Header styles
│       │   ├── TransactionForm.js                # ★ Multi-item purchase form — CreatableSelect dropdowns
│       │   ├── TransactionList.js                # Purchase history cards with item-level detail tables
│       │   ├── DashboardManager.js               # ★ Grid Center — drill-down panels for all entity CRUD
│       │   └── DashboardManager.css              # Dashboard grid, panel, table & tab styles
│       │
│       └── services/
│           └── api.js                            # Axios HTTP client — all CRUD calls to FastAPI backend
│
│
│   ═══════════════════════════════════════════════
│   TIER 3 — DATA TIER  (MySQL 8 Snowflake Schema)
│   ═══════════════════════════════════════════════
│
├── database/                                     # SQL schema & migration scripts
│   ├── .gitkeep                                  # Ensures directory is tracked in Git
│   ├── init.sql                                  # Initial database bootstrap (CREATE DATABASE, USE)
│   ├── 14-02-26-schema.sql                       # Full normalized schema — 7 tables, FKs, constraints
│   └── fix_schema.sql                            # Schema patches / corrections applied post-migration
│
│
│   ═══════════════════════════════════════════════
│   TIER 4 — ANALYTICS TIER  (Power BI)
│   ═══════════════════════════════════════════════
│
├── powerbi/                                      # Power BI reports & documentation
│   ├── .gitkeep                                  # Ensures directory is tracked in Git
│   ├── PowerBiReport.md                          # ★ Comprehensive final dashboard report (all sections)
│   ├── PowerBiDashBordPages.md                   # 6-page dashboard breakdown & visual descriptions
│   ├── The Engine Room_ _Measures Dictionary.md  # Categorized dictionary of all 23 DAX measures
│   └── ModelView.md                              # Data model / relationship view documentation
│
│
│   ═══════════════════════════════════════════════
│   DOCUMENTATION  (Cross-cutting)
│   ═══════════════════════════════════════════════
│
└── docs/                                         # Project documentation
    ├── .gitkeep                                  # Ensures directory is tracked in Git
    ├── architecture.md                           # ★ System architecture — 4-tier design, data flow diagram
    ├── database_erd.md                           # Mermaid Entity-Relationship Diagram (Snowflake schema)
    ├── ProjectBriefing.md                        # Project brief — English
    ├── ProjectBriefingES.md                      # Project brief — Spanish
    ├── ProjectStructure14-02-26.md               # Structure snapshot — Feb 14 (pre-normalization)
    ├── ProjectStructure16-02-26.md               # Structure snapshot — Feb 16 (post-migration)
    └── FinalProjectStructure.md                  # ← This file — final comprehensive structure
```

---

## Tier Map

A quick reference mapping each directory to its role in the 4-tier architecture:

| Tier | Directory | Technology | Responsibility |
|------|-----------|-----------|----------------|
| **1 — Application** | `backend/` | FastAPI 0.115 + SQLAlchemy 2.0 + Pydantic v2 | REST API, validation, business logic, atomic transactions |
| **2 — Presentation** | `frontend/` | React 18 + Axios + react-select | Split-screen SPA, entity management, searchable dropdowns |
| **3 — Data** | `database/` | MySQL 8 | Normalized Snowflake schema — 7 relational tables |
| **4 — Analytics** | `powerbi/` | Power BI (DirectQuery / Import) | 23 DAX measures, 6 dashboard pages, inflation tracking |
| **Cross-cutting** | `docs/` | Markdown + Mermaid | Architecture docs, ERD, project briefs, structure snapshots |

---

## Key Files & Locations

### Backend — Application Layer

| File | Path | Purpose |
|------|------|---------|
| `main.py` | [`backend/app/main.py`](../backend/app/main.py) | FastAPI application factory — CORS configuration, 5 router mounts, health endpoints |
| `config.py` | [`backend/app/core/config.py`](../backend/app/core/config.py) | Pydantic `BaseSettings` — loads all env vars from `.env` with type validation |
| `database.py` | [`backend/app/core/database.py`](../backend/app/core/database.py) | SQLAlchemy engine (`mysql+pymysql`), `SessionLocal` factory, `get_db()` dependency |
| `models/__init__.py` | [`backend/app/models/__init__.py`](../backend/app/models/__init__.py) | Barrel export — imports all 7 ORM models for `Base.metadata.create_all()` |
| `user.py` | [`backend/app/models/user.py`](../backend/app/models/user.py) | `User` model — `id`, `name`, `email` (UNIQUE), timestamps |
| `shop.py` | [`backend/app/models/shop.py`](../backend/app/models/shop.py) | `Shop` model — `id`, `name` (UNIQUE), timestamps |
| `product.py` | [`backend/app/models/product.py`](../backend/app/models/product.py) | `Product` model — `id`, `name`, `reference`, `unit_type`, `category_id` FK, `brand_id` FK |
| `category.py` | [`backend/app/models/category.py`](../backend/app/models/category.py) | `Category` model — `id`, `name` (UNIQUE) — product classification dimension |
| `brand.py` | [`backend/app/models/brand.py`](../backend/app/models/brand.py) | `Brand` model — `id`, `name` (UNIQUE) — product brand dimension |
| `purchase.py` | [`backend/app/models/purchase.py`](../backend/app/models/purchase.py) | `Purchase` model — header with `user_id`, `shop_id`, `date`, `total_amount` |
| `purchase_item.py` | [`backend/app/models/purchase_item.py`](../backend/app/models/purchase_item.py) | `PurchaseItem` model — line-items with `product_id`, `quantity`, `unit_price`, `subtotal` |
| `users.py` | [`backend/app/routers/users.py`](../backend/app/routers/users.py) | `/users` router — GET, POST, PUT (partial), DELETE |
| `shops.py` | [`backend/app/routers/shops.py`](../backend/app/routers/shops.py) | `/shops` router — GET, POST, PUT (unique name), DELETE |
| `products.py` | [`backend/app/routers/products.py`](../backend/app/routers/products.py) | `/products` router — GET, POST, PUT, DELETE — accepts `category_id`, `brand_id` |
| `categories.py` | [`backend/app/routers/categories.py`](../backend/app/routers/categories.py) | `/categories` router — GET, POST (get-or-create), PUT, DELETE |
| `purchases.py` | [`backend/app/routers/purchases.py`](../backend/app/routers/purchases.py) | `/purchases` router — atomic multi-item transaction CRUD (wipe-and-reinsert on PUT) |
| `schemas.py` | [`backend/app/schemas/schemas.py`](../backend/app/schemas/schemas.py) | Shared / legacy base Pydantic schemas |
| `.env` | [`backend/.env`](../backend/.env) | DB credentials, CORS origins, app name/version, debug flag |
| `.env.example` | [`backend/.env.example`](../backend/.env.example) | Template for new developer environment setup |
| `requirements.txt` | [`backend/requirements.txt`](../backend/requirements.txt) | Python dependencies — `fastapi`, `uvicorn`, `sqlalchemy`, `pymysql`, `pydantic`, etc. |

### Backend — ETL Scripts

| File | Path | Purpose |
|------|------|---------|
| `import_access_data.py` | [`backend/scripts/data_import/import_access_data.py`](../backend/scripts/data_import/import_access_data.py) | Main ETL pipeline — imports products (dedup by reference) + orders with FK mapping from Access |
| `import_orders.py` | [`backend/scripts/data_import/import_orders.py`](../backend/scripts/data_import/import_orders.py) | Standalone order/detail CSV import — handles `cp1252` encoding, European decimals, `dayfirst` dates |
| `raw/` | `backend/scripts/data_import/raw/` | Raw CSV exports from MS Access (`Productos.csv`, `Pedidos-cabecera.csv`, `Pedidos-detalles.csv`) |
| `cleaned/` | `backend/scripts/data_import/cleaned/` | Post-processing CSVs with normalized encoding and formats |

### Frontend — Presentation Layer

| File | Path | Purpose |
|------|------|---------|
| `App.js` | [`frontend/src/App.js`](../frontend/src/App.js) | Root component — split-screen layout: `TransactionForm` (left) + `DashboardManager` (right) |
| `App.css` | [`frontend/src/App.css`](../frontend/src/App.css) | Responsive Flexbox layout — mobile column → desktop side-by-side at 1024px breakpoint |
| `TransactionForm.js` | [`frontend/src/components/TransactionForm.js`](../frontend/src/components/TransactionForm.js) | ★ Primary data entry — multi-item purchase form with `CreatableSelect` for products, categories |
| `TransactionList.js` | [`frontend/src/components/TransactionList.js`](../frontend/src/components/TransactionList.js) | Purchase history display — receipt cards with expandable item-level detail tables |
| `DashboardManager.js` | [`frontend/src/components/DashboardManager.js`](../frontend/src/components/DashboardManager.js) | ★ Grid Center — stateful drill-down navigation: Users, Shops, Transactions, Products Hub |
| `DashboardManager.css` | [`frontend/src/components/DashboardManager.css`](../frontend/src/components/DashboardManager.css) | Dashboard styles — grid cards, panel headers, data tables, tabs, action buttons |
| `Header.js` | [`frontend/src/components/Header.js`](../frontend/src/components/Header.js) | Navigation header with app branding |
| `api.js` | [`frontend/src/services/api.js`](../frontend/src/services/api.js) | Centralized Axios HTTP client — all CRUD functions for 5 entity domains |
| `package.json` | [`frontend/package.json`](../frontend/package.json) | npm config — `react`, `axios`, `react-select` dependencies |
| `.env` | [`frontend/.env`](../frontend/.env) | `REACT_APP_API_URL` — backend base URL |

### Database — Data Tier

| File | Path | Purpose |
|------|------|---------|
| `init.sql` | [`database/init.sql`](../database/init.sql) | Database bootstrap — `CREATE DATABASE smartspend` |
| `14-02-26-schema.sql` | [`database/14-02-26-schema.sql`](../database/14-02-26-schema.sql) | Full normalized schema — 7 tables, PKs, FKs, UNIQUE constraints, ENUMs |
| `fix_schema.sql` | [`database/fix_schema.sql`](../database/fix_schema.sql) | Post-migration schema patches and corrections |

### Power BI — Analytics Tier

| File | Path | Purpose |
|------|------|---------|
| `PowerBiReport.md` | [`powerbi/PowerBiReport.md`](../powerbi/PowerBiReport.md) | ★ Comprehensive dashboard report — schema, 23 measures, 6 pages, technical notes |
| `PowerBiDashBordPages.md` | [`powerbi/PowerBiDashBordPages.md`](../powerbi/PowerBiDashBordPages.md) | Detailed breakdown of all 6 interactive dashboard pages |
| `The Engine Room_ _Measures Dictionary.md` | [`powerbi/The Engine Room_ _Measures Dictionary.md`](../powerbi/The%20Engine%20Room_%20_Measures%20Dictionary.md) | Categorized DAX measures dictionary — formulas, descriptions, usage |
| `ModelView.md` | [`powerbi/ModelView.md`](../powerbi/ModelView.md) | Power BI data model / relationship view documentation |

### Documentation — Cross-Cutting

| File | Path | Purpose |
|------|------|---------|
| `architecture.md` | [`docs/architecture.md`](../docs/architecture.md) | ★ System architecture — 4-tier design, Mermaid data flow, cross-cutting concerns |
| `database_erd.md` | [`docs/database_erd.md`](../docs/database_erd.md) | Mermaid ERD — Snowflake schema with all 7 tables and relationships |
| `ProjectBriefing.md` | [`docs/ProjectBriefing.md`](../docs/ProjectBriefing.md) | Full project brief — problem, solution, MVP, phases (English) |
| `ProjectBriefingES.md` | [`docs/ProjectBriefingES.md`](../docs/ProjectBriefingES.md) | Full project brief — Spanish translation |
| `ProjectStructure14-02-26.md` | [`docs/ProjectStructure14-02-26.md`](../docs/ProjectStructure14-02-26.md) | Historical snapshot — pre-normalization flat structure |
| `ProjectStructure16-02-26.md` | [`docs/ProjectStructure16-02-26.md`](../docs/ProjectStructure16-02-26.md) | Historical snapshot — post-migration 5-model architecture |
| `FinalProjectStructure.md` | [`docs/FinalProjectStructure.md`](../docs/FinalProjectStructure.md) | ← This file — final 7-model normalized architecture |

---

## Folder Descriptions

### `backend/`

The application server tier. Houses the entire FastAPI service organized into four sub-packages:

- **`core/`** — Infrastructure plumbing: environment configuration via Pydantic `BaseSettings` and the SQLAlchemy database engine/session factory. Every request receives a scoped database session through the [`get_db()`](../backend/app/core/database.py) dependency injector.

- **`models/`** — Seven SQLAlchemy ORM classes mapping 1:1 to the MySQL tables. The [`__init__.py`](../backend/app/models/__init__.py) barrel file ensures all models are imported before `Base.metadata.create_all()` runs at startup, guaranteeing every table is created. Relationships are declared with `relationship()` for eager/lazy loading (e.g., `Purchase.items` → list of `PurchaseItem`).

- **`schemas/`** — Pydantic v2 data transfer objects enforcing type safety at the API boundary. Each entity has three schema variants: `Create` (required fields for POST), `Update` (all `Optional` fields for PUT with `exclude_unset=True`), and `Response` (serialization with `from_attributes=True`). The `PurchaseCreate` schema nests `List[PurchaseItemCreate]` for multi-item receipt submission.

- **`routers/`** — Five modular FastAPI routers, one per domain entity. Each router encapsulates GET (list all), POST (create), PUT (update), and DELETE endpoints. The [`purchases.py`](../backend/app/routers/purchases.py) router implements the most complex logic: atomic multi-item transactions with FK validation, subtotal computation, wipe-and-reinsert on edit, and total aggregation — all within an explicit `try/except` block with `db.rollback()` on failure.

### `backend/scripts/data_import/`

ETL pipeline for migrating historical data from a legacy Microsoft Access database. The two Python scripts ([`import_access_data.py`](../backend/scripts/data_import/import_access_data.py) and [`import_orders.py`](../backend/scripts/data_import/import_orders.py)) handle:

- Reading `cp1252`-encoded CSVs exported from Access
- Parsing European price formats (`€ 3,50` → `3.50`) and `DD/MM/YYYY` dates
- Temporarily disabling foreign key checks for idempotent `TRUNCATE` + bulk `INSERT`
- Tracking `lastrowid` values for parent→child FK mapping (orders → order items)

### `frontend/`

The presentation tier. A React 18 single-page application using functional components and hooks exclusively:

- **[`App.js`](../frontend/src/App.js)** — Orchestrates the split-screen layout via three shared state variables (`refreshKey`, `editingTransaction`, `setEditingTransaction`) that synchronize the left panel (transaction entry) with the right panel (entity management).

- **[`TransactionForm.js`](../frontend/src/components/TransactionForm.js)** — The primary data entry component. Uses `CreatableSelect` from `react-select/creatable` for searchable/creatable product and category dropdowns supporting 121+ items. Manages dynamic item rows with real-time subtotal computation and EUR formatting via `Intl.NumberFormat`.

- **[`DashboardManager.js`](../frontend/src/components/DashboardManager.js)** — The Grid Center navigation hub. Implements a `currentView` state machine with 8 views: `grid` → `users` | `shops` | `transactions` | `products` → `manage_products` | `manage_categories` | `manage_brands`. Built from reusable `DataCard` and `PanelHeader` sub-components. Every management panel provides inline add/edit forms and delete-with-confirmation.

- **[`api.js`](../frontend/src/services/api.js)** — Centralized Axios client exporting named functions for every CRUD operation across all five entity domains. Components never construct URLs or manage HTTP mechanics directly.

### `database/`

SQL schema definition and migration scripts. The primary schema file ([`14-02-26-schema.sql`](../database/14-02-26-schema.sql)) defines the full Snowflake schema with:

- 2 fact tables: `purchases` (receipt headers) and `purchase_items` (line-items)
- 5 dimension tables: `users`, `shops`, `products`, `categories`, `brands`
- `UNIQUE` constraints on all reference columns (`email`, `name`, `reference`)
- `FOREIGN KEY` constraints with appropriate `ON DELETE` behavior
- `ENUM` type for `products.unit_type`

### `powerbi/`

Power BI analytics documentation suite. Though the `.pbix` file itself is not committed to Git (binary), all design decisions, measures, and page layouts are captured in Markdown:

- [`PowerBiReport.md`](../powerbi/PowerBiReport.md) — The comprehensive report combining schema explanation, 23 DAX measures, 6 page descriptions, and technical integration notes.
- [`The Engine Room_ _Measures Dictionary.md`](../powerbi/The%20Engine%20Room_%20_Measures%20Dictionary.md) — The complete DAX measures reference organized by functional category.
- [`PowerBiDashBordPages.md`](../powerbi/PowerBiDashBordPages.md) — Page-by-page visual inventory and analytical purpose.

### `docs/`

Cross-cutting project documentation spanning all four tiers:

- [`architecture.md`](../docs/architecture.md) — The definitive system architecture document covering frontend, backend, data, and analytics tiers with a Mermaid data flow diagram.
- [`database_erd.md`](../docs/database_erd.md) — Visual Mermaid ERD showing all 7 tables, their columns, and relationship cardinalities.
- Project briefings in English and Spanish for stakeholder communication.
- Historical structure snapshots tracking the project's evolution from a flat `transactions.py` monolith to the current normalized 7-model architecture.

---

## Architecture Evolution Notes

This document represents the **third structure snapshot** in the project's history. The evolution tracks a consistent trajectory toward normalization and separation of concerns:

| Snapshot | Date | Key State |
|----------|------|-----------|
| [`ProjectStructure14-02-26.md`](../docs/ProjectStructure14-02-26.md) | Feb 14, 2026 | Monolithic `transactions.py` endpoint, flat schemas, no ORM models, empty `powerbi/` |
| [`ProjectStructure16-02-26.md`](../docs/ProjectStructure16-02-26.md) | Feb 16, 2026 | Modular routers, 5 ORM models (`User`, `Shop`, `Product`, `Purchase`, `PurchaseItem`), ETL scripts added |
| **`FinalProjectStructure.md`** | Feb 2026 | **7 ORM models** (added `Category`, `Brand`), `products.category_id` & `brand_id` FKs, `DashboardManager` component, full Power BI documentation suite, comprehensive `architecture.md` |

### Key Changes from Previous Snapshot

| Area | Before (Feb 16) | Now (Final) |
|------|-----------------|-------------|
| **ORM Models** | 5 (`User`, `Shop`, `Product`, `Purchase`, `PurchaseItem`) | 7 (added [`Category`](../backend/app/models/category.py), [`Brand`](../backend/app/models/brand.py)) |
| **Products Table** | Text-based `category` and `brand` columns | Integer FK `category_id → categories.id`, `brand_id → brands.id` |
| **Schema Files** | `user.py`, `shop.py`, `product.py`, `purchase.py` | Added [`category.py`](../backend/app/schemas/category.py) for category Create/Update/Response |
| **Routers** | `users`, `shops`, `products`, `purchases` | Added [`categories.py`](../backend/app/routers/categories.py) with get-or-create logic |
| **Frontend Components** | `TransactionForm`, `TransactionList`, `Header` | Added [`DashboardManager.js`](../frontend/src/components/DashboardManager.js) with Grid Center + 8 views |
| **Power BI Docs** | Empty `.gitkeep` | Full suite: [`PowerBiReport.md`](../powerbi/PowerBiReport.md), Measures Dictionary, Dashboard Pages, Model View |
| **Architecture Doc** | Basic overview | Comprehensive 4-tier document with Mermaid data flow diagram |

---

*This document reflects the final project structure as of the `7-refactor-normalize-products-table-for-power-bi-readiness-category-brand-ids` branch of the SmartSpend repository.*