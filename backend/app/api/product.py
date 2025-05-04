from typing import Annotated, Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.middleware import has_permission
from app.models.product import Product
from app.models.user import User
from app.schemas import PaginatedResponse
from app.schemas.product import (
    ProductCreate,
    ProductPaginatedRequest,
    ProductResponse,
    ProductUpdate,
)

router = APIRouter(prefix="/products", tags=["products"])


@router.post("/", response_model=ProductResponse)
async def create_product(
    product_data: ProductCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(has_permission("create", "product")),
) -> ProductResponse:
    """Create a new product (admin only)"""
    try:
        product = Product(**product_data.model_dump())
        await product.save(db)
        return ProductResponse(**product.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: str, db: AsyncSession = Depends(get_db)
) -> ProductResponse:
    """Get a product by ID"""
    product = await Product.get(db, id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return ProductResponse(**product.model_dump())


@router.get("/", response_model=PaginatedResponse[ProductResponse])
async def list_products(
    request: Annotated[ProductPaginatedRequest, Depends()],
    db: AsyncSession = Depends(get_db),
) -> PaginatedResponse[ProductResponse]:
    """List products with filtering and pagination"""
    try:
        filters: dict[str, Any] = {}
        if request.category:
            filters["category"] = request.category
        if request.featured is not None:
            filters["featured"] = request.featured

        products, total = await Product.get_all(
            db,
            page=request.page,
            size=request.size,
            sort_by=request.sort_by,
            descending=request.descending,
            use_or=request.use_or,
            filters=filters,
            search=request.search,
        )

        if (
            request.min_price is not None
            or request.max_price is not None
            or request.min_rating is not None
        ):
            filtered_products: List[Product] = []
            for product in products:
                if (
                    (
                        request.min_price is None
                        or product.price >= request.min_price
                    )
                    and (
                        request.max_price is None
                        or product.price <= request.max_price
                    )
                    and (
                        request.min_rating is None
                        or product.rating >= request.min_rating
                    )
                ):
                    filtered_products.append(product)
            products = filtered_products

        pages = (total + request.size - 1) // request.size

        return PaginatedResponse(
            data=[ProductResponse(**p.model_dump()) for p in products],
            total=total,
            page=request.page,
            pages=pages,
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(has_permission("update", "product")),
) -> ProductResponse:
    """Update a product (admin only)"""
    product = await Product.get(db, id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = {
        k: v for k, v in product_data.model_dump().items() if v is not None
    }
    for key, value in update_data.items():
        setattr(product, key, value)

    await product.save(db)
    return ProductResponse(**product.model_dump())


@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(has_permission("delete", "product")),
) -> dict[str, str]:
    """Delete a product (admin only)"""
    product = await Product.get(db, id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    await product.delete(db)
    return {"message": "Product deleted successfully"}
