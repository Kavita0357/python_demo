from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.user import User
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_password_reset_token,
)


def register_user(
    db: Session,
    email: str,
    password: str,
    first_name: str | None = None,
    last_name: str | None = None,
):
    existing_user = db.scalar(select(User).options(selectinload(User.role)).where(User.email == email))

    if existing_user:
        return None

    user = User(
        email=email,
        password_hash=hash_password(password),
        first_name=first_name,
        last_name=last_name,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def authenticate_user(
    db: Session,
    email: str,
    password: str,
):
    user = db.scalar(
        select(User)
        .options(selectinload(User.role))
        .where(User.email == email)
    )

    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    if not user.is_active:
        return None

    return user


def generate_token(user: User):
    return create_access_token(user.id)


def create_reset_token(db: Session, email: str):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return None

    return create_password_reset_token(user.id)


def reset_user_password(
    db: Session,
    user_id: int,
    new_password: str,
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return None

    user.password_hash = hash_password(new_password)

    db.commit()
    db.refresh(user)

    return user
