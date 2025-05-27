from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .user import User
from app.database import Base

class Message(Base):
    __tablename__ = 'messages'
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey('users.id'))
    recipient_id = Column(Integer, ForeignKey('users.id'), nullable=True)  # For private messages
    group_id = Column(Integer, nullable=True)  # For group messages (can be extended to ForeignKey)
    content = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    type = Column(String, default='public')  # 'public', 'private', 'group'

    sender = relationship('User', foreign_keys=[sender_id])
    recipient = relationship('User', foreign_keys=[recipient_id]) 