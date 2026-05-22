from sqlalchemy.orm  import Session
from app.models.project import Project
from fastapi import HTTPException
from app.models.team import Team, TeamMember

def create_project(db:Session,team_id:int, name:str, user_id:int):

    team=db.query(Team).filter(Team.id==team_id).first()
    if not team:
        raise HTTPException(status_code=404 , detail="TEAM not found")
    membership = db.query(TeamMember).filter(
        TeamMember.team_id == team_id, 
        TeamMember.user_id == user_id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=403, detail="You are not a member of this team")
    
    new_project = Project(name=name, team_id=team_id)
    
    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project

def get_project_team(db:Session, user_id:int, team_id:int):
    membership = db.query(TeamMember).filter(
        TeamMember.team_id == team_id, 
        TeamMember.user_id == user_id
    ).first()

    if not membership:
        raise HTTPException(status_code=403, detail="You are not a member of this team")
    projects = db.query(Project).filter(Project.team_id == team_id).all()
    
    return projects

def update_project(db:Session, project_id:int, user_id:int, new_name:str):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    admin_check = db.query(TeamMember).filter(
        TeamMember.team_id == project.team_id, 
        TeamMember.user_id == user_id,
        TeamMember.role == "admin"
    ).first()
    if not admin_check:
        raise HTTPException(status_code=403, detail="only admin can update the project")
    
    project.name=new_name
    db.commit()
    db.refresh(project)

    return project

def delete_project(db:Session,project_id:int, user_id:int):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    admin_check = db.query(TeamMember).filter(
        TeamMember.team_id == project.team_id,
        TeamMember.user_id == user_id,
        TeamMember.role == "admin"
    ).first()
    if not admin_check:
        raise HTTPException(status_code=403, detail="only admin can delete the project")
    
    db.delete(project)
    db.commit()
    return project





        


