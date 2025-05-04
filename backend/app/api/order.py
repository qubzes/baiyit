from typing import Annotated, Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.middleware import has_permission
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from app.models.user import User
from app.schemas import PaginatedResponse
from app.schemas.order import (
    OrderCreate,
    OrderPaginatedRequest,
    OrderResponse,
)

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/", response_model=OrderResponse)
async def create_order(
    order_data: OrderCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(has_permission("create", "order")),
) -> OrderResponse:
    """Create a new order for the current user"""
    try:
        total = 0
        order_items: List[dict[str, Any]] = []

        for item_data in order_data.items:
            product = await Product.get(db, id=item_data.product_id)
            if not product:
                raise HTTPException(
                    status_code=404,
                    detail=f"Product {item_data.product_id} not found",
                )

            price = (
                product.discount_price
                if product.discount_price
                else product.price
            )
            item_total = price * item_data.quantity
            total += item_total

            order_items.append(
                {
                    "product_id": product.id,
                    "title": product.title,
                    "price": price,
                    "quantity": item_data.quantity,
                    "image": product.image,
                }
            )

        order = Order(user_id=user.id, total=total)
        await order.save(db)

        for item_data in order_items:
            order_item = OrderItem(order_id=order.id, **item_data)
            await order_item.save(db)

        order = await Order.get(db, id=order.id, load_relationships=True)
        if not order:
            raise HTTPException(
                status_code=500, detail="Order not found after creation"
            )

        return OrderResponse(**order.model_dump(True))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=PaginatedResponse[OrderResponse])
async def list_orders(
    request: Annotated[OrderPaginatedRequest, Depends()],
    db: AsyncSession = Depends(get_db),
    user: User = Depends(has_permission("read", "order")),
) -> PaginatedResponse[OrderResponse]:
    """List orders with filtering and pagination"""
    try:
        filters: dict[str, Any] = {}

        if user.role.value != "admin":  # Replace with permit way
            filters["user_id"] = user.id

        if request.status is not None:
            filters["status"] = "Shipped"

        orders, total = await Order.get_all(
            db,
            page=request.page,
            size=request.size,
            sort_by=request.sort_by,
            descending=request.descending,
            filters=filters,
            search=request.search,
            load_relationships=True
        )

        return PaginatedResponse(
            data=[OrderResponse(**o.model_dump(True)) for o in orders],
            total=total,
            page=request.page,
            pages=(total + request.size - 1) // request.size,
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(has_permission("read", "order")),
) -> OrderResponse:
    """Get an order by ID (users can only access their own orders, admins can access any)"""
    filters: dict[str, str] = {"id": order_id}

    # Non-admins can only access their own orders
    if user.role.value != "admin":
        filters["user_id"] = user.id

    order = await Order.get(db, True, **filters)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return OrderResponse(**order.model_dump(True))


@router.patch("/{order_id}/cancel")
async def cancel_order(
    order_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(has_permission("update", "order")),
) -> str:
    """Cancel an order by ID (users can only cancel their own orders, admins can cancel any)"""
    filters: dict[str, str] = {"id": order_id}

    # Non-admins can only cancel their own orders
    if user.role.value != "admin":
        filters["user_id"] = user.id

    order = await Order.get(db, True, **filters)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.status != OrderStatus.processing:
        raise HTTPException(
            status_code=400, detail="Only processing orders can be canceled"
        )

    order.status = OrderStatus.cancelled
    await order.save(db)

    return "Order canceled successfully"
