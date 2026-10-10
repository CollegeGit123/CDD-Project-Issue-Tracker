from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth import get_current_user
from ..database import get_db
from ..models.project import Project
from ..models.project_member import ProjectMember
from ..models.user import User
from ..schemas.membership import MemberAdd, MemberRoleUpdate
from ..schemas.project import ProjectCreate

router = APIRouter(prefix="/api/v1/projects", tags=["projects"])


async def get_project_access(
    project_id: int,
    current_user: User,
    db: AsyncSession,
):
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    if project.owner_id == current_user.id:
        return project, "owner"

    result = await db.execute(
        select(ProjectMember).where(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id == current_user.id,
        )
    )
    member = result.scalar_one_or_none()

    if member is None:
        raise HTTPException(status_code=403, detail="Project access denied")

    return project, member.role


@router.get("/")
async def list_projects(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Project)
        .outerjoin(
            ProjectMember,
            ProjectMember.project_id == Project.id,
        )
        .where(
            or_(
                Project.owner_id == current_user.id,
                ProjectMember.user_id == current_user.id,
            )
        )
        .distinct()
        .order_by(Project.id)
    )
    return result.scalars().all()


@router.post("/")
async def create_project(
    project_data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Project).where(Project.name == project_data.name)
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Project already exists")

    project = Project(
        name=project_data.name,
        description=project_data.description,
        owner_id=current_user.id,
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project


@router.get("/{project_id}/members")
async def list_members(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await get_project_access(project_id, current_user, db)

    result = await db.execute(
        select(ProjectMember, User.username, User.email)
        .join(User, User.id == ProjectMember.user_id)
        .where(ProjectMember.project_id == project_id)
        .order_by(User.username)
    )

    members = []
    for member, username, email in result.all():
        members.append({
            "user_id": member.user_id,
            "username": username,
            "email": email,
            "role": member.role,
        })

    project, _ = await get_project_access(project_id, current_user, db)
    owner_result = await db.execute(
        select(User.id, User.username, User.email)
        .where(User.id == project.owner_id)
    )
    owner = owner_result.one()

    return {
        "owner": {
            "user_id": owner.id,
            "username": owner.username,
            "email": owner.email,
            "role": "owner",
        },
        "members": members,
    }


@router.post("/{project_id}/members", status_code=201)
async def add_member(
    project_id: int,
    data: MemberAdd,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project, role = await get_project_access(project_id, current_user, db)
    if role != "owner":
        raise HTTPException(status_code=403, detail="Only the owner can manage members")

    result = await db.execute(
        select(User).where(User.username == data.username)
    )
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if user.id == project.owner_id:
        raise HTTPException(status_code=409, detail="The owner already has full access")

    result = await db.execute(
        select(ProjectMember).where(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id == user.id,
        )
    )
    member = result.scalar_one_or_none()

    if member:
        raise HTTPException(status_code=409, detail="User is already a member")

    member = ProjectMember(
        project_id=project_id,
        user_id=user.id,
        role=data.role,
    )
    db.add(member)
    await db.commit()

    return {
        "project_id": project_id,
        "user_id": user.id,
        "username": user.username,
        "role": member.role,
    }


@router.patch("/{project_id}/members/{user_id}")
async def update_member_role(
    project_id: int,
    user_id: int,
    data: MemberRoleUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _, role = await get_project_access(project_id, current_user, db)
    if role != "owner":
        raise HTTPException(status_code=403, detail="Only the owner can manage members")

    result = await db.execute(
        select(ProjectMember).where(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id == user_id,
        )
    )
    member = result.scalar_one_or_none()
    if member is None:
        raise HTTPException(status_code=404, detail="Member not found")

    member.role = data.role
    await db.commit()

    return {"user_id": user_id, "role": member.role}


@router.delete("/{project_id}/members/{user_id}")
async def remove_member(
    project_id: int,
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _, role = await get_project_access(project_id, current_user, db)
    if role != "owner":
        raise HTTPException(status_code=403, detail="Only the owner can manage members")

    result = await db.execute(
        select(ProjectMember).where(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id == user_id,
        )
    )
    member = result.scalar_one_or_none()
    if member is None:
        raise HTTPException(status_code=404, detail="Member not found")

    await db.delete(member)
    await db.commit()
    return {"message": "Member removed"}
