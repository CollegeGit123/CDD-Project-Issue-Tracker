from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth import get_current_user
from ..database import get_db
from ..models.project import Project
from ..models.user import User
from ..schemas.project import ProjectCreate

router = APIRouter(
    prefix="/api/v1/projects",
    tags=["projects"],
)


@router.get("/")
async def list_projects(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(select(Project))
    return result.scalars().all()


@router.post("/")
async def create_project(
    project_data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    owner_result = await db.execute(
    select(User).where(User.id == project_data.owner_id)
)

    if owner_result.scalar_one_or_none() is None:
     raise HTTPException(
        status_code=404,
        detail="Owner not found",
    )
    result = await db.execute(
        select(Project).where(Project.name == project_data.name)
    )

    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=409,
            detail="Project already exists",
        )

    project = Project(
        name=project_data.name,
        description=project_data.description,
        owner_id=project_data.owner_id,
    )

    db.add(project)
    await db.commit()
    await db.refresh(project)

    return project