from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.role import Role


def create_role(
    db: Session,
    name: str,
    description: str | None = None,
):
    existing_role = db.scalar(
        select(Role).where(Role.name == name)
    )

    if existing_role:
        return None

    role = Role(
        name=name,
        description=description,
    )

    db.add(role)
    db.commit()
    db.refresh(role)

    return role


def get_roles(db: Session):
    return db.scalars(
        select(Role).order_by(Role.id)
    ).all()


def get_role(
    db: Session,
    role_id: int,
):
    return db.scalar(
        select(Role).where(Role.id == role_id)
    )


def update_role(
    db: Session,
    role_id: int,
    name: str | None = None,
    description: str | None = None,
):
    role = get_role(db, role_id)

    if not role:
        return None

    if name is not None:
        role.name = name

    if description is not None:
        role.description = description

    db.commit()
    db.refresh(role)

    return role


def delete_role(
    db: Session,
    role_id: int,
):
    role = get_role(db, role_id)

    if not role:
        return False

    db.delete(role)
    db.commit()

    return True