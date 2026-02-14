"""
Pydantic schemas for request/response validation.
"""

from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from typing import Optional


# ── User Schemas ─────────────────────────────────────────────

class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr


class UserCreate(UserBase):
    pass


class UserResponse(UserBase):
    id: int
    created_at: datetime


# ── Product Schemas ──────────────────────────────────────────

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    category: Optional[str] = Field(None, max_length=100)


class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: int
    created_at: datetime


# ── Transaction Schemas ──────────────────────────────────────

class TransactionBase(BaseModel):
    user_id: int
    product_id: int
    shop: str = Field(..., min_length=1, max_length=200)
    date: date
    quantity: int = Field(..., ge=1)
    unit_price: float = Field(..., gt=0)


class TransactionCreate(TransactionBase):
    pass


class TransactionResponse(TransactionBase):
    id: int
    total_price: float
    created_at: datetime
    user: Optional[UserResponse] = None
    product: Optional[ProductResponse] = None


# ── Transaction with nested details (for GET responses) ─────

class TransactionDetail(BaseModel):
    id: int
    user_name: str
    product_name: str
    shop: str
    date: date
    quantity: int
    unit_price: float
    total_price: float
    created_at: datetime
