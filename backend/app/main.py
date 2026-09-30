from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.users import router as users_router
from app.db.database import init_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_database()

    yield




app = FastAPI(
    title="DevPath AI API",
    description="AI-powered developer learning platform",
    version="0.1.0",
    lifespan=lifespan,
)


app.include_router(
    users_router,
    prefix="/api/v1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "Welcome to DevPath AI"
    }


@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "ok"
    }