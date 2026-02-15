from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.core.database import get_db
from app.models.shop import Shop
from app.schemas.shop import ShopCreate, ShopResponse

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
