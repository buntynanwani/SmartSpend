from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    category = Column(String(100))
    unit_type = Column(String(20), default="unit")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Handshake: 'product' property in PurchaseItem model
    purchase_items = relationship("PurchaseItem", back_populates="product")