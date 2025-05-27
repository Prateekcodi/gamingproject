from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
from .database import engine, Base
from .routes import study_plans, messages, api
import logging
from .models.user import User
from .models.message import Message

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI(
    title=os.getenv("APP_NAME", "StudyPlanner API"),
    version=os.getenv("API_VERSION", "v1")
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://studifyka.netlify.app/",  # Replace with your actual Netlify URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include routers
app.include_router(study_plans.router, prefix="/api/study-plans", tags=["study-plans"])
app.include_router(messages.router)
app.include_router(api.router)

@app.on_event("startup")
async def startup():
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {str(e)}")
        raise

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error handler caught: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
    )

@app.get("/")
def read_root():
    return {
        "message": "Welcome to StudyPlanner API",
        "app_name": os.getenv("APP_NAME", "StudyPlanner API"),
        "version": os.getenv("API_VERSION", "v1")
    }
