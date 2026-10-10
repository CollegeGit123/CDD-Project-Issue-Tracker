from alembic import op
import sqlalchemy as sa

revision = "753bc4d91a20"
down_revision = "64235fa76761"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "project_members",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "project_id",
            sa.Integer(),
            sa.ForeignKey("projects.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "role",
            sa.String(length=20),
            nullable=False,
            server_default="developer",
        ),
        sa.UniqueConstraint(
            "project_id",
            "user_id",
            name="uq_project_member_user",
        ),
    )


def downgrade() -> None:
    op.drop_table("project_members")
