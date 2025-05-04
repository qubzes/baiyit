import enum
from typing import List, Optional
from sqlalchemy import ARRAY, Enum as SQLEnum, Float, ForeignKey, Integer, String, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models import BaseModel
from app.models.user import User
from app.models.product import Product


class OrderStatus(enum.Enum):
    processing = "Processing"
    shipped = "Shipped"
    delivered = "Delivered"
    cancelled = "Cancelled"


class OrderItem(BaseModel):
    __tablename__ = "order_items"

    order_id: Mapped[str] = mapped_column(
        ForeignKey("orders.id"), nullable=False
    )
    product_id: Mapped[str] = mapped_column(
        ForeignKey("products.id"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    image: Mapped[str] = mapped_column(String, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship(Product)


class Order(BaseModel):
    __tablename__ = "orders"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"), nullable=False
    )
    total: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[OrderStatus] = mapped_column(
        SQLEnum(OrderStatus), nullable=False, default=OrderStatus.processing
    )
    
    # Relationships
    user = relationship(User, backref="orders")
    items = relationship(OrderItem, back_populates="order", cascade="all, delete-orphan")

    SEARCH_FIELDS = ["id", "status"]