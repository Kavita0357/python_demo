from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.leave_balance import LeaveBalance
from app.models.leave_type import LeaveType
from app.models.user import User
from app.schemas.leave_balance import (
    LeaveBalanceCreate,
    LeaveBalanceResponse,
)


router = APIRouter(
    prefix="/leave-balances",
    tags=["Leave Balances"]
)


@router.post(
    "",
    response_model=LeaveBalanceResponse,
    status_code=status.HTTP_201_CREATED
)
def create_leave_balance(
    data: LeaveBalanceCreate,
    db: Session = Depends(get_db)
):
    # Check user
    user = (
        db.query(User)
        .filter(User.id == data.user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Check leave type
    leave_type = (
        db.query(LeaveType)
        .filter(
            LeaveType.id == data.leave_type_id,
            LeaveType.is_active.is_(True)
        )
        .first()
    )

    if not leave_type:
        raise HTTPException(
            status_code=404,
            detail="Leave type not found"
        )

    # Check duplicate balance
    existing = (
        db.query(LeaveBalance)
        .filter(
            LeaveBalance.user_id == data.user_id,
            LeaveBalance.leave_type_id == data.leave_type_id
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Leave balance already exists for this user"
        )

    # Create balance
    balance = LeaveBalance(
        user_id=data.user_id,
        leave_type_id=data.leave_type_id,
        allocated_days=data.allocated_days,
        used_days=0,
    )

    db.add(balance)
    db.commit()
    db.refresh(balance)

    # Return the calculated remaining days
    return {
        "id": balance.id,
        "user_id": balance.user_id,
        "leave_type_id": balance.leave_type_id,
        "allocated_days": balance.allocated_days,
        "used_days": balance.used_days,
        "remaining_days": (
            balance.allocated_days - balance.used_days
        ),
        "created_at": balance.created_at,
    }


@router.get(
    "/user/{user_id}",
    response_model=list[LeaveBalanceResponse]
)
def get_user_leave_balances(
    user_id: int,
    db: Session = Depends(get_db)
):
    balances = (
        db.query(LeaveBalance)
        .filter(
            LeaveBalance.user_id == user_id
        )
        .all()
    )

    return [
        {
            "id": balance.id,
            "user_id": balance.user_id,
            "leave_type_id": balance.leave_type_id,
            "allocated_days": balance.allocated_days,
            "used_days": balance.used_days,
            "remaining_days": (
                balance.allocated_days - balance.used_days
            ),
            "created_at": balance.created_at,
        }
        for balance in balances
    ]