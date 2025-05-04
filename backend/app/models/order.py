import enum
from typing import List

from sqlalchemy import Enum as SQLEnum
from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import BaseModel
from app.models.product import Product
from app.models.user import User


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

    order: Mapped["Order"] = relationship("Order", back_populates="items")
    product: Mapped[Product] = relationship(Product)


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
    user: Mapped[User] = relationship(User, back_populates="orders")
    items: Mapped[List[OrderItem]] = relationship(
        OrderItem, back_populates="order", cascade="all, delete-orphan"
    )

    SEARCH_FIELDS = ["id", "status"]
