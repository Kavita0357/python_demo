"""use short demo login email addresses

Revision ID: 9f4a2b7c6d10
Revises: 8e3f1a6c2b50
Create Date: 2026-10-08
"""
from typing import Sequence, Union

from alembic import op
from passlib.context import CryptContext
import sqlalchemy as sa


revision: str = "9f4a2b7c6d10"
down_revision: Union[str, Sequence[str], None] = "8e3f1a6c2b50"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    connection = op.get_bind()
    users = sa.table(
        "users",
        sa.column("id", sa.Integer),
        sa.column("email", sa.String),
        sa.column("password_hash", sa.String),
        sa.column("role_id", sa.Integer),
    )
    roles = sa.table("roles", sa.column("id", sa.Integer), sa.column("name", sa.String))
    password_hash = CryptContext(schemes=["argon2"], deprecated="auto").hash("Test@1234")

    for old_email, email, role_name in (
        ("admin.demo@example.com", "admin@example.com", "admin"),
        ("editor.demo@example.com", "editor@example.com", "editor"),
        ("viewer.demo@example.com", "viewer@example.com", "viewer"),
    ):
        target_exists = connection.execute(
            sa.select(users.c.id).where(users.c.email == email)
        ).first()
        source = connection.execute(
            sa.select(users.c.id).where(users.c.email == old_email)
        ).first()
        if not target_exists and source:
            connection.execute(
                users.update().where(users.c.id == source.id).values(email=email)
            )

        role_id = connection.execute(
            sa.select(roles.c.id).where(sa.func.lower(roles.c.name) == role_name)
        ).scalar_one()
        connection.execute(
            users.update()
            .where(users.c.email == email)
            .values(password_hash=password_hash, role_id=role_id)
        )


def downgrade() -> None:
    # Keep the requested account email addresses and credentials in place.
    pass
