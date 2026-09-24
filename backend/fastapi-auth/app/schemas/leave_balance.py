from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class LeaveBalanceCreate(BaseModel):
    user_id: int
    leave_type_id: int

    allocated_days: int = Field(
        ...,
        ge=0
    )


class LeaveBalanceResponse(BaseModel):
    id: int

    user_id: int
    leave_type_id: int

    allocated_days: int
    used_days: int
    remaining_days: int

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )