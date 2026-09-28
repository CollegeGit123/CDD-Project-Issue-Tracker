from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth import get_current_user
from ..database import get_db
from ..models.project import Project
from ..models.ticket import Ticket
from ..models.user import User
from ..schemas.ticket import TicketCreate

router = APIRouter(
    prefix="/api/v1/tickets",
    tags=["tickets"],
)


@router.get("/")
async def list_tickets(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(select(Ticket))
    return result.scalars().all()


@router.post("/")
async def create_ticket(
    ticket_data: TicketCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    project_result = await db.execute(
        select(Project).where(Project.id == ticket_data.project_id)
    )

    if project_result.scalar_one_or_none() is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    user_result = await db.execute(
        select(User).where(User.id == ticket_data.created_by)
    )

    if user_result.scalar_one_or_none() is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    ticket = Ticket(
        title=ticket_data.title,
        description=ticket_data.description,
        status=ticket_data.status,
        priority=ticket_data.priority,
        project_id=ticket_data.project_id,
        created_by=ticket_data.created_by,
    )

    db.add(ticket)
    await db.commit()
    await db.refresh(ticket)

    return ticket