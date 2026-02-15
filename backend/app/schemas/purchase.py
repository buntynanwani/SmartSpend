from pydantic import BaseModel, Field
import datetime
from typing import List, Optional

# --- Items ---
class PurchaseItemCreate(BaseModel):
    product_id: int
    quantity: float
    price: float

class PurchaseItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: float
    unit_price: float
    subtotal: float

    class Config:
        from_attributes = True

# --- Purchase ---
class PurchaseCreate(BaseModel):
    user_id: int
    shop_id: int
    date: Optional[datetime.date] = None
    items: List[PurchaseItemCreate]

class PurchaseResponse(BaseModel):
    id: int
    user_id: int
    shop_id: int
    date: datetime.date
    total_amount: float
    items: List[PurchaseItemResponse]

    class Config:
        from_attributes = True