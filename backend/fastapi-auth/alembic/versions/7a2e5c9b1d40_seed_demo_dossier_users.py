"""seed demo users for dossier roles

Revision ID: 7a2e5c9b1d40
Revises: 4c1d2e8f7a90
Create Date: 2026-10-08
"""
from typing import Sequence, Union

from alembic import op
from passlib.context import CryptContext
import sqlalchemy as sa


revision: str = "7a2e5c9b1d40"
down_revision: Union[str, Sequence[str], None] = "4c1d2e8f7a90"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    connection = op.get_bind()
    password_context = CryptContext(schemes=["argon2"], deprecated="auto")
    role_table = sa.table(
        "roles", sa.column("id", sa.Integer), sa.column("name", sa.String)
    )
    user_table = sa.table(
        "users",
        sa.column("email", sa.String),
        sa.column("password_hash", sa.String),
        sa.column("first_name", sa.String),
        sa.column("last_name", sa.String),
        sa.column("role_id", sa.Integer),
        sa.column("is_active", sa.Boolean),
        sa.column("created_at", sa.DateTime),
        sa.column("updated_at", sa.DateTime),
    )
    now = sa.func.now()

    for email, first_name, role_name, password in (
        ("admin@example.com", "Demo Admin", "admin", "Test@1234"),
        ("editor@example.com", "Demo Editor", "editor", "Test@1234"),
        ("viewer@example.com", "Demo Viewer", "viewer", "Test@1234"),
    ):
        exists = connection.execute(
            sa.select(user_table.c.email).where(user_table.c.email == email)
        ).first()
        if exists:
            continue

        role_id = connection.execute(
            sa.select(role_table.c.id).where(sa.func.lower(role_table.c.name) == role_name)
        ).scalar_one()
        connection.execute(
            user_table.insert().values(
                email=email,
                password_hash=password_context.hash(password),
                first_name=first_name,
                last_name=None,
                role_id=role_id,
                is_active=True,
                created_at=now,
                updated_at=now,
            )
        )


def downgrade() -> None:
    # Demo accounts may have been adopted or edited after seeding; preserve them.
    pass
