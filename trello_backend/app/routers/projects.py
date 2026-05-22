from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.project import ProjectCreate,ProjectResponse
from app.dependencies.auth import get_current_user
from app.services.project_service import create_project as create_project_func
from app.services import project_service
router= APIRouter()

@router.post("/", response_model=ProjectResponse)
def create_project(
    project:ProjectCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    new_project=create_project_func(
        db= db,
        team_id=project.team_id,
        name=project.name,
        user_id=current_user.id
    )
    return new_project

@router.get("/{team_id}", response_model=list[ProjectResponse])
def get_all_project_for_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    projects = project_service.get_project_team(
        db=db,
        team_id=team_id,
        user_id=current_user.id,
    )

    return projects

from pydantic import BaseModel

class ProjectUpdate(BaseModel):
    name: str


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project_api(
    project_id: int, 
    data:ProjectUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    
    updated_project = project_service.update_project(
        db=db,
        project_id=project_id,
        user_id=current_user.id,
        new_name=data.name
    )
    return updated_project
    
@router.delete("/{project_id}")
def delete_project_api(
    project_id: int, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):

    project_service.delete_project(
        db=db, 
        project_id=project_id, 
        user_id=current_user.id
    )
    return {"message": "Project deleted successfully"}

