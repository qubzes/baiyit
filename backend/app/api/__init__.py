from fastapi import APIRouter

from .auth import router as auth_router
from .product import router as product_router
from .order import router as order_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(product_router)
api_router.include_router(order_router)

