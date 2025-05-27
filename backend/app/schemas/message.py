from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MessageBase(BaseModel):
    content: str
    type: str = 'public'  # 'public', 'private', 'group'
    recipient_id: Optional[int] = None
    group_id: Optional[int] = None

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    sender_id: int
    timestamp: datetime

    class Config:
        orm_mode = True 