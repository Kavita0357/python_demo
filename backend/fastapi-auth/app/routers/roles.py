from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.role import (
    RoleCreate,
    RoleUpdate,
    RoleResponse,
)

from app.services.role_service import (
    create_role,
    get_roles,
    get_role,
    update_role,
    delete_role,
)
from app.core.security import require_admin
from app.models.user import User


router = APIRouter(
    prefix="/api/roles",
    tags=["Roles"],
)


@router.post(
    "",
    response_model=RoleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    data: RoleCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    role = create_role(
        db=db,
        name=data.name,
        description=data.description,
    )

    if not role:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Role already exists",
        )

    return role


@router.get(
    "",
    response_model=list[RoleResponse],
)
def list_roles(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return get_roles(db)


@router.get(
    "/{role_id}",
    response_model=RoleResponse,
)
def get(
    role_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    role = get_role(db, role_id)

    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found",
        )

    return role


@router.put(
    "/{role_id}",
    response_model=RoleResponse,
)
def update(
    role_id: int,
    data: RoleUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    existing_role = get_role(db, role_id)
    if not existing_role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found",
        )

    built_in_roles = {"admin", "editor", "viewer"}
    if (
        existing_role.name.lower() in built_in_roles
        and data.name is not None
        and data.name.lower() != existing_role.name.lower()
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Built-in role names cannot be changed",
        )

    role = update_role(
        db=db,
        role_id=role_id,
        name=data.name,
        description=data.description,
    )

    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found",
        )

    return role


@router.delete(
    "/{role_id}",
)
def delete(
    role_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    role = get_role(db, role_id)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found",
        )

    if role.name.lower() in {"admin", "editor", "viewer"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Built-in roles cannot be deleted",
        )

    if role.users:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Reassign users before deleting this role",
        )

    deleted = delete_role(
        db=db,
        role_id=role_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found",
        )

    return {
        "message": "Role deleted successfully"
    }
