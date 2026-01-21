from datetime import datetime, timezone
from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String, Float, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class EleProducts(Base):
    __tablename__ = "ele_products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    image = Column(String)
    quantity = Column(Integer, default=0)
    price = Column(Float, default=0.0)

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)

    supplier_name = Column(String, nullable=False)

    product_id = Column(Integer, ForeignKey("ele_products.id"), nullable=False)
    product_name = Column(String, nullable=False)

    # order_date = Column(Date, server_default=func.current_date())
    order_date = Column(DateTime, default=datetime.utcnow)
    # order_date = Column(
    # DateTime(timezone=True),
    # default=lambda: datetime.now(timezone.utc)
    # )

    quantity = Column(Integer, nullable=False)

    status = Column(String, nullable=False) 