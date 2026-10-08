"""set demo dossier account passwords

Revision ID: 8e3f1a6c2b50
Revises: 7a2e5c9b1d40
Create Date: 2026-10-08
"""
from typing import Sequence, Union

from alembic import op
from passlib.context import CryptContext
import sqlalchemy as sa


revision: str = "8e3f1a6c2b50"
down_revision: Union[str, Sequence[str], None] = "7a2e5c9b1d40"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    connection = op.get_bind()
    users = sa.table(
        "users",
        sa.column("email", sa.String),
        sa.column("password_hash", sa.String),
    )
    password_hash = CryptContext(schemes=["argon2"], deprecated="auto").hash("Test@1234")
    connection.execute(
        users.update()
        .where(
            users.c.email.in_(
                [
                    "admin@example.com",
                    "editor@example.com",
                    "viewer@example.com",
                ]
            )
        )
        .values(password_hash=password_hash)
    )


def downgrade() -> None:
    # Passwords cannot be safely restored to their prior values.
    pass
