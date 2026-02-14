"""
Transaction API endpoints — raw SQL with mysql-connector-python.
"""

from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime

from app.core.database import get_connection
from app.schemas.schemas import (
    TransactionCreate,
    TransactionResponse,
    UserCreate,
    UserResponse,
    ProductCreate,
    ProductResponse,
)

router = APIRouter()


# ── Helper ───────────────────────────────────────────────────

def _row_to_dict(cursor, row):
    """Convert a single DB row to a dict using cursor column names."""
    return dict(zip(cursor.column_names, row))


# ── User Endpoints ───────────────────────────────────────────
# (Must be defined BEFORE /{transaction_id} to avoid route conflicts)


@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate):
    """Create a new user."""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM users WHERE email = %s", (payload.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")

        cursor.execute(
            "INSERT INTO users (name, email) VALUES (%s, %s)",
            (payload.name, payload.email),
        )
        conn.commit()
        new_id = cursor.lastrowid

        cursor.execute(
            "SELECT id, name, email, created_at FROM users WHERE id = %s", (new_id,)
        )
        row = _row_to_dict(cursor, cursor.fetchone())
        return row
    finally:
        cursor.close()
        conn.close()


@router.get("/users", response_model=List[UserResponse])
def get_users():
    """Retrieve all users."""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, name, email, created_at FROM users ORDER BY name")
        rows = cursor.fetchall()
        return [_row_to_dict(cursor, r) for r in rows]
    finally:
        cursor.close()
        conn.close()


# ── Product Endpoints ────────────────────────────────────────
# (Must be defined BEFORE /{transaction_id} to avoid route conflicts)


@router.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductCreate):
    """Create a new product."""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO products (name, category) VALUES (%s, %s)",
            (payload.name, payload.category),
        )
        conn.commit()
        new_id = cursor.lastrowid

        cursor.execute(
            "SELECT id, name, category, created_at FROM products WHERE id = %s",
            (new_id,),
        )
        row = _row_to_dict(cursor, cursor.fetchone())
        return row
    finally:
        cursor.close()
        conn.close()


@router.get("/products", response_model=List[ProductResponse])
def get_products():
    """Retrieve all products."""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT id, name, category, created_at FROM products ORDER BY name"
        )
        rows = cursor.fetchall()
        return [_row_to_dict(cursor, r) for r in rows]
    finally:
        cursor.close()
        conn.close()


# ── Transaction Endpoints ────────────────────────────────────


@router.post("/", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(payload: TransactionCreate):
    """Create a new transaction record."""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Validate user exists
        cursor.execute("SELECT id FROM users WHERE id = %s", (payload.user_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="User not found")

        # Validate product exists
        cursor.execute("SELECT id FROM products WHERE id = %s", (payload.product_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Product not found")

        total_price = payload.quantity * payload.unit_price

        cursor.execute(
            """
            INSERT INTO transactions (user_id, product_id, shop, date, quantity, unit_price, total_price)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                payload.user_id,
                payload.product_id,
                payload.shop,
                payload.date,
                payload.quantity,
                payload.unit_price,
                total_price,
            ),
        )
        conn.commit()
        new_id = cursor.lastrowid

        # Fetch the created row
        cursor.execute(
            "SELECT id, user_id, product_id, shop, date, quantity, unit_price, total_price, created_at "
            "FROM transactions WHERE id = %s",
            (new_id,),
        )
        row = _row_to_dict(cursor, cursor.fetchone())
        return row
    finally:
        cursor.close()
        conn.close()


@router.get("/", response_model=List[TransactionResponse])
def get_transactions(skip: int = 0, limit: int = 100):
    """Retrieve all transactions with user and product details."""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT
                t.id, t.user_id, t.product_id, t.shop, t.date,
                t.quantity, t.unit_price, t.total_price, t.created_at,
                u.id   AS u_id,   u.name  AS u_name,  u.email AS u_email, u.created_at AS u_created_at,
                p.id   AS p_id,   p.name  AS p_name,  p.category AS p_category, p.created_at AS p_created_at
            FROM transactions t
            JOIN users    u ON t.user_id    = u.id
            JOIN products p ON t.product_id = p.id
            ORDER BY t.date DESC
            LIMIT %s OFFSET %s
            """,
            (limit, skip),
        )
        rows = cursor.fetchall()
        columns = cursor.column_names
        results = []
        for row in rows:
            d = dict(zip(columns, row))
            results.append({
                "id": d["id"],
                "user_id": d["user_id"],
                "product_id": d["product_id"],
                "shop": d["shop"],
                "date": d["date"],
                "quantity": d["quantity"],
                "unit_price": d["unit_price"],
                "total_price": d["total_price"],
                "created_at": d["created_at"],
                "user": {
                    "id": d["u_id"],
                    "name": d["u_name"],
                    "email": d["u_email"],
                    "created_at": d["u_created_at"],
                },
                "product": {
                    "id": d["p_id"],
                    "name": d["p_name"],
                    "category": d["p_category"],
                    "created_at": d["p_created_at"],
                },
            })
        return results
    finally:
        cursor.close()
        conn.close()


@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: int):
    """Retrieve a single transaction by ID."""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT
                t.id, t.user_id, t.product_id, t.shop, t.date,
                t.quantity, t.unit_price, t.total_price, t.created_at,
                u.id   AS u_id,   u.name  AS u_name,  u.email AS u_email, u.created_at AS u_created_at,
                p.id   AS p_id,   p.name  AS p_name,  p.category AS p_category, p.created_at AS p_created_at
            FROM transactions t
            JOIN users    u ON t.user_id    = u.id
            JOIN products p ON t.product_id = p.id
            WHERE t.id = %s
            """,
            (transaction_id,),
        )
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Transaction not found")

        d = dict(zip(cursor.column_names, row))
        return {
            "id": d["id"],
            "user_id": d["user_id"],
            "product_id": d["product_id"],
            "shop": d["shop"],
            "date": d["date"],
            "quantity": d["quantity"],
            "unit_price": d["unit_price"],
            "total_price": d["total_price"],
            "created_at": d["created_at"],
            "user": {
                "id": d["u_id"],
                "name": d["u_name"],
                "email": d["u_email"],
                "created_at": d["u_created_at"],
            },
            "product": {
                "id": d["p_id"],
                "name": d["p_name"],
                "category": d["p_category"],
                "created_at": d["p_created_at"],
            },
        }
    finally:
        cursor.close()
        conn.close()


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(transaction_id: int):
    """Delete a transaction by ID."""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM transactions WHERE id = %s", (transaction_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Transaction not found")
        cursor.execute("DELETE FROM transactions WHERE id = %s", (transaction_id,))
        conn.commit()
    finally:
        cursor.close()
        conn.close()
