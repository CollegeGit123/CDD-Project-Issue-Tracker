from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth import get_current_user
from ..database import get_db
from ..models.project import Project
from ..models.project_member import ProjectMember
from ..models.ticket import Ticket
from ..models.user import User
from ..schemas.ticket import TicketCreate
from .projects import get_project_access

router = APIRouter(prefix="/api/v1/tickets", tags=["tickets"])


@router.get("/")
async def list_tickets(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Ticket)
        .join(Project, Ticket.project_id == Project.id)
        .outerjoin(ProjectMember, ProjectMember.project_id == Project.id)
        .where(
            or_(
                Project.owner_id == current_user.id,
                ProjectMember.user_id == current_user.id,
            )
        )
        .distinct()
        .order_by(Ticket.id)
    )
    return result.scalars().all()


@router.post("/")
async def create_ticket(
    ticket_data: TicketCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _, role = await get_project_access(
        ticket_data.project_id, current_user, db
    )
    if role not in ("owner", "developer"):
        raise HTTPException(
            status_code=403,
            detail="Only owners and developers can create tickets",
        )

    ticket = Ticket(
        title=ticket_data.title,
        description=ticket_data.description,
        status=ticket_data.status,
        priority=ticket_data.priority,
        project_id=ticket_data.project_id,
        created_by=current_user.id,
    )
    db.add(ticket)
    await db.commit()
    await db.refresh(ticket)
    return ticket


@router.patch("/{ticket_id}/status")
async def update_ticket_status(
    ticket_id: int,
    status: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if status not in ("open", "in_progress", "closed"):
        raise HTTPException(status_code=422, detail="Invalid ticket status")

    result = await db.execute(
        select(Ticket).where(Ticket.id == ticket_id)
    )
    ticket = result.scalar_one_or_none()
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")

    _, role = await get_project_access(
        ticket.project_id, current_user, db
    )
    if role not in ("owner", "developer"):
        raise HTTPException(
            status_code=403,
            detail="Only owners and developers can update ticket status",
        )

    ticket.status = status
    await db.commit()
    await db.refresh(ticket)
    return ticket
