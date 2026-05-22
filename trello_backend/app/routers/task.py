from fastapi import Depends,HTTPException,APIRouter
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.task import TaskCreate,TaskResponse,TaskUpdate
from app.dependencies.auth import get_current_user
from app.services import task_service
from app.services.task_service import create_task as create_task_funct
router= APIRouter()

@router.post("/", response_model=TaskResponse)
def create_task(
    task:TaskCreate,
    db:Session= Depends(get_db),
    current_user=Depends(get_current_user)
):
    new_task=create_task_funct(
        db=db,
        title=task.title,
        project_id=task.project_id,
        description=task.description,
        user_id=current_user.id
    )

    return new_task

@router.get("/{project_id}", response_model=list[TaskResponse])
def get_tasks_by_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    tasks = task_service.get_tasks_by_project(
        db=db,
        project_id=project_id
    )

    return tasks

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id:int,
    team_id:int,
    data:TaskUpdate,
    db:Session=Depends(get_db),
    current_user=Depends(get_current_user)
):
    upadted_task=task_service.update_task(
        db=db,
        task_id=task_id,
        team_id=team_id,
        user_id=current_user.id,
        new_title=data.title,
        description=data.description
    )
    return upadted_task
@router.patch("/{task_id}/status", response_model=TaskResponse)
def change_task_status(
    task_id: int,
    new_status: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return task_service.update_task_status(
        db=db,
        user_id=current_user.id,
        task_id=task_id,
        new_status=new_status
    )

@router.put("/{task_id}/assign", response_model=TaskResponse)
def assign_task(
    task_id: int,
    team_id: int,
    assigned_to_user_id: int, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return task_service.assign_task(
        db=db,
        team_id=team_id,
        user_id=current_user.id,
        task_id=task_id,
        assigned_to_user_id=assigned_to_user_id
    )  
@router.delete("/{task_id}")
def delete_task_api(
    task_id:int,
    db:Session=Depends(get_db),
    current_user=Depends(get_current_user)
):
    task_service.delete_task(
        db=db,
        task_id=task_id,
        user_id=current_user.id
    )