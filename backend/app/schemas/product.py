from pydantic import BaseModel
from datetime import datetime


class ProductCreate(BaseModel):
    name: str
    category: str | None = None
    unit_type: str | None = None


class ProductResponse(BaseModel):
    id: int
    name: str
    category: str | None
    unit_type: str | None
    created_at: datetime

    class Config:
        from_attributes = True
