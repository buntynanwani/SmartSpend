# SmartSpend

> **Personal Expense Tracking System** — Full-stack web application for recording, viewing, and analysing daily expenses. Features a responsive split-screen dashboard, CRUD management for all entities, and searchable/creatable dropdowns powered by react-select.

![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-teal?logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)

---

## Recent Major Updates

### Database Architecture
Cleaned up duplicate "Vitaminas" entries, added a `UNIQUE` constraint to the `categories` table. Extracted legacy brand names (Amway, Nutrilite) into a dedicated `brands` table and linked them to products via a `brand_id` foreign key.

### Backend API Expansion
Wrote missing `PUT` (Update) and `DELETE` endpoints for Users, Shops, Products, Categories, and Purchases. Added Pydantic `Update` schemas. Engineered complex transaction logic that automatically clears and replaces `purchase_items` on edit.

### Frontend UI/UX Redesign
Engineered a responsive split-screen layout (fixed TransactionForm on the left, dynamic dashboard on the right). Built a "Grid Center" main menu with drill-down cards. Replaced basic dropdowns with searchable/creatable `react-select` components for 121+ products and dynamic category creation.

---

## Project Structure

```
SmartSpend/
├── backend/                        # FastAPI application
│   ├── app/
│   │   ├── api/                    # (Legacy) API route handlers
│   │   ├── core/                   # Configuration & database
│   │   │   ├── config.py
│   │   │   └── database.py
│   │   ├── models/                 # SQLAlchemy ORM models
│   │   │   ├── category.py
│   │   │   ├── product.py
│   │   │   ├── purchase.py
│   │   │   ├── purchase_item.py
│   │   │   ├── shop.py
│   │   │   └── user.py
│   │   ├── routers/                # FastAPI route handlers (CRUD)
│   │   │   ├── categories.py
│   │   │   ├── products.py
│   │   │   ├── purchases.py
│   │   │   ├── shops.py
│   │   │   └── users.py
│   │   ├── schemas/                # Pydantic request/response schemas
│   │   │   ├── category.py
│   │   │   ├── product.py
│   │   │   ├── purchase.py
│   │   │   ├── schemas.py
│   │   │   ├── shop.py
│   │   │   └── user.py
│   │   └── main.py                 # FastAPI entry point
│   ├── scripts/
│   │   └── data_import/            # ETL scripts for historical data
│   │       ├── import_access_data.py
│   │       └── import_orders.py
│   ├── .env                        # Environment variables (not committed)
│   ├── .env.example                # Template for environment variables
│   └── requirements.txt            # Python dependencies
├── frontend/                       # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── DashboardManager.js
│   │   │   ├── DashboardManager.css
│   │   │   ├── Header.js
│   │   │   ├── Header.css
│   │   │   ├── TransactionForm.js
│   │   │   └── TransactionList.js
│   │   ├── services/               # API service layer
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── database/                       # SQL scripts
│   ├── init.sql                    # Schema & seed data
│   ├── 14-02-26-schema.sql
│   └── fix_schema.sql
├── docs/                           # Documentation & architecture notes
│   ├── architecture.md
│   ├── database_erd.md
│   ├── ProjectBriefing.md
│   ├── ProjectBriefingES.md
│   ├── ProjectStructure14-02-26.md
│   └── ProjectStructure16-02-26.md
├── powerbi/                        # Power BI reports & dashboards
├── .gitignore
└── README.md
```

---

## Tech Stack

| Layer      | Technology                         |
| ---------- | ---------------------------------- |
| Backend    | FastAPI (Python 3.11+)             |
| Database   | MySQL 8                            |
| ORM        | SQLAlchemy 2.0                     |
| Frontend   | React 18 (JavaScript)              |
| HTTP       | Axios                              |
| UI Select  | react-select / creatable           |
| Analytics  | Power BI *(planned)*               |

---

## Prerequisites

- **Python 3.11+**
- **Node.js 18+** and **npm**
- **MySQL 8** running locally (or a remote instance)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/buntynanwani/SmartSpend.git
cd SmartSpend
```

### 2. Set up MySQL

```bash
mysql -u root -p < database/init.sql
```

Edit `backend/.env` with your MySQL credentials:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smartspend
```

### 3. Setup Backend

```bash
cd backend/
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
```

### 4. Run Backend

```bash
cd backend/
source venv/Scripts/activate
uvicorn app.main:app --reload --port 8000
```

> The interactive API documentation is available at **http://127.0.0.1:8000/docs**

### 5. Run Frontend

```bash
cd frontend/
npm install
npm start
```

App opens at **http://localhost:3000**

---

## API Endpoints

### Health

| Method | Endpoint   | Description        |
| ------ | ---------- | ------------------ |
| `GET`  | `/`        | App info / status  |
| `GET`  | `/health`  | Health check       |

### Users (`/users`)

| Method   | Endpoint          | Description         |
| -------- | ----------------- | ------------------- |
| `GET`    | `/users/`         | List all users      |
| `POST`   | `/users/`         | Create a user       |
| `PUT`    | `/users/{id}`     | Update a user       |
| `DELETE` | `/users/{id}`     | Delete a user       |

### Shops (`/shops`)

| Method   | Endpoint          | Description         |
| -------- | ----------------- | ------------------- |
| `GET`    | `/shops/`         | List all shops      |
| `POST`   | `/shops/`         | Create a shop       |
| `PUT`    | `/shops/{id}`     | Update a shop       |
| `DELETE` | `/shops/{id}`     | Delete a shop       |

### Products (`/products`)

| Method   | Endpoint            | Description           |
| -------- | ------------------- | --------------------- |
| `GET`    | `/products/`        | List all products     |
| `POST`   | `/products/`        | Create a product      |
| `PUT`    | `/products/{id}`    | Update a product      |
| `DELETE` | `/products/{id}`    | Delete a product      |

### Categories (`/categories`)

| Method   | Endpoint              | Description                        |
| -------- | --------------------- | ---------------------------------- |
| `GET`    | `/categories/`        | List all categories (sorted)       |
| `POST`   | `/categories/`        | Create a category (get-or-create)  |
| `PUT`    | `/categories/{id}`    | Update a category                  |
| `DELETE` | `/categories/{id}`    | Delete a category                  |

### Purchases (`/purchases`)

| Method   | Endpoint              | Description                                      |
| -------- | --------------------- | ------------------------------------------------ |
| `GET`    | `/purchases/`         | List all purchases (with items, sorted by date)  |
| `POST`   | `/purchases/`         | Create a purchase with line items                |
| `PUT`    | `/purchases/{id}`     | Update purchase header & replace all line items  |
| `DELETE` | `/purchases/{id}`     | Delete a purchase and its items (cascade)        |

---

## Environment Variables

| Variable         | Default              | Description                |
| ---------------- | -------------------- | -------------------------- |
| `APP_NAME`       | `SmartSpend API`     | Application display name   |
| `APP_VERSION`    | `1.0.0`              | Semantic version           |
| `DEBUG`          | `True`               | Enable SQL echo & debug    |
| `DB_HOST`        | `localhost`          | MySQL host                 |
| `DB_PORT`        | `3306`               | MySQL port                 |
| `DB_USER`        | `root`               | MySQL user                 |
| `DB_PASSWORD`    | —                    | MySQL password             |
| `DB_NAME`        | `smartspend`         | MySQL database name        |
| `CORS_ORIGINS`   | `localhost:3000`     | Allowed CORS origins       |

---

## License

This project is for personal / portfolio use. Feel free to fork and adapt.
