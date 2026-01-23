from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

class ProductCreate(BaseModel):
    name: str
    quantity: int
    price: float

class PurchaseOrderResponse(BaseModel):
    id: int
    supplier_name: str
    product_id: int
    product_name: str
    quantity: int
    status: str
    order_date: Optional[str] = None

    class Config:
        orm_mode = True 


class SalesOrderCreate(BaseModel):
    customer_name: str
    email: EmailStr
    product_id: int
    quantity: int
    status: str


class SalesOrderResponse(BaseModel):
    id: int
    customer_name: str
    email: str
    product_id: int
    product_name: str
    quantity: int
    status: str
    order_date: Optional[str]

    class Config:
        orm_mode = True
