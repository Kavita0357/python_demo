from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class LeaveTypeCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: str | None = None
    total_days: int = Field(..., ge=0)


class LeaveTypeUpdate(BaseModel):
    name: str | None = Field(None, min_length=2, max_length=100)
    description: str | None = None
    total_days: int | None = Field(None, ge=0)
    is_active: bool | None = None


class LeaveTypeResponse(BaseModel):
    id: int
    name: str
    description: str | None
    total_days: int
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)