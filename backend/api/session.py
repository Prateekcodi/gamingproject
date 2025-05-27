from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel
from typing import List

router = APIRouter()

class Session(BaseModel):
  id: int
  subject: str
  date: str
  duration: int

class SessionCreate(BaseModel):
  subject: str
  date: str
  duration: int

sessions: List[Session] = []

@router.post("/api/sessions", response_model=Session, status_code=status.HTTP_201_CREATED)
async def create_session(session: SessionCreate):
  if not session.subject or not session.date or not session.duration:
    raise HTTPException(status_code=400, detail="Missing fields")
  new_session = Session(
    id=len(sessions) + 1,
    subject=session.subject,
    date=session.date,
    duration=session.duration
  )
  sessions.append(new_session)
  return new_session