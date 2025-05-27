from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import logging

from ..database import get_db
from ..models.study_plan import StudyPlan as StudyPlanModel
from ..schemas.study_plan import StudyPlan, StudyPlanCreate

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=StudyPlan)
async def create_study_plan(
    study_plan: StudyPlanCreate,
    db: AsyncSession = Depends(get_db),
    request: Request = None
):
    try:
        if request is not None:
            raw_body = await request.body()
            logger.info(f"Raw request body: {raw_body}")
        logger.info(f"Creating study plan with data: {study_plan.model_dump()}")
        db_study_plan = StudyPlanModel(**study_plan.model_dump())
        db.add(db_study_plan)
        await db.commit()
        await db.refresh(db_study_plan)
        logger.info(f"Successfully created study plan with ID: {db_study_plan.id}")
        return db_study_plan
    except Exception as e:
        logger.error(f"Error creating study plan: {str(e)}")
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create study plan: {str(e)}"
        )

@router.get("/", response_model=List[StudyPlan])
async def get_study_plans(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    try:
        result = await db.execute(select(StudyPlanModel).offset(skip).limit(limit))
        study_plans = result.scalars().all()
        return study_plans
    except Exception as e:
        logger.error(f"Error fetching study plans: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch study plans: {str(e)}"
        )

@router.get("/{study_plan_id}", response_model=StudyPlan)
async def get_study_plan(
    study_plan_id: int,
    db: AsyncSession = Depends(get_db)
):
    try:
        result = await db.execute(select(StudyPlanModel).filter(StudyPlanModel.id == study_plan_id))
        study_plan = result.scalar_one_or_none()
        if study_plan is None:
            raise HTTPException(status_code=404, detail="Study plan not found")
        return study_plan
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching study plan {study_plan_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch study plan: {str(e)}"
        )

@router.put("/{study_plan_id}", response_model=StudyPlan)
async def update_study_plan(
    study_plan_id: int,
    study_plan: StudyPlanCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        result = await db.execute(select(StudyPlanModel).filter(StudyPlanModel.id == study_plan_id))
        db_study_plan = result.scalar_one_or_none()
        if db_study_plan is None:
            raise HTTPException(status_code=404, detail="Study plan not found")
        
        for key, value in study_plan.model_dump().items():
            setattr(db_study_plan, key, value)
        
        await db.commit()
        await db.refresh(db_study_plan)
        return db_study_plan
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating study plan {study_plan_id}: {str(e)}")
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update study plan: {str(e)}"
        )

@router.delete("/{study_plan_id}")
async def delete_study_plan(
    study_plan_id: int,
    db: AsyncSession = Depends(get_db)
):
    try:
        result = await db.execute(select(StudyPlanModel).filter(StudyPlanModel.id == study_plan_id))
        db_study_plan = result.scalar_one_or_none()
        if db_study_plan is None:
            raise HTTPException(status_code=404, detail="Study plan not found")
        
        await db.delete(db_study_plan)
        await db.commit()
        return {"message": "Study plan deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting study plan {study_plan_id}: {str(e)}")
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete study plan: {str(e)}"
        )