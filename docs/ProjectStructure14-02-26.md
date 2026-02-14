# SmartSpend — Project Structure

> Generated on 14-02-2026

```
SmartSpend/
├── README.md                          # Project overview & setup instructions
├── .gitignore
│
├── backend/
│   ├── .env                           # ⚙ Environment variables (DB creds, CORS, etc.)
│   ├── .env.example
│   ├── __init__.py
│   ├── requirements.txt               # Python dependencies
│   ├── venv/                          # Python virtual environment (not committed)
│   └── app/
│       ├── __init__.py
│       ├── main.py                    # ⚙ FastAPI entry point (CORS, routers, health)
│       ├── api/
│       │   ├── __init__.py
│       │   └── transactions.py        # API endpoints (users, products, transactions)
│       ├── core/
│       │   ├── __init__.py
│       │   ├── config.py              # Settings loaded from .env
│       │   └── database.py            # MySQL connection helper
│       ├── models/
│       │   └── __init__.py
│       └── schemas/
│           ├── __init__.py
│           └── schemas.py             # Pydantic request/response schemas
│
├── database/
│   ├── .gitkeep
│   ├── init.sql                       # Original DB creation script
│   ├── fix_schema.sql                 # Schema migration / fix script
│   └── 14-02-26-schema.sql            # Schema snapshot (14 Feb 2026)
│
├── docs/
│   ├── .gitkeep
│   ├── architecture.md                # Architecture documentation
│   └── database_erd.md                # Mermaid ER diagram
│
├── frontend/
│   ├── .env                           # ⚙ React environment variables
│   ├── package.json                   # ⚙ Node dependencies & scripts
│   ├── package-lock.json
│   ├── node_modules/                  # Installed packages (not committed)
│   ├── public/
│   │   └── index.html                 # HTML entry point
│   └── src/
│       ├── index.js                   # React DOM render
│       ├── index.css
│       ├── App.js                     # Root React component
│       ├── App.css
│       ├── components/
│       │   ├── Header.js              # App header component
│       │   ├── Header.css
│       │   ├── TransactionForm.js     # New-transaction form
│       │   └── TransactionList.js     # Transaction table / list
│       └── services/
│           └── api.js                 # Axios HTTP client to backend
│
└── powerbi/
    └── .gitkeep                       # Placeholder for Power BI reports
```

## Key Files & Locations

| File | Path | Purpose |
|------|------|---------|
| `main.py` | `backend/app/main.py` | FastAPI application entry point |
| `package.json` | `frontend/package.json` | Frontend dependencies & npm scripts |
| `.env` (backend) | `backend/.env` | DB credentials, CORS origins, app settings |
| `.env` (frontend) | `frontend/.env` | React app environment config |
| `transactions.py` | `backend/app/api/transactions.py` | All API route handlers |
| `schemas.py` | `backend/app/schemas/schemas.py` | Pydantic validation models |
| `database.py` | `backend/app/core/database.py` | MySQL connection helper |
| `init.sql` | `database/init.sql` | Database initialization script |
