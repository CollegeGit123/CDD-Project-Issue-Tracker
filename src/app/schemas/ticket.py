from typing import Literal

from pydantic import BaseModel, Field


class TicketCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    project_id: int
    created_by: int
    description: str | None = None
    status: Literal["open", "in_progress", "closed"] = "open"
    priority: Literal["low", "medium", "high"] = "medium"