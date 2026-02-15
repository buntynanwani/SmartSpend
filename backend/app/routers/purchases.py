from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

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
    return db.query(Purchase).all()

@router.post("/", response_model=PurchaseResponse)
def create_purchase(purchase: PurchaseCreate, db: Session = Depends(get_db)):
    db_purchase = Purchase(
        user_id=purchase.user_id,
        shop_id=purchase.shop_id,
        date=purchase.date or date.today()
    )
    db.add(db_purchase)
    db.flush()

    total = 0
    for item in purchase.items:
        sub = float(item.quantity) * float(item.price)
        total += sub
        db.add(PurchaseItem(
            purchase_id=db_purchase.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.price,
            subtotal=sub
        ))
    
    db_purchase.total_amount = total
    db.commit()
    db.refresh(db_purchase)
    return db_purchase

@router.put("/{purchase_id}", response_model=PurchaseResponse)
def update_purchase(purchase_id: int, purchase: PurchaseCreate, db: Session = Depends(get_db)):
    db_purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
    if not db_purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")

    db_purchase.user_id = purchase.user_id
    db_purchase.shop_id = purchase.shop_id
    if purchase.date:
        db_purchase.date = purchase.date

    # Clean old items
    db.query(PurchaseItem).filter(PurchaseItem.purchase_id == purchase_id).delete()
    
    total = 0
    for item in purchase.items:
        sub = float(item.quantity) * float(item.price)
        total += sub
        db.add(PurchaseItem(
            purchase_id=db_purchase.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.price,
            subtotal=sub
        ))

    db_purchase.total_amount = total
    db.commit()
    db.refresh(db_purchase)
    return db_purchase

@router.delete("/{purchase_id}", status_code=204)
def delete_purchase(purchase_id: int, db: Session = Depends(get_db)):
    purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    
    db.query(PurchaseItem).filter(PurchaseItem.purchase_id == purchase_id).delete()
    db.delete(purchase)
    db.commit()
    return None