from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/purchase", tags=["Purchase"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_purchase(purchase: schemas.PurchaseCreate, db: Session = Depends(get_db)):

    if purchase.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0")

    total = purchase.quantity * purchase.purchase_price

    new_purchase = models.Purchase(
        product_id=purchase.product_id,
        supplier_name=purchase.supplier_name,
        quantity=purchase.quantity,
        purchase_price=purchase.purchase_price,
        total_price=total
    )

    db.add(new_purchase)
    db.commit()
    db.refresh(new_purchase)

    return {
        "message": "Purchase created successfully",
        "data": new_purchase
    }


@router.get("/", status_code=status.HTTP_200_OK)
def get_all_purchases(db: Session = Depends(get_db)):

    purchases = db.query(models.Purchase).all()

    return {
        "message": "All purchases fetched successfully",
        "data": purchases
    }

@router.get("/{purchase_id}", status_code=status.HTTP_200_OK)
def get_purchase(purchase_id: int, db: Session = Depends(get_db)):

    purchase = db.query(models.Purchase).filter(models.Purchase.id == purchase_id).first()

    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")

    return {
        "message": "Purchase fetched successfully",
        "data": purchase
    }


@router.put("/{purchase_id}", status_code=status.HTTP_200_OK)
def update_purchase(purchase_id: int, purchase: schemas.PurchaseCreate, db: Session = Depends(get_db)):

    existing = db.query(models.Purchase).filter(models.Purchase.id == purchase_id).first()

    if not existing:
        raise HTTPException(status_code=404, detail="Purchase not found")

    if purchase.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0")

    existing.product_id = purchase.product_id
    existing.supplier_name = purchase.supplier_name
    existing.quantity = purchase.quantity
    existing.purchase_price = purchase.purchase_price
    existing.total_price = purchase.quantity * purchase.purchase_price

    db.commit()
    db.refresh(existing)

    return {
        "message": "Purchase updated successfully",
        "data": existing
    }


@router.delete("/{purchase_id}", status_code=status.HTTP_200_OK)
def delete_purchase(purchase_id: int, db: Session = Depends(get_db)):

    purchase = db.query(models.Purchase).filter(models.Purchase.id == purchase_id).first()

    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")

    db.delete(purchase)
    db.commit()

    return {
        "message": "Purchase deleted successfully"
    }