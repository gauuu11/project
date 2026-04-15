from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from .database import Base


class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer)
    supplier_name = Column(String)
    quantity = Column(Integer)
    purchase_price = Column(Float)
    total_price = Column(Float)
    purchase_date = Column(DateTime, default=datetime.utcnow)


class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer)
    customer_name = Column(String)
    quantity = Column(Integer)
    sale_price = Column(Float)
    total_price = Column(Float)
    sale_date = Column(DateTime, default=datetime.utcnow)