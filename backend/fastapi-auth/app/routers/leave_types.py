from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.leave_type import LeaveType
from app.schemas.leave_type import (
    LeaveTypeCreate,
    LeaveTypeResponse,
    LeaveTypeUpdate,
)

router = APIRouter(
    prefix="/api/leave-types",
    tags=["Leave Types"]
)


@router.post(
    "",
    response_model=LeaveTypeResponse,
    status_code=status.HTTP_201_CREATED
)
def create_leave_type(
    data: LeaveTypeCreate,
    db: Session = Depends(get_db)
):
    existing = (
        db.query(LeaveType)
        .filter(LeaveType.name == data.name)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Leave type already exists"
        )

    leave_type = LeaveType(
        name=data.name,
        description=data.description,
        total_days=data.total_days,
    )

    db.add(leave_type)
    db.commit()
    db.refresh(leave_type)

    return leave_type


@router.get(
    "",
    response_model=list[LeaveTypeResponse]
)
def get_leave_types(
    db: Session = Depends(get_db)
):
    return (
        db.query(LeaveType)
        .order_by(LeaveType.id.desc())
        .all()
    )


@router.get(
    "/{leave_type_id}",
    response_model=LeaveTypeResponse
)
def get_leave_type(
    leave_type_id: int,
    db: Session = Depends(get_db)
):
    leave_type = (
        db.query(LeaveType)
        .filter(LeaveType.id == leave_type_id)
        .first()
    )

    if not leave_type:
        raise HTTPException(
            status_code=404,
            detail="Leave type not found"
        )

    return leave_type


@router.put(
    "/{leave_type_id}",
    response_model=LeaveTypeResponse
)
def update_leave_type(
    leave_type_id: int,
    data: LeaveTypeUpdate,
    db: Session = Depends(get_db)
):
    leave_type = (
        db.query(LeaveType)
        .filter(LeaveType.id == leave_type_id)
        .first()
    )

    if not leave_type:
        raise HTTPException(
            status_code=404,
            detail="Leave type not found"
        )

    if data.name is not None:
        leave_type.name = data.name

    if data.description is not None:
        leave_type.description = data.description

    if data.total_days is not None:
        leave_type.total_days = data.total_days

    if data.is_active is not None:
        leave_type.is_active = data.is_active

    db.commit()
    db.refresh(leave_type)

    return leave_type


@router.delete(
    "/{leave_type_id}"
)
def delete_leave_type(
    leave_type_id: int,
    db: Session = Depends(get_db)
):
    leave_type = (
        db.query(LeaveType)
        .filter(LeaveType.id == leave_type_id)
        .first()
    )

    if not leave_type:
        raise HTTPException(
            status_code=404,
            detail="Leave type not found"
        )

    leave_type.is_active = False

    db.commit()

    return {
        "message": "Leave type deactivated successfully"
    }