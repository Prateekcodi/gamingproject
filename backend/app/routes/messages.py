from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.database import get_db
from app.models.message import Message as MessageModel
from app.schemas.message import Message, MessageCreate
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/api/messages", tags=["messages"])

@router.post("/", response_model=Message)
async def send_message(message: MessageCreate, db: AsyncSession = Depends(get_db)):
    db_message = MessageModel(
        sender_id=1,  # TODO: Replace with current user from auth
        recipient_id=message.recipient_id,
        group_id=message.group_id,
        content=message.content,
        type=message.type,
        timestamp=datetime.utcnow(),
    )
    db.add(db_message)
    await db.commit()
    await db.refresh(db_message)
    return db_message

@router.get("/", response_model=List[Message])
async def get_messages(
    db: AsyncSession = Depends(get_db),
    type: Optional[str] = None,
    user_id: Optional[int] = None,
    group_id: Optional[int] = None,
):
    stmt = select(MessageModel)
    if type:
        stmt = stmt.where(MessageModel.type == type)
    if user_id:
        stmt = stmt.where(
            or_(MessageModel.sender_id == user_id, MessageModel.recipient_id == user_id)
        )
    if group_id:
        stmt = stmt.where(MessageModel.group_id == group_id)
    stmt = stmt.order_by(MessageModel.timestamp.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.delete("/{message_id}")
async def delete_message(message_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MessageModel).where(MessageModel.id == message_id))
    message = result.scalar_one_or_none()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    await db.delete(message)
    await db.commit()
    return {"detail": "Message deleted"} 