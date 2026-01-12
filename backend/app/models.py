from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class EleProducts(Base):
    __tablename__ = "ele_products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    image = Column(String)
    quantity = Column(Integer, default=0)
    price = Column(Float, default=0.0)
