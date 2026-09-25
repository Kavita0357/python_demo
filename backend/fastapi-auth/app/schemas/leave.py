from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class LeaveCreate(BaseModel):
    leave_type_id: int

    start_date: date
    end_date: date

    reason: str | None = Field(
        default=None,
        max_length=2000
    )


class LeaveUserResponse(BaseModel):
    id: int
    first_name: str | None = None
    last_name: str | None = None
    email: EmailStr

    model_config = {
        "from_attributes": True
    }

class LeaveResponse(BaseModel):
    id: int

    user_id: int
    leave_type_id: int

    start_date: date
    end_date: date

    total_days: int

    reason: str | None

    status: str
    
    user: LeaveUserResponse | None = None

    approved_by: int | None
    approved_at: datetime | None

    rejected_by: int | None
    rejected_at: datetime | None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class LeaveReject(BaseModel):
    reason: str = Field(
        ...,
        min_length=1,
        max_length=2000
    )


class LeaveCommentCreate(BaseModel):
    comment: str = Field(
        ...,
        min_length=1,
        max_length=2000
    )


class LeaveCommentResponse(BaseModel):
    id: int

    leave_id: int
    user_id: int

    comment: str

    created_at: datetime
    
    user: LeaveUserResponse | None = None

    model_config = ConfigDict(
        from_attributes=True
    )