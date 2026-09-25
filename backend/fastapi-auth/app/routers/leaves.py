from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.core.security import get_current_user, require_admin

from app.models.user import User
from app.models.leave import Leave
from app.models.leave_balance import LeaveBalance
from app.models.leave_type import LeaveType
from app.models.leave_comment import LeaveComment

from app.schemas.leave import (
    LeaveCreate,
    LeaveReject,
    LeaveResponse,
    LeaveCommentCreate,
    LeaveCommentResponse,
)


router = APIRouter(
    prefix="/api/leaves",
    tags=["Leaves"]
)


# ---------------------------------------------------------
# CREATE LEAVE
# ---------------------------------------------------------

@router.post(
    "",
    response_model=LeaveResponse,
    status_code=status.HTTP_201_CREATED
)
def create_leave(
    data: LeaveCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.id

    if data.start_date > data.end_date:
        raise HTTPException(
            status_code=400,
            detail="Start date cannot be after end date"
        )

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

    total_days = (
        data.end_date - data.start_date
    ).days + 1

    balance = (
        db.query(LeaveBalance)
        .filter(
            LeaveBalance.user_id == user_id,
            LeaveBalance.leave_type_id == data.leave_type_id
        )
        .first()
    )

    if not balance:
        raise HTTPException(
            status_code=400,
            detail="Leave balance not configured for this user"
        )

    remaining_days = (
        balance.allocated_days - balance.used_days
    )

    if total_days > remaining_days:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Insufficient leave balance. "
                f"Remaining days: {remaining_days}"
            )
        )

    leave = Leave(
        user_id=user_id,
        leave_type_id=data.leave_type_id,
        start_date=data.start_date,
        end_date=data.end_date,
        total_days=total_days,
        reason=data.reason,
        status="draft",
    )

    db.add(leave)
    db.commit()
    db.refresh(leave)

    # Load user for response
    leave = (
        db.query(Leave)
        .options(joinedload(Leave.user))
        .filter(Leave.id == leave.id)
        .first()
    )

    return leave


# ---------------------------------------------------------
# GET MY LEAVES
# ---------------------------------------------------------

@router.get(
    "/my",
    response_model=list[LeaveResponse]
)
def get_my_leaves(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(Leave)
        .options(joinedload(Leave.user))
        .filter(
            Leave.user_id == current_user.id
        )
        .order_by(
            Leave.created_at.desc()
        )
        .all()
    )


# ---------------------------------------------------------
# GET ALL LEAVES - ADMIN
# ---------------------------------------------------------

@router.get(
    "",
    response_model=list[LeaveResponse]
)
def get_leaves(
    status_filter: str | None = None,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Leave)
        .options(joinedload(Leave.user))
    )

    if status_filter is not None:
        query = query.filter(
            Leave.status == status_filter
        )

    return (
        query
        .order_by(Leave.created_at.desc())
        .all()
    )


# ---------------------------------------------------------
# GET SINGLE LEAVE
# ---------------------------------------------------------

@router.get(
    "/{leave_id}",
    response_model=LeaveResponse
)
def get_leave(
    leave_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    leave = (
        db.query(Leave)
        .options(
            joinedload(Leave.user)
        )
        .filter(
            Leave.id == leave_id
        )
        .first()
    )

    if not leave:
        raise HTTPException(
            status_code=404,
            detail="Leave application not found"
        )

    is_admin = (
        current_user.role
        and current_user.role.name.lower() == "admin"
    )

    if not is_admin and leave.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to view this leave application"
        )

    return leave


# ---------------------------------------------------------
# SUBMIT LEAVE
# ---------------------------------------------------------

