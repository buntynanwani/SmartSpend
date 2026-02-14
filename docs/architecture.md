# SmartSpend — Architecture Notes

## Overview

SmartSpend is a full-stack personal expense tracking application.
It follows a clean separation of concerns across three tiers:

1. **Frontend (React)** — Single-page application for data entry and viewing.
2. **Backend (FastAPI)** — RESTful API with Pydantic validation and SQLAlchemy ORM.
3. **Database (MySQL)** — Relational storage with normalised tables.

## Data Model

```
users ──< transactions >── products
```

- A **User** can have many **Transactions**.
- A **Product** can appear in many **Transactions**.
- Each **Transaction** records: shop, date, quantity, unit price, computed total.

## Key Design Decisions

- **Pydantic Settings** load `.env` automatically — no manual `dotenv` calls needed.
- **SQLAlchemy 2.0** declarative base keeps models close to raw SQL performance.
- **Axios** service layer centralises all HTTP calls so components stay simple.
- **CORS middleware** allows the React dev server to talk to FastAPI without proxy issues.
