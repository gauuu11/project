from pydantic import BaseModel


class PurchaseCreate(BaseModel):
    product_id: int
    supplier_name: str
    quantity: int
    purchase_price: float


class SaleCreate(BaseModel):
    product_id: int
    customer_name: str
    quantity: int
    sale_price: float