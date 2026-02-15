from sqlalchemy import Column, Integer, ForeignKey, DECIMAL
from sqlalchemy.orm import relationship
from app.core.database import Base

class PurchaseItem(Base):
    __tablename__ = "purchase_items"
    id = Column(Integer, primary_key=True, index=True)
    purchase_id = Column(Integer, ForeignKey("purchases.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)

    # Using DECIMAL for precise money and weight math
    quantity = Column(DECIMAL(10, 3), nullable=False)
    unit_price = Column(DECIMAL(10, 2), nullable=False)
    subtotal = Column(DECIMAL(10, 2), nullable=False)

    # Handshakes
    purchase = relationship("Purchase", back_populates="items")
    product = relationship("Product", back_populates="purchase_items")