from pydantic import EmailStr
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from src.constants import UpdateAction
from src.models import Todo, User
from src.schemas import TodoSchema, UserSchema
from src.utils.hasher import Hasher


async def create_user(db: AsyncSession, user: UserSchema):
    hashed_pwd = Hasher.get_password_hash(user.password)
    db_user = User(email=user.email, password=hashed_pwd)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


async def get_user(db: AsyncSession, email: EmailStr):
    statement = select(User).where(User.email == email)
    return await db.scalar(statement)


async def login_user(db: AsyncSession, user: UserSchema):
    prev_user = await get_user(db, user.email)
    pwd_match = Hasher.verify_password(user.password, prev_user.password)
    if not pwd_match:
        return False
    return prev_user


async def create_todo(db: AsyncSession, todo: TodoSchema, user_id: int):
    todo_exists = await get_todo(
        db, todo_name=todo.name, user_id=user_id, action="create"
    )
    if todo_exists:
        return False
    todo_instance = Todo(name=todo.name, user_id=user_id)
    db.add(todo_instance)
    await db.commit()
    await db.refresh(todo_instance)
    return todo_instance


async def get_todo(
    db: AsyncSession,
    todo_id: int = None,
    todo_name: str = None,
    user_id: int = None,
    action: str = None,
):
    if action == "create":
        statement = select(Todo).where(
            and_(Todo.name == todo_name, Todo.user_id == user_id)
        )
    elif action == "delete":
        statement = select(Todo).where(
            and_(Todo.user_id == user_id, Todo.id == todo_id)
        )
    elif action == "update":
        statement = select(Todo).where(
            and_(Todo.user_id == user_id, Todo.id == todo_id)
        )
    return await db.scalar(statement)


async def get_todos(db: AsyncSession, user_id: int, search_value: str | None = None):
    if search_value:
        statement = select(Todo).where(
            and_(Todo.user_id == user_id, Todo.name.contains(search_value))
        )
    else:
        statement = select(Todo).where(Todo.user_id == user_id)
    return await db.scalars(statement)


async def update_todo(
    db: AsyncSession, todo_id: int, todo_value: bool, user_id: int, action: str
):
    todo = await get_todo(db, todo_id=todo_id, user_id=user_id, action="update")
    if not todo:
        return False
    if action == UpdateAction.ARCHIVE:
        todo.archived = todo_value
    elif action == UpdateAction.COMPLETE:
        todo.completed = todo_value
    await db.commit()
    await db.refresh(todo)
    return todo


async def delete_todo(db: AsyncSession, todo_id: int, user_id: int):
    todo = await get_todo(db, todo_id=todo_id, user_id=user_id, action="delete")
    if not todo:
        return False
    await db.delete(todo)
    await db.commit()
    return True


async def validate_authtoken(db: AsyncSession, authtoken: str):
    statement = select(User).where(User.auth_token == authtoken)
    return await db.scalar(statement)
