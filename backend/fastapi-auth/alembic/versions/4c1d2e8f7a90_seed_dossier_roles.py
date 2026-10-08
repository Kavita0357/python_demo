"""seed Admin, Editor, and Viewer roles

Revision ID: 4c1d2e8f7a90
Revises: 29505a396dd9
Create Date: 2026-10-08
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "4c1d2e8f7a90"
down_revision: Union[str, Sequence[str], None] = "29505a396dd9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    roles = sa.table(
        "roles",
        sa.column("name", sa.String),
        sa.column("description", sa.String),
        sa.column("created_at", sa.DateTime),
        sa.column("updated_at", sa.DateTime),
    )
    connection = op.get_bind()
    now = sa.func.now()
    for name, description in (
        ("Admin", "Can view, create, and edit all dossiers and CTD modules."),
        ("Editor", "Can create and edit dossiers and CTD modules."),
        ("Viewer", "Can view dossiers and CTD modules."),
    ):
        exists = connection.execute(
            sa.select(roles.c.name).where(sa.func.lower(roles.c.name) == name.lower())
        ).first()
        if not exists:
            connection.execute(
                roles.insert().values(
                    name=name,
                    description=description,
                    created_at=now,
                    updated_at=now,
                )
            )

    op.execute(
        "UPDATE users SET role_id = (SELECT id FROM roles WHERE lower(name) = 'viewer') "
        "WHERE role_id IS NULL"
    )


def downgrade() -> None:
    # Keep role records and user assignments intact when rolling back app code.
    pass
