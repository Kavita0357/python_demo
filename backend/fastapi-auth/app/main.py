from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth import router as auth_router

app = FastAPI(
    title="React FastAPI Authentication API",
    version="1.0.0",
)

app.include_router(auth_router)

# React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "FastAPI Auth API is running"}


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
