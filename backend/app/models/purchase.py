from sqlalchemy import Column, Integer, ForeignKey, Date, Float, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class Purchase(Base):
    __tablename__ = "purchases"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    shop_id = Column(Integer, ForeignKey("shops.id"))
    date = Column(Date)
    total_amount = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Handshakes: Points back to the property names in User, Shop, and PurchaseItem
    user = relationship("User", back_populates="purchases")
    shop = relationship("Shop", back_populates="purchases")
    items = relationship("PurchaseItem", back_populates="purchase", cascade="all, delete-orphan")