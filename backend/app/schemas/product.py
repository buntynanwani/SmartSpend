from pydantic import BaseModel
from datetime import datetime
from typing import Literal, Optional

UnitType = Literal["unit", "kg", "g", "liter", "ml", "bill", "session", "minute", "hour"]


class ProductCreate(BaseModel):
    name: str
    reference: str | None = None
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    unit_type: UnitType | None = None


class ProductUpdate(BaseModel):
    name: str | None = None
    reference: str | None = None
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    unit_type: UnitType | None = None


class ProductResponse(BaseModel):
    id: int
    reference: str | None
    name: str
    category_id: int | None
    brand_id: int | None
    unit_type: UnitType | None
    created_at: datetime

    class Config:
        from_attributes = True
