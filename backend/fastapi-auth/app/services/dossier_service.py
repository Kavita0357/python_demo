from fastapi import HTTPException


STATUS_TRANSITIONS = {
    "DRAFT": {
        "IN_PROGRESS",
    },
    "IN_PROGRESS": {
        "COMPLETED",
    },
    "COMPLETED": set(),
}


def validate_status_transition(
    current_status: str,
    new_status: str,
):
    if current_status == new_status:
        return

    allowed_statuses = STATUS_TRANSITIONS.get(
        current_status,
        set(),
    )

    if new_status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Invalid status transition: "
                f"{current_status} -> {new_status}"
            ),
        )