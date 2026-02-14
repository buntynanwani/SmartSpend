# SmartSpend

> **Personal Expense Tracking System** — Full-stack web application for recording, viewing, and analysing daily expenses.

![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-teal?logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)

---

## Project Structure

```
SmartSpend/
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── api/             # API route handlers
│   │   │   └── transactions.py
│   │   ├── core/            # Configuration & database
│   │   │   ├── config.py
│   │   │   └── database.py
│   │   ├── models/          # SQLAlchemy ORM models
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   └── transaction.py
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   │   └── schemas.py
│   │   └── main.py          # FastAPI entry point
│   ├── .env                 # Environment variables (not committed)
│   ├── .env.example         # Template for environment variables
│   └── requirements.txt     # Python dependencies
├── frontend/                # React application
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Header.js
│   │   │   ├── TransactionForm.js
│   │   │   └── TransactionList.js
│   │   ├── services/        # API service layer
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── database/                # SQL scripts
│   └── init.sql             # Schema & seed data
├── powerbi/                 # Power BI reports & dashboards
├── docs/                    # Documentation & architecture notes
├── .gitignore
└── README.md
```

---

## Tech Stack

| Layer      | Technology                  |
| ---------- | --------------------------- |
| Backend    | FastAPI (Python 3.11+)      |
| Database   | MySQL 8                     |
| ORM        | SQLAlchemy 2.0              |
| Frontend   | React 18 (JavaScript)       |
| HTTP       | Axios                       |
| Analytics  | Power BI *(planned)*        |

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

### 3. Backend

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

Edit `backend/.env` with your MySQL credentials:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smartspend
```

Start the API server:

```bash
uvicorn backend.app.main:app --reload --port 8000
```

API docs available at **http://localhost:8000/docs**

### 4. Frontend

```bash
cd frontend
npm install
npm start
```

App opens at **http://localhost:3000**

---

## API Endpoints

| Method   | Endpoint                    | Description              |
| -------- | --------------------------- | ------------------------ |
| `GET`    | `/`                         | Health / app info        |
| `GET`    | `/health`                   | Health check             |
| `POST`   | `/transactions/`            | Create a transaction     |
| `GET`    | `/transactions/`            | List all transactions    |
| `GET`    | `/transactions/{id}`        | Get transaction by ID    |
| `DELETE` | `/transactions/{id}`        | Delete a transaction     |
| `POST`   | `/transactions/users`       | Create a user            |
| `GET`    | `/transactions/users`       | List all users           |
| `POST`   | `/transactions/products`    | Create a product         |
| `GET`    | `/transactions/products`    | List all products        |

---

## Environment Variables

| Variable         | Default         | Description                |
| ---------------- | --------------- | -------------------------- |
| `APP_NAME`       | SmartSpend API  | Application display name   |
| `APP_VERSION`    | 1.0.0           | Semantic version           |
| `DEBUG`          | True            | Enable SQL echo & debug    |
| `DB_HOST`        | localhost       | MySQL host                 |
| `DB_PORT`        | 3306            | MySQL port                 |
| `DB_USER`        | root            | MySQL user                 |
| `DB_PASSWORD`    | —               | MySQL password             |
| `DB_NAME`        | smartspend      | MySQL database name        |
| `CORS_ORIGINS`   | localhost:3000  | Allowed CORS origins       |

---

## License

This project is for personal / portfolio use. Feel free to fork and adapt.
