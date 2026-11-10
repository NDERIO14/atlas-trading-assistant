
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create the FastAPI application
app = FastAPI(
    title="ATLAS API",
    description="AI-powered Futures Trading Assistant",
    version="0.1.0"
)

# Allow our Next.js frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Basic application route
@app.get("/")
async def root():
    return {
        "message": "Welcome to ATLAS API",
        "status": "running"
    }


# Backend health-check endpoint
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "atlas-backend",
        "version": "0.1.0"
    }
