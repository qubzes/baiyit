from datetime import datetime
from typing import Optional, List
from app.schemas import BaseRequest, BaseResponse, PaginatedRequest

class ProductBase:
    title: str
    description: str
    price: float
    original_price: Optional[float] = None
    discount: Optional[float] = None
    image: str
    rating: float
    category: Optional[str] = None
    featured: Optional[bool] = False
    specs: Optional[List[str]] = None


class ProductCreate(BaseRequest, ProductBase):
    pass


class ProductUpdate(BaseRequest):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    discount: Optional[float] = None
    image: Optional[str] = None
    rating: Optional[float] = None
    category: Optional[str] = None
    featured: Optional[bool] = None
    specs: Optional[List[str]] = None


class ProductResponse(BaseResponse, ProductBase):
    id: str
    created_at: datetime
    updated_at: datetime


class ProductPaginatedRequest(PaginatedRequest):
    category: Optional[str] = None
    featured: Optional[bool] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_rating: Optional[float] = None