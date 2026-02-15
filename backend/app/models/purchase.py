from sqlalchemy import Column, Integer, ForeignKey, Date, DateTime, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False)

    date = Column(Date, nullable=False)

    delivery_cost = Column(DECIMAL(10, 2), default=0.00)
    discount = Column(DECIMAL(10, 2), default=0.00)
    total_amount = Column(DECIMAL(10, 2), default=0.00)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="purchases")
    shop = relationship("Shop", back_populates="purchases")
    items = relationship(
        "PurchaseItem",
        back_populates="purchase",
        cascade="all, delete"
    )
