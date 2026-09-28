from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth import router as auth_router
from app.routers.roles import router as roles_router
from app.routers.users import router as users_router
from app.routers.leave_types import router as leave_type_router
from app.routers.leave_balances import router as leave_balance_router
from app.routers.leaves import router as leave_router
from app.routers.dossiers import router as dossier_router

app = FastAPI(
    title="React FastAPI Authentication API",
    version="1.0.0",
)

app.include_router(auth_router)
app.include_router(roles_router)
app.include_router(users_router)
app.include_router(leave_type_router)
app.include_router(leave_balance_router)
app.include_router(leave_router)
app.include_router(dossier_router)

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
