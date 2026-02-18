from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.core.database import get_db
from app.models.shop import Shop
from app.schemas.shop import ShopCreate, ShopUpdate, ShopResponse

router = APIRouter()


@router.get("/", response_model=list[ShopResponse])
def get_shops(db: Session = Depends(get_db)):
    return db.query(Shop).all()


@router.post("/", response_model=ShopResponse)
def create_shop(shop: ShopCreate, db: Session = Depends(get_db)):
    db_shop = Shop(name=shop.name)

    try:
        db.add(db_shop)
        db.commit()
        db.refresh(db_shop)
        return db_shop

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Shop with this name already exists."
        )


@router.put("/{shop_id}", response_model=ShopResponse)
def update_shop(shop_id: int, shop: ShopUpdate, db: Session = Depends(get_db)):
    db_shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not db_shop:
        raise HTTPException(status_code=404, detail="Shop not found")

    update_data = shop.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_shop, field, value)

    try:
        db.commit()
        db.refresh(db_shop)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Shop with this name already exists.")

    return db_shop


@router.delete("/{shop_id}")
def delete_shop(shop_id: int, db: Session = Depends(get_db)):
    db_shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not db_shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    db.delete(db_shop)
    db.commit()
    return {"detail": "Shop deleted"}
