import os
import sys
from typing import List

from .s3 import upload_image

# Add app/vendor to sys.path so vendored/site-packages are importable in Lambda
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "vendor"))

from fastapi import  FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from mangum import Mangum
from sqlalchemy import func

from .db import get_db
from .models import EleProducts, PurchaseOrder
from .schemas import ProductCreate, PurchaseOrderResponse

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://d11ll76vikdfdn.cloudfront.net"],  # or ["*"] for quick testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/products")
def create_product(
    name: str = Form(...),
    quantity: int = Form(...),
    price: float = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    image_url = upload_image(image)

    product = EleProducts(
        name=name,
        quantity=quantity,
        price=price,
        image=image_url
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product

@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    return db.query(EleProducts).all()

@app.delete("/products/{id}")
def delete_product(id: int, db: Session = Depends(get_db)):
    item = db.query(EleProducts).filter(EleProducts.id == id).first()
    db.delete(item)
    db.commit()
    return {"message": "Deleted"}

@app.put("/products/{id}")
def update_product(
    id: int,
    name: str = Form(None),
    quantity: int = Form(None),
    price: float = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    item = db.query(EleProducts).filter(EleProducts.id == id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Product not found")

    if name is not None:
        item.name = name

    if quantity is not None:
        item.quantity = quantity

    if price is not None:
        item.price = price

    if image:
        image_url = upload_image(image)
        item.image = image_url

    db.commit()
    db.refresh(item)

    return {
        "message": "Updated successfully",
        "product": {
            "id": item.id,
            "name": item.name,
            "image": item.image,
            "quantity": item.quantity,
            "price": item.price
        }
    }

@app.post("/purchase-orders", response_model=PurchaseOrderResponse)
def create_purchase_order(
    supplier_name: str = Form(...),
    product_id: int = Form(...),
    quantity: int = Form(...),
    status: str = Form(...),
    db: Session = Depends(get_db)
):
    product = db.query(EleProducts).filter(EleProducts.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    order = PurchaseOrder(
        supplier_name=supplier_name,
        product_id=product.id,
        product_name=product.name,
        quantity=quantity,
        status=status
    )

    db.add(order)

    # ✅ Auto-update product stock if delivered
    if status.lower() == "delivered":
        product.quantity += quantity

    db.commit()
    db.refresh(order)

    # return order
    return PurchaseOrderResponse.from_orm(order)

# @app.get("/purchase-orders", response_model=List[PurchaseOrderResponse])
# def get_purchase_orders(db: Session = Depends(get_db)):
#     return db.query(PurchaseOrder).order_by(PurchaseOrder.order_date.desc()).all()

@app.get("/purchase-orders", response_model=list[PurchaseOrderResponse])
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(PurchaseOrder).order_by(PurchaseOrder.id.desc()).all()

    return [PurchaseOrderResponse.from_orm(o) for o in orders]


@app.get("/purchase-orders/{id}", response_model=PurchaseOrderResponse)
def get_purchase_order(id: int, db: Session = Depends(get_db)):
    order = db.query(PurchaseOrder).filter(PurchaseOrder.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.put("/purchase-orders/{id}", response_model=PurchaseOrderResponse)
def update_purchase_order(
    id: int,
    supplier_name: str = Form(...),
    product_id: int = Form(...),
    quantity: int = Form(...),
    status: str = Form(...),
    db: Session = Depends(get_db)
):
    order = db.query(PurchaseOrder).filter(PurchaseOrder.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    product = db.query(EleProducts).filter(EleProducts.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check previous status
    was_delivered = order.status.lower() == "delivered"

    order.supplier_name = supplier_name
    order.product_id = product.id
    order.product_name = product.name
    order.quantity = quantity
    order.status = status

    # If status changed to delivered → update stock
    if not was_delivered and status.lower() == "delivered":
        product.quantity += quantity

    db.commit()
    db.refresh(order)
    return order

@app.delete("/purchase-orders/{order_id}")
def delete_purchase_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(PurchaseOrder).filter(PurchaseOrder.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    db.delete(order)
    db.commit()

    return {"message": "Purchase order deleted successfully"}

handler = Mangum(app)
