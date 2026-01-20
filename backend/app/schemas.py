from datetime import datetime
from pydantic import BaseModel

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
    date: datetime

    class Config:
        orm_mode = True 