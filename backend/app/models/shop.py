from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Shop(Base):
    __tablename__ = "shops"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Handshake: 'shop' property in Purchase model
    purchases = relationship("Purchase", back_populates="shop", cascade="all, delete")