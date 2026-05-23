from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import engine, Base


from app.models.users import User
from app.models.team import Team
from app.models.project import Project
from app.models.task import Task
from app.models.comment import Comment


from app.routers import auth
from app.routers import team
from app.routers import projects
from app.routers import task
from app.routers import comment

app = FastAPI()


Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])

app.include_router(team.router, prefix="/teams", tags=["Teams"])

app.include_router(projects.router, prefix="/projects", tags=["Projects"])

app.include_router(task.router, prefix="/tasks", tags=["Tasks"])

app.include_router(comment.router, prefix="/comments", tags=["Coments"])