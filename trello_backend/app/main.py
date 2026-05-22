from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, team, projects, task, comment

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(team.router, prefix="/teams", tags=["Teams"])
app.include_router(projects.router, prefix="/projects", tags=["Projects"])
app.include_router(task.router, prefix="/tasks", tags=["Tasks"])
app.include_router(comment.router, prefix="/comments", tags=["Comments"])