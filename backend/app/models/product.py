from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String(50), unique=True, nullable=True)
    name = Column(String(200), nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=True)
    brand_id = Column(Integer, ForeignKey('brands.id'), nullable=True)
    unit_type = Column(
        Enum("unit", "kg", "g", "liter", "ml", "bill", "session", "minute", "hour", name="unit_type_enum"),
        default="unit"
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    category = relationship('Category')
    brand = relationship('Brand')
    purchase_items = relationship("PurchaseItem", back_populates="product")
