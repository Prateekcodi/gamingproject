from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class StudyPlanBase(BaseModel):
    subject: str
    exam_date: str = Field(..., description="Date in ISO format (YYYY-MM-DD)")
    description: Optional[str] = None

class StudyPlanCreate(StudyPlanBase):
    pass

class StudyPlan(StudyPlanBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 