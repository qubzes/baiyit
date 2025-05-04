from datetime import datetime
from typing import List, Optional
from pydantic import Field
from app.models.order import OrderStatus
from app.schemas import BaseRequest, BaseResponse, PaginatedRequest


class OrderItemBase:
    product_id: str
    quantity: int = Field(gt=0)


class OrderItemCreate(BaseRequest, OrderItemBase):
    pass


class OrderItemResponse(BaseResponse, OrderItemBase):
    title: str
    price: float
    image: str


class OrderCreate(BaseRequest):
    items: List[OrderItemCreate]


class OrderResponse(BaseResponse):
    id: str
    user_id: str
    total: float
    status: OrderStatus
    items: Optional[List[OrderItemResponse]]
    created_at: datetime
    updated_at: datetime


class OrderPaginatedRequest(PaginatedRequest):
    status: Optional[OrderStatus] = None


# This needs work like some field removed form order item and support for Update will be added later