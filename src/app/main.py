from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from .database import engine
from .routers.projects import router as projects_router
from .routers.auth import router as auth_router
from .routers.tickets import router as tickets_router

app = FastAPI(
    title="CDD Issue Tracker",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    async with engine.connect() as connection:
        await connection.execute(text("SELECT 1"))

    return {
        "status": "healthy",
        "database": "connected",
    }


app.include_router(projects_router)
app.include_router(auth_router)
app.include_router(tickets_router)