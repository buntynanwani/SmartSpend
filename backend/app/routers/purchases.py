from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.database import get_db
from app.models.purchase import Purchase
from app.models.purchase_item import PurchaseItem
from app.models.user import User
from app.models.shop import Shop
from app.models.product import Product
from app.schemas.purchase import PurchaseCreate, PurchaseResponse

router = APIRouter()

@router.get("/", response_model=list[PurchaseResponse])
def get_purchases(db: Session = Depends(get_db)):
    """Retrieve all purchases from the database."""
    return db.query(Purchase).all()

@router.post("/", response_model=PurchaseResponse)
def create_purchase(purchase: PurchaseCreate, db: Session = Depends(get_db)):
    """Create a new purchase with multiple items (Atomic Transaction)."""
    
    # 1. Validation
    user = db.query(User).filter(User.id == purchase.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    shop = db.query(Shop).filter(Shop.id == purchase.shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")

    # 2. Create the Purchase Header
    db_purchase = Purchase(
        user_id=purchase.user_id,
        shop_id=purchase.shop_id,
        date=datetime.utcnow()
    )
    
    db.add(db_purchase)
    db.flush() # Secure the ID for child items

    # 3. Create the Purchase Items & Calculate Totals
    total_receipt_amount = 0
    for item in purchase.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            db.rollback()
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")

        calc_subtotal = item.quantity * item.price
        total_receipt_amount += calc_subtotal

        db_item = PurchaseItem(
            purchase_id=db_purchase.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.price,
            subtotal=calc_subtotal
        )
        db.add(db_item)

    # 4. Update total amount in the header
    db_purchase.total_amount = total_receipt_amount

    # 5. Final Commit
    db.commit()
    db.refresh(db_purchase)

    return db_purchase