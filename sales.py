from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/sales", tags=["Sales"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_sale(sale: schemas.SaleCreate, db: Session = Depends(get_db)):

    if sale.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0")

    total = sale.quantity * sale.sale_price

    new_sale = models.Sale(
        product_id=sale.product_id,
        customer_name=sale.customer_name,
        quantity=sale.quantity,
        sale_price=sale.sale_price,
        total_price=total
    )

    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)

    return {
        "message": "Sale created successfully",
        "data": new_sale
    }


@router.get("/", status_code=status.HTTP_200_OK)
def get_all_sales(db: Session = Depends(get_db)):

    sales = db.query(models.Sale).all()

    return {
        "message": "All sales fetched successfully",
        "data": sales
    }



@router.get("/{sale_id}", status_code=status.HTTP_200_OK)
def get_sale(sale_id: int, db: Session = Depends(get_db)):

    sale = db.query(models.Sale).filter(models.Sale.id == sale_id).first()

    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    return {
        "message": "Sale fetched successfully",
        "data": sale
    }


@router.put("/{sale_id}", status_code=status.HTTP_200_OK)
def update_sale(sale_id: int, sale: schemas.SaleCreate, db: Session = Depends(get_db)):

    existing = db.query(models.Sale).filter(models.Sale.id == sale_id).first()

    if not existing:
        raise HTTPException(status_code=404, detail="Sale not found")

    if sale.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0")

    existing.product_id = sale.product_id
    existing.customer_name = sale.customer_name
    existing.quantity = sale.quantity
    existing.sale_price = sale.sale_price
    existing.total_price = sale.quantity * sale.sale_price

    db.commit()
    db.refresh(existing)

    return {
        "message": "Sale updated successfully",
        "data": existing
    }


@router.delete("/{sale_id}", status_code=status.HTTP_200_OK)
def delete_sale(sale_id: int, db: Session = Depends(get_db)):

    sale = db.query(models.Sale).filter(models.Sale.id == sale_id).first()

    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    db.delete(sale)
    db.commit()

    return {
        "message": "Sale deleted successfully"
    }