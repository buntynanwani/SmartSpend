from pydantic import BaseModel
from datetime import datetime
from typing import List

# -------- Purchase Items --------

class PurchaseItemCreate(BaseModel):
    product_id: int
    quantity: float
    price: float # We keep 'price' here because it's what the user types

class PurchaseItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: float
    unit_price: float  # Matches the DB column name
    subtotal: float    # Now you can see the calculation result!

    class Config:
        from_attributes = True

# -------- Purchase --------

class PurchaseCreate(BaseModel):
    user_id: int
    shop_id: int
    date: str | None = None
    items: List[PurchaseItemCreate]

class PurchaseResponse(BaseModel):
    id: int
    user_id: int
    shop_id: int
    date: datetime      # Use 'date' to match your Purchase model
    total_amount: float # Added this so you can see the receipt total
    items: List[PurchaseItemResponse]

    class Config:
        from_attributes = True