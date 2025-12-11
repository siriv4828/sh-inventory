from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from mangum import Mangum
from sqlalchemy import func

from .db import get_db
from .models import Products
from .schemas import ProductCreate

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://ele-inventory-app.s3-website.ap-south-1.amazonaws.com"],  # or ["*"] for quick testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🟩 Get All Products
@app.get("/api/products")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Products).all()
    return products

# 🟩 Create Product
@app.post("/api/products")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    new_product = Products(
        name=product.name,
        quantity=product.quantity,
        price=product.price
    )
    print(f"Creating product: {new_product.name}, Quantity: {new_product.quantity}, Price: {new_product.price}")
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

# 🟩 Update Product
@app.put("/api/products/{product_id}")
def update_product(product_id: int, updated_product: ProductCreate, db: Session = Depends(get_db)):
    product = db.query(Products).filter(Products.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.name = updated_product.name
    product.quantity = updated_product.quantity
    product.price = updated_product.price

    db.commit()
    db.refresh(product)
    return product

# 🟩 Delete Product
@app.delete("/api/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Products).filter(Products.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}

# 🟩 Product Summary
@app.get("/api/products/summary")
def products_summary(db: Session = Depends(get_db)):
    total_count = db.query(func.sum(Products.quantity)).scalar() or 0
    total_value = db.query(func.sum(Products.quantity * Products.price)).scalar() or 0.0
    print(f"Total Count: {total_count}, Total Value: {total_value}")
    return {"total_count": int(total_count), "total_value": float(total_value)}

# Lambda Handler
handler = Mangum(app)
