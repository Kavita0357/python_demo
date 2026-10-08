from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_dossier_admin, require_dossier_editor, require_dossier_viewer
from app.models.dossier import Dossier
from app.models.dossier_module import DossierModule
from app.schemas.dossier import (
    DossierCreate,
    DossierModuleStatusUpdate,
    DossierModuleUpdate,
    DossierResponse,
    DossierStatusUpdate,
    DossierUpdate,
    DossierModuleCreate,
    DossierModuleResponse,
)
from app.services.dossier_service import validate_status_transition

router = APIRouter(
    prefix="/api/dossiers",
    tags=["Dossiers"],
)

CTD_MODULES = (
    ("1", "Administrative Information and Prescribing Information", "Regional administrative information and prescribing information."),
    ("2", "CTD Summaries", "Quality, nonclinical, and clinical overviews and summaries."),
    ("3", "Quality", "Chemistry, manufacturing, and controls documentation."),
    ("4", "Nonclinical Study Reports", "Nonclinical study reports and related documentation."),
    ("5", "Clinical Study Reports", "Clinical study reports and related documentation."),
)

@router.post(
    "",
    response_model=DossierResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_dossier(
    data: DossierCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_dossier_editor),
):
    dossier = Dossier(
        name=data.name,
        description=data.description,
        status="DRAFT",
        created_by=current_user.id,
    )

    # Add the standard CTD structure as part of the dossier transaction so
    # every newly created dossier starts with all five modules.
    dossier.modules = [
        DossierModule(
            module_number=module_number,
            module_name=module_name,
            description=description,
            status="NOT_STARTED",
        )
        for module_number, module_name, description in CTD_MODULES
    ]

    db.add(dossier)
    db.commit()
    db.refresh(dossier)

    return dossier

@router.get(
    "",
    response_model=list[DossierResponse],
)
def get_dossiers(
    db: Session = Depends(get_db),
    current_user=Depends(require_dossier_viewer),
):
    result = db.execute(
        select(Dossier)
        .order_by(Dossier.created_at.desc())
    )

    return result.scalars().all()

@router.get(
    "/{dossier_id}",
    response_model=DossierResponse,
)
def get_dossier(
    dossier_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_dossier_viewer),
):
    result = db.execute(
        select(Dossier).where(
            Dossier.id == dossier_id,
        )
    )

    dossier = result.scalar_one_or_none()

    if not dossier:
        raise HTTPException(
            status_code=404,
            detail="Dossier not found",
        )

    return dossier

@router.put(
    "/{dossier_id}",
    response_model=DossierResponse,
)
def update_dossier(
    dossier_id: int,
    data: DossierUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_dossier_editor),
):
    result = db.execute(
        select(Dossier).where(
            Dossier.id == dossier_id,
        )
    )

    dossier = result.scalar_one_or_none()

    if not dossier:
        raise HTTPException(
            status_code=404,
            detail="Dossier not found",
        )

    if data.name is not None:
        dossier.name = data.name

    if data.description is not None:
        dossier.description = data.description

    db.commit()
    db.refresh(dossier)

    return dossier


@router.delete(
    "/{dossier_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_dossier(
    dossier_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_dossier_admin),
):
    dossier = db.get(Dossier, dossier_id)
    if not dossier:
        raise HTTPException(status_code=404, detail="Dossier not found")

    db.delete(dossier)
    db.commit()

@router.post(
    "/{dossier_id}/modules",
    response_model=DossierModuleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_module(
    dossier_id: int,
    data: DossierModuleCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_dossier_editor),
):
    result = db.execute(
        select(Dossier).where(
            Dossier.id == dossier_id,
        )
    )

    dossier = result.scalar_one_or_none()

    if not dossier:
        raise HTTPException(
            status_code=404,
            detail="Dossier not found",
        )

    module = DossierModule(
        dossier_id=dossier.id,
        module_number=data.module_number,
        module_name=data.module_name,
        description=data.description,
        status="NOT_STARTED",
    )

    db.add(module)
    db.commit()
    db.refresh(module)

    return module

@router.get(
    "/{dossier_id}/modules",
    response_model=list[DossierModuleResponse],
)
def get_modules(
    dossier_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_dossier_viewer),
):
    result = db.execute(
        select(DossierModule)
        .join(Dossier)
        .where(
            DossierModule.dossier_id == dossier_id,
        )
        .order_by(DossierModule.module_number)
    )

    return result.scalars().all()

@router.put(
    "/{dossier_id}/modules/{module_id}",
    response_model=DossierModuleResponse,
)
def update_module(
    dossier_id: int,
    module_id: int,
    data: DossierModuleUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_dossier_editor),
):
    result = db.execute(
        select(DossierModule)
        .join(Dossier)
        .where(
            DossierModule.id == module_id,
            DossierModule.dossier_id == dossier_id,
        )
    )

    module = result.scalar_one_or_none()

    if not module:
        raise HTTPException(
            status_code=404,
            detail="Module not found",
        )

    if data.module_number is not None:
        module.module_number = data.module_number

    if data.module_name is not None:
        module.module_name = data.module_name

    if data.description is not None:
        module.description = data.description

    db.commit()
    db.refresh(module)

    return module

@router.patch(
    "/{dossier_id}/status",
    response_model=DossierResponse,
)
def update_dossier_status(
    dossier_id: int,
    data: DossierStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_dossier_editor),
):
    # Get dossier
    result = db.execute(
        select(Dossier).where(
            Dossier.id == dossier_id,
        )
    )

    dossier = result.scalar_one_or_none()

    if not dossier:
        raise HTTPException(
            status_code=404,
            detail="Dossier not found",
        )

    # Get all modules
    modules = db.execute(
        select(DossierModule).where(
            DossierModule.dossier_id == dossier.id
        )
    ).scalars().all()

    # If trying to mark dossier as COMPLETED,
    # all modules must be completed
    if data.status.value == "COMPLETED":

        if not modules:
            raise HTTPException(
                status_code=400,
                detail="Dossier has no modules",
            )

        incomplete_modules = [
            module
            for module in modules
            if module.status != "COMPLETED"
        ]

        if incomplete_modules:
            raise HTTPException(
                status_code=400,
                detail="All modules must be completed before completing the dossier",
            )

    dossier.status = data.status.value

    db.commit()
    db.refresh(dossier)

    return dossier

@router.patch(
    "/{dossier_id}/modules/{module_id}/status",
    response_model=DossierModuleResponse,
)
def update_module_status(
    dossier_id: int,
    module_id: int,
    data: DossierModuleStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_dossier_editor),
):
    result = db.execute(
        select(DossierModule)
        .join(Dossier)
        .where(
            DossierModule.id == module_id,
            DossierModule.dossier_id == dossier_id,
        )
    )

    module = result.scalar_one_or_none()

    if not module:
        raise HTTPException(
            status_code=404,
            detail="Module not found",
        )

    module.status = data.status.value

    db.commit()
    db.refresh(module)

    return module
