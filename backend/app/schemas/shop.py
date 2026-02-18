from pydantic import BaseModel
from datetime import datetime


class ShopCreate(BaseModel):
    name: str


class ShopUpdate(BaseModel):
    name: str | None = None


class ShopResponse(BaseModel):
    id: int
    name: str
    created_at: datetime

    class Config:
        from_attributes = True
