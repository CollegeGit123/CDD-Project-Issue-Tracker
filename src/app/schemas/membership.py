from typing import Literal

from pydantic import BaseModel, Field


class MemberAdd(BaseModel):
    username: str = Field(min_length=1, max_length=50)
    role: Literal["developer", "viewer"] = "developer"


class MemberRoleUpdate(BaseModel):
    role: Literal["developer", "viewer"]
