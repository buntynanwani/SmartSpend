# SmartSpend — Project Structure

> Generated on 15-02-2026  
> **Post-migration:** Backend migrated from raw SQL to **SQLAlchemy ORM** with reorganised `models/`, `schemas/`, and `routers/`.

```
SmartSpend/
├── README.md                              # Project overview & setup instructions
├── .gitignore
│
├── backend/
│   ├── .env                               # ⚙ Environment variables (DB creds, CORS, etc.)
│   ├── .env.example
│   ├── __init__.py
│   ├── requirements.txt                   # Python dependencies (incl. SQLAlchemy)
│   ├── venv/                              # Python virtual environment (not committed)
│   └── app/
│       ├── __init__.py
│       ├── main.py                        # ⚙ FastAPI entry point (CORS, routers, health)
│       │
│       ├── core/
│       │   ├── __init__.py
│       │   ├── config.py                  # Settings loaded from .env
│       │   └── database.py                # SQLAlchemy engine & session
│       │
│       ├── models/                        # 🔶 SQLAlchemy ORM models
│       │   ├── __init__.py
│       │   ├── user.py                    # 🆕 User model
│       │   ├── product.py                 # 🆕 Product model
│       │   ├── shop.py                    # 🆕 Shop model
│       │   ├── purchase.py                # 🆕 Purchase model
│       │   └── purchase_item.py           # 🆕 PurchaseItem model
│       │
│       ├── schemas/                       # 🔶 Pydantic request / response schemas
│       │   ├── __init__.py
│       │   ├── schemas.py                 #    Legacy schemas (kept for reference)
│       │   ├── user.py                    # 🆕 User schemas
│       │   ├── product.py                 # 🆕 Product schemas
│       │   ├── shop.py                    # 🆕 Shop schemas
│       │   └── purchase.py               # 🆕 Purchase schemas
│       │
│       └── routers/                       # 🔶 API route handlers (replaces api/)
│           ├── __init__.py
│           ├── users.py                   # 🆕 /users endpoints
│           ├── products.py                # 🆕 /products endpoints
│           ├── shops.py                   # 🆕 /shops endpoints
│           └── purchases.py              # 🆕 /purchases endpoints
│
├── database/
│   ├── .gitkeep
│   ├── init.sql                           # Original DB creation script
│   ├── fix_schema.sql                     # Schema migration / fix script
│   └── 14-02-26-schema.sql               # Schema snapshot (14 Feb 2026)
│
├── docs/
│   ├── .gitkeep
│   ├── architecture.md                    # Architecture documentation
│   ├── database_erd.md                    # Mermaid ER diagram
│   └── ProjectStructure14-02-26.md       # Previous structure snapshot
│
├── frontend/
│   ├── .env                               # ⚙ React environment variables
│   ├── package.json                       # ⚙ Node dependencies & npm scripts
│   ├── package-lock.json
│   ├── node_modules/                      # Installed packages (not committed)
│   ├── public/
│   │   └── index.html                     # HTML entry point
│   └── src/
│       ├── index.js                       # React DOM render
│       ├── index.css
│       ├── App.js                         # Root React component
│       ├── App.css
│       ├── components/
│       │   ├── Header.js                  # App header component
│       │   ├── Header.css
│       │   ├── TransactionForm.js         # New-transaction form
│       │   └── TransactionList.js         # Transaction table / list
│       └── services/
│           └── api.js                     # Axios HTTP client to backend
│
└── powerbi/
    └── .gitkeep                           # Placeholder for Power BI reports
```

## Key Files & Locations

| File | Path | Purpose |
|------|------|---------|
| `main.py` | `backend/app/main.py` | FastAPI application entry point |
| `database.py` | `backend/app/core/database.py` | SQLAlchemy engine & session factory |
| `config.py` | `backend/app/core/config.py` | App settings from `.env` |
| `.env` (backend) | `backend/.env` | DB credentials, CORS origins, app config |
| `package.json` | `frontend/package.json` | Frontend dependencies & npm scripts |
| `.env` (frontend) | `frontend/.env` | React app environment config |
| `init.sql` | `database/init.sql` | Database initialisation script |

## New Files Added During Migration (🆕)

| File | Type | Description |
|------|------|-------------|
| `backend/app/models/user.py` | Model | SQLAlchemy `User` ORM model |
| `backend/app/models/product.py` | Model | SQLAlchemy `Product` ORM model |
| `backend/app/models/shop.py` | Model | SQLAlchemy `Shop` ORM model |
| `backend/app/models/purchase.py` | Model | SQLAlchemy `Purchase` ORM model |
| `backend/app/models/purchase_item.py` | Model | SQLAlchemy `PurchaseItem` ORM model |
| `backend/app/schemas/user.py` | Schema | Pydantic schemas for User |
| `backend/app/schemas/product.py` | Schema | Pydantic schemas for Product |
| `backend/app/schemas/shop.py` | Schema | Pydantic schemas for Shop |
| `backend/app/schemas/purchase.py` | Schema | Pydantic schemas for Purchase |
| `backend/app/routers/users.py` | Router | `/users` API endpoints |
| `backend/app/routers/products.py` | Router | `/products` API endpoints |
| `backend/app/routers/shops.py` | Router | `/shops` API endpoints |
| `backend/app/routers/purchases.py` | Router | `/purchases` API endpoints |
