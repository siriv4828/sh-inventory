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
from .models import EleProducts, PurchaseOrder, SalesOrder
from .schemas import InventorySummary, ProductCreate, PurchaseOrderResponse, SalesOrderCreate, SalesOrderResponse

app = FastAPI()

# CORS Middleware
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def serialize_order(o):
    return {
        "id": o.id,
        "supplier_name": o.supplier_name,
        "product_id": o.product_id,
        "product_name": o.product_name,
        "quantity": o.quantity,
        "status": o.status,
        "order_date": o.order_date.isoformat() if o.order_date else None
    }

def serialize_sale(o):
    return {
        "id": o.id,
        "customer_name": o.customer_name,
        "email": o.email,
        "product_id": o.product_id,
        "product_name": o.product_name,
        "quantity": o.quantity,
        "status": o.status,
        "order_date": o.order_date.isoformat() if o.order_date else None
    }


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

@app.get("/summary", response_model=InventorySummary)
def get_inventory_summary(db: Session = Depends(get_db)):
    result = db.query(
        func.coalesce(func.sum(EleProducts.quantity), 0).label("total_quantity"),
        func.coalesce(func.sum(EleProducts.quantity * EleProducts.price), 0).label("total_value")
    ).one()

    return {
        "total_quantity": int(result.total_quantity),
        "total_value": float(result.total_value)
    }

@app.get("/bargraph")
def get_inventory_bargraph(db: Session = Depends(get_db)):
    products = db.query(EleProducts.name, EleProducts.quantity).all()

    return [
        {
            "name": p.name,
            "quantity": p.quantity
        }
        for p in products
    ]

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
   
    return serialize_order(order)


@app.get("/purchase-orders", response_model=list[PurchaseOrderResponse])
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(PurchaseOrder).order_by(PurchaseOrder.id.desc()).all()

    result = []
    return [serialize_order(o) for o in orders]


@app.get("/purchase-orders/{id}", response_model=PurchaseOrderResponse)
def get_purchase_order(id: int, db: Session = Depends(get_db)):
    order = db.query(PurchaseOrder).filter(PurchaseOrder.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return serialize_order(order)

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
    return serialize_order(order)

@app.delete("/purchase-orders/{order_id}")
def delete_purchase_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(PurchaseOrder).filter(PurchaseOrder.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    db.delete(order)
    db.commit()

    return {"message": "Purchase order deleted successfully"}

@app.post("/sales", response_model=SalesOrderResponse)
def create_sale(
    customer_name: str = Form(...),
    email: str = Form(...),
    product_id: int = Form(...),
    quantity: int = Form(...),
    status: str = Form(...),
    db: Session = Depends(get_db)
):
    product = db.query(EleProducts).filter(EleProducts.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if status == "delivered" and product.quantity < quantity:
        raise HTTPException(status_code=400, detail="Not enough stock")

    sale = SalesOrder(
        customer_name=customer_name,
        email=email,
        product_id=product.id,
        product_name=product.name,
        quantity=quantity,
        status=status
    )

    db.add(sale)

    # 🔥 Decrease stock when delivered
    if status == "delivered":
        product.quantity -= quantity

    db.commit()
    db.refresh(sale)

    return serialize_sale(sale)

@app.get("/sales", response_model=list[SalesOrderResponse])
def get_sales(db: Session = Depends(get_db)):
    sales = db.query(SalesOrder).order_by(SalesOrder.id.desc()).all()
    return [serialize_sale(s) for s in sales]

@app.get("/sales/{id}", response_model=SalesOrderResponse)
def get_sale(id: int, db: Session = Depends(get_db)):

    sale = db.query(SalesOrder).filter(SalesOrder.id == id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sales order not found")

    return serialize_sale(sale)

@app.put("/sales/{id}", response_model=SalesOrderResponse)
def update_sale_status(id: int, status: str, db: Session = Depends(get_db)):

    sale = db.query(SalesOrder).filter(SalesOrder.id == id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    product = db.query(EleProducts).filter(EleProducts.id == sale.product_id).first()

    # If changing to delivered → reduce stock
    if sale.status != "delivered" and status == "delivered":
        if product.quantity < sale.quantity:
            raise HTTPException(status_code=400, detail="Not enough stock")
        product.quantity -= sale.quantity

    sale.status = status
    db.commit()
    db.refresh(sale)

    return serialize_sale(sale)

@app.delete("/sales/{id}")
def delete_sale(id: int, db: Session = Depends(get_db)):
    sale = db.query(SalesOrder).filter(SalesOrder.id == id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Not found")

    db.delete(sale)
    db.commit()
    return {"message": "Deleted successfully"}

@app.get("/linegraph")
def sales_monthly(db: Session = Depends(get_db)):

    data = (
        db.query(
            func.date_trunc('month', SalesOrder.order_date).label("month"),
            SalesOrder.product_name,
            func.sum(SalesOrder.quantity).label("total_quantity")
        )
        .group_by("month", SalesOrder.product_name)
        .order_by("month")
        .all()
    )

    return [
        {
            "month": row.month.strftime("%Y-%m"),
            "product": row.product_name,
            "quantity": row.total_quantity
        }
        for row in data
    ]
handler = Mangum(app)
