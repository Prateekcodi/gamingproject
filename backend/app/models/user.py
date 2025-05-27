from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.sqlite import JSON
from app.database import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    avatar = Column(String, nullable=True)
    settings = Column(JSON, nullable=True) 