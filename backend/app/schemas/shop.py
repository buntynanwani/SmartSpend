from pydantic import BaseModel
from datetime import datetime


class ShopCreate(BaseModel):
    name: str


class ShopResponse(BaseModel):
    id: int
    name: str
    created_at: datetime

    class Config:
        from_attributes = True
