from typing import Annotated, Any, AsyncIterator

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from src.constants import UpdateAction
from src.database import async_session_factory
from src.schemas.todos import TodoResponseSchema, TodoSchema, UpdateTodoSchema
from src.schemas.users import UserResponseSchema, UserSchema
from src.utils.crud import (
    create_todo,
    create_user,
    delete_todo,
    get_todos,
    get_user,
    login_user,
    update_todo,
    validate_authtoken,
)

app = FastAPI(docs_url="/")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def get_db() -> AsyncIterator[AsyncSession]:
    async with async_session_factory() as session:
        yield session


@app.post("/v1/register", response_model=UserResponseSchema)
async def register(
    user: UserSchema, db: Annotated[AsyncSession, Depends(get_db)]
) -> Any:
    user_exists = await get_user(db, user.email)
    if user_exists:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = await create_user(db, user)
    return user


@app.post("/v1/login", response_model=UserResponseSchema)
async def login(user: UserSchema, db: Annotated[AsyncSession, Depends(get_db)]) -> Any:
    user_exists = await get_user(db, user.email)
    if not user_exists:
        raise HTTPException(status_code=404, detail="User does not exist")
    user = await login_user(db, user)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    return user


@app.post("/v1/todos/create", response_model=TodoResponseSchema)
async def create_todos(
    request: Request,
    todo: TodoSchema,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Any:
    user = await validate_authtoken(db, request.headers.get("authorization"))
    if not user:
        raise HTTPException(status_code=422, detail="Invalid authorization token")

    todo = await create_todo(db, todo, user.id)
    if not todo:
        raise HTTPException(status_code=400, detail="Todo already exists for this user")

    return todo


@app.get("/v1/todos", response_model=list[TodoResponseSchema])
async def fetch_todos(
    request: Request, db: Annotated[AsyncSession, Depends(get_db)]
) -> Any:
    user = await validate_authtoken(db, request.headers.get("authorization"))
    if not user:
        raise HTTPException(status_code=422, detail="Invalid authorization token")

    todos = await get_todos(db, user.id)
    return sorted(todos, key=lambda x: x.id)


@app.delete("/v1/todos/{todo_id}")
async def delete_todos(
    request: Request, todo_id: int, db: Annotated[AsyncSession, Depends(get_db)]
) -> Any:
    user = await validate_authtoken(db, request.headers.get("authorization"))
    if not user:
        raise HTTPException(status_code=422, detail="Invalid authorization token")
    todo = await delete_todo(db, todo_id, user.id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo instance not found")
    return "Todo deleted successfully"


@app.patch("/v1/todos/{todo_id}", response_model=TodoResponseSchema)
async def update_todos(
    request: Request,
    todo: UpdateTodoSchema,
    todo_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Any:
    user = await validate_authtoken(db, request.headers.get("authorization"))
    if not user:
        raise HTTPException(status_code=422, detail="Invalid authorization token")

    todo_action = UpdateAction.ARCHIVE if todo.archived else UpdateAction.COMPLETE
    if todo.archived:
        todo_value = todo.archived
    else:
        todo_value = todo.completed

    todo = await update_todo(db, todo_id, todo_value, user.id, todo_action)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo instance not found")

    return todo
