from sqlalchemy.orm import Session
from app.models.task import Task
from fastapi import HTTPException
from app.models.project import Project
from app.models.team import Team,TeamMember

def create_task(db:Session, title:str, project_id:int, user_id:int, description:int):
    project=db.query(Project).filter(Project.id==project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    membership = db.query(TeamMember).filter(
        TeamMember.user_id == user_id
    ).first()

    if not membership:
        raise HTTPException(status_code=403, detail="You are not a member of this team")
    
    new_task=Task(title=title, project_id=project_id, description=description)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

def get_tasks_by_project(db: Session, project_id: int):

    tasks = db.query(Task).filter(
        Task.project_id == project_id
    ).all()

    return tasks 

def update_task(db: Session, team_id: int, user_id: int, task_id: int, new_title: str, description: str):
    
    admin_check = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == user_id,
        TeamMember.role == "admin"
    ).first()
    if not admin_check:
        raise HTTPException(status_code=403, detail="Only admins can update tasks")

    
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")


    task.title = new_title
    task.description = description
    db.commit()
    db.refresh(task)
    return task

def update_task_status(db: Session, user_id: int, task_id: int, new_status: str):
    
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

  
    task.status = new_status
    db.commit()
    db.refresh(task)
    return task

def assign_task(db:Session, team_id:int, user_id:int, task_id:int, assigned_to_user_id:int):
    admin_check = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == user_id,
        TeamMember.role == "admin"
    ).first()
    if not admin_check:
        raise HTTPException(status_code=403, detail="Only admins can update tasks")
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    is_assignee_in_team = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == assigned_to_user_id
    ).first()

    if not is_assignee_in_team:
        raise HTTPException(status_code=404, detail="Assignee is not a member of this team")
    
    task.assigned_to = assigned_to_user_id
    db.commit()
    db.refresh(task)
    
    return task

def delete_task(
    db: Session,
    task_id: int,
    user_id: int
):

    task = db.query(Task).filter(
        Task.id == task_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    db.delete(task)

    db.commit()

    return {"message": "Task deleted successfully"}

    


     


