from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String(50), unique=True, nullable=True)
    name = Column(String(200), nullable=False)
    category = Column(String(100))
    unit_type = Column(
        Enum("unit", "kg", "g", "liter", "ml", name="unit_type_enum"),
        default="unit"
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    purchase_items = relationship("PurchaseItem", back_populates="product")
