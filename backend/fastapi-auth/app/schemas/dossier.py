from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict, Field

class ModuleStatus(str, Enum):
    NOT_STARTED = "NOT_STARTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"

class DossierStatus(str, Enum):
    DRAFT = "DRAFT"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    
class DossierCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=3,
        max_length=255,
    )
    description: str | None = Field(
        default=None,
        max_length=2000,
    )
    description: str | None = None

class DossierUpdate(BaseModel):
    name: str | None = None
    description: str | None = None

class DossierResponse(BaseModel):
    id: int
    name: str
    description: str | None
    status: DossierStatus
    created_by: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class DossierModuleCreate(BaseModel):
    module_number: str = Field(
        ...,
        min_length=1,
        max_length=20,
    )

    module_name: str = Field(
        ...,
        min_length=2,
        max_length=255,
    )

    description: str | None = Field(
        default=None,
        max_length=2000,
    )

class DossierModuleUpdate(BaseModel):
    module_number: str | None = Field(
        default=None,
        min_length=1,
        max_length=20,
    )

    module_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    description: str | None = Field(
        default=None,
        max_length=2000,
    )

class DossierModuleResponse(BaseModel):
    id: int
    dossier_id: int
    module_number: str
    module_name: str
    description: str | None
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class DossierStatusUpdate(BaseModel):
    status: DossierStatus
    
class DossierModuleStatusUpdate(BaseModel):
    status: ModuleStatus