from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.user import User as UserModel
from ..schemas.user import User as UserSchema
from ..database import get_db
from fastapi import Body
from typing import List

router = APIRouter()

@router.get("/users", response_model=List[UserSchema])
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserModel))
    users = result.scalars().all()
    return users

@router.get("/users/{user_id}", response_model=UserSchema)
async def get_user_profile(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/users/{user_id}", response_model=UserSchema)
async def update_user_profile(user_id: int, user_update: UserSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(user, field, value)
    await db.commit()
    await db.refresh(user)
    return user

# Settings endpoints (assuming a settings JSON field on User)
@router.get("/users/{user_id}/settings")
async def get_user_settings(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.settings if hasattr(user, 'settings') else {}

@router.put("/users/{user_id}/settings")
async def update_user_settings(user_id: int, settings: dict = Body(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.settings = settings
    await db.commit()
    await db.refresh(user)
    return user.settings

@router.post("/users", response_model=UserSchema)
async def create_user(user: UserSchema, db: AsyncSession = Depends(get_db)):
    db_user = UserModel(
        id=user.id,
        name=user.name,
        email=user.email,
        avatar=getattr(user, "avatar", None),
        settings=getattr(user, "settings", None),
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user 