@router.post(
    "/{leave_id}/submit",
    response_model=LeaveResponse
)
def submit_leave(
    leave_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    leave = (
        db.query(Leave)
        .options(joinedload(Leave.user))
        .filter(
            Leave.id == leave_id,
            Leave.user_id == current_user.id
        )
        .first()
    )

    if not leave:
        raise HTTPException(
            status_code=404,
            detail="Leave application not found"
        )

    if leave.status != "draft":
        raise HTTPException(
            status_code=400,
            detail="Only draft leave can be submitted"
        )

    leave.status = "pending"

    db.commit()
    db.refresh(leave)

    return leave


# ---------------------------------------------------------
# APPROVE LEAVE
# ---------------------------------------------------------

@router.post(
    "/{leave_id}/approve",
    response_model=LeaveResponse
)
def approve_leave(
    leave_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    leave = (
        db.query(Leave)
        .options(joinedload(Leave.user))
        .filter(
            Leave.id == leave_id
        )
        .first()
    )

    if not leave:
        raise HTTPException(
            status_code=404,
            detail="Leave application not found"
        )

    if leave.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Only pending leave can be approved"
        )

    balance = (
        db.query(LeaveBalance)
        .filter(
            LeaveBalance.user_id == leave.user_id,
            LeaveBalance.leave_type_id == leave.leave_type_id
        )
        .first()
    )

    if not balance:
        raise HTTPException(
            status_code=400,
            detail="Leave balance not found"
        )

    remaining_days = (
        balance.allocated_days - balance.used_days
    )

    if leave.total_days > remaining_days:
        raise HTTPException(
            status_code=400,
            detail="Insufficient leave balance"
        )

    leave.status = "approved"
    leave.approved_by = current_user.id
    leave.approved_at = datetime.now()

    balance.used_days += leave.total_days

    db.commit()
    db.refresh(leave)

    return leave


# ---------------------------------------------------------
# REJECT LEAVE
# ---------------------------------------------------------

@router.post(
    "/{leave_id}/reject",
    response_model=LeaveResponse
)
def reject_leave(
    leave_id: int,
    data: LeaveReject,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    leave = (
        db.query(Leave)
        .options(joinedload(Leave.user))
        .filter(
            Leave.id == leave_id
        )
        .first()
    )

    if not leave:
        raise HTTPException(
            status_code=404,
            detail="Leave application not found"
        )

    if leave.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Only pending leave can be rejected"
        )

    leave.status = "rejected"
    leave.rejected_by = current_user.id
    leave.rejected_at = datetime.now()

    comment = LeaveComment(
        leave_id=leave.id,
        user_id=current_user.id,
        comment=data.reason
    )

    db.add(comment)
    db.commit()
    db.refresh(leave)

    return leave


# ---------------------------------------------------------
# CANCEL LEAVE
# ---------------------------------------------------------

@router.post(
    "/{leave_id}/cancel",
    response_model=LeaveResponse
)
def cancel_leave(
    leave_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    leave = (
        db.query(Leave)
        .options(joinedload(Leave.user))
        .filter(
            Leave.id == leave_id,
            Leave.user_id == current_user.id
        )
        .first()
    )

    if not leave:
        raise HTTPException(
            status_code=404,
            detail="Leave application not found"
        )

    if leave.status not in [
        "draft",
        "pending",
        "approved"
    ]:
        raise HTTPException(
            status_code=400,
            detail="This leave cannot be cancelled"
        )

    # Return approved leave days
    if leave.status == "approved":

        balance = (
            db.query(LeaveBalance)
            .filter(
                LeaveBalance.user_id == leave.user_id,
                LeaveBalance.leave_type_id == leave.leave_type_id
            )
            .first()
        )

        if balance:
            balance.used_days -= leave.total_days

            if balance.used_days < 0:
                balance.used_days = 0

    leave.status = "cancelled"

    db.commit()
    db.refresh(leave)

    return leave

# ---------------------------------------------------------
# ADD COMMENT
# ---------------------------------------------------------

@router.post(
    "/{leave_id}/comments",
    response_model=LeaveCommentResponse,
    status_code=status.HTTP_201_CREATED
)
def add_leave_comment(
    leave_id: int,
    data: LeaveCommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    leave = (
        db.query(Leave)
        .filter(
            Leave.id == leave_id
        )
        .first()
    )

    if not leave:
        raise HTTPException(
            status_code=404,
            detail="Leave application not found"
        )

    comment = LeaveComment(
        leave_id=leave_id,
        user_id=current_user.id,
        comment=data.comment,
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)

    return comment


# ---------------------------------------------------------
# GET COMMENTS
# ---------------------------------------------------------

@router.get(
    "/{leave_id}/comments",
    response_model=list[LeaveCommentResponse]
)
def get_leave_comments(
    leave_id: int,
    db: Session = Depends(get_db)
):
    leave = (
        db.query(Leave)
        .filter(
            Leave.id == leave_id
        )
        .first()
    )

    if not leave:
        raise HTTPException(
            status_code=404,
            detail="Leave application not found"
        )

    return (
        db.query(LeaveComment)
        .options(
            joinedload(LeaveComment.user)
        )
        .filter(
            LeaveComment.leave_id == leave_id
        )
        .order_by(
            LeaveComment.created_at.asc()
        )
        .all()
    )