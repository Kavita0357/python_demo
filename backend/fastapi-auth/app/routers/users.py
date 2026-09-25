from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_admin
from app.models.user import User
from app.models.role import Role

from pydantic import BaseModel


router = APIRouter(
    prefix="/api/users",
    tags=["Users"],
)


class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str | None = None
    last_name: str | None = None
    is_active: bool
    role_id: int | None = None
    role_name: str | None = None

    model_config = {
        "from_attributes": True
    }


class AssignRoleRequest(BaseModel):
    role_id: int


# ---------------------------------------------------------
# GET ALL USERS
# ---------------------------------------------------------

@router.get(
    "",
    response_model=list[UserResponse],
)
def get_users(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    users = (
        db.query(User)
        .order_by(User.created_at.desc())
        .all()
    )

    return [
        UserResponse(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            is_active=user.is_active,
            role_id=user.role_id,
            role_name=user.role.name if user.role else None,
        )
        for user in users
    ]


# ---------------------------------------------------------
# GET USER
# ---------------------------------------------------------

@router.get(
    "/{user_id}",
    response_model=UserResponse,
)
def get_user(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return UserResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        is_active=user.is_active,
        role_id=user.role_id,
        role_name=user.role.name if user.role else None,
    )


# ---------------------------------------------------------
# ASSIGN ROLE
# ---------------------------------------------------------

@router.patch(
    "/{user_id}/role",
    response_model=UserResponse,
)
def assign_role(
    user_id: int,
    data: AssignRoleRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    role = (
        db.query(Role)
        .filter(Role.id == data.role_id)
        .first()
    )

    if not role:
        raise HTTPException(
            status_code=404,
            detail="Role not found",
        )

    user.role_id = role.id

    db.commit()
    db.refresh(user)

    return UserResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        is_active=user.is_active,
        role_id=user.role_id,
        role_name=role.name,
    )


# ---------------------------------------------------------
# UPDATE USER STATUS
# ---------------------------------------------------------

@router.patch(
    "/{user_id}/status",
    response_model=UserResponse,
)
def update_user_status(
    user_id: int,
    is_active: bool,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    user.is_active = is_active

    db.commit()
    db.refresh(user)

    return UserResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        is_active=user.is_active,
        role_id=user.role_id,
        role_name=user.role.name if user.role else None,
    )