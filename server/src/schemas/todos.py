from datetime import datetime
from pydantic import BaseModel


class TodoSchema(BaseModel):
    name: str
    user_id: int | None = None
    completed: bool | None = None
    archived: bool | None = None


class UpdateTodoSchema(BaseModel):
    completed: bool | None = None
    archived: bool | None = None


class TodoResponseSchema(BaseModel):
    id: int
    name: str
    completed: bool
    archived: bool
    created: datetime
    modified: datetime
    user_id: int
