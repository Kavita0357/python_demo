from pydantic import BaseModel, Field


class RoleCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    description: str | None = None


class RoleUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )
    description: str | None = None


class RoleResponse(BaseModel):
    id: int
    name: str
    description: str | None

    model_config = {
        "from_attributes": True
    }