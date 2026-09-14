from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.email_service import send_password_reset_email

from app.core.security import (
    create_access_token,
    verify_password_reset_token,
)

from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    UserResponse,
    TokenResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
)

from app.services.auth_service import (
    register_user,
    authenticate_user,
    create_reset_token,
    reset_user_password,
)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db),
):
    user = register_user(
        db=db,
        email=data.email,
        password=data.password,
        first_name=data.first_name,
        last_name=data.last_name,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    return user


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
):
    user = authenticate_user(
        db=db,
        email=data.email,
        password=data.password,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(user.id)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }


@router.post(
    "/forgot-password",
    response_model=ForgotPasswordResponse,
)
async def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    token = create_reset_token(
        db=db,
        email=data.email,
    )

    if not token:
        return {
            "message": ("If the email exists, a password reset link " "has been sent.")
        }

    await send_password_reset_email(
        email=data.email,
        reset_token=token,
    )

    return {"message": ("If the email exists, a password reset link " "has been sent.")}


@router.post(
    "/reset-password",
    response_model=ResetPasswordResponse,
)
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    user_id = verify_password_reset_token(data.token)

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )

    user = reset_user_password(
        db=db,
        user_id=user_id,
        new_password=data.password,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return {
        "message": "Password reset successfully",
    }
