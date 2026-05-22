from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.team import TeamCreate, TeamResponse
from app.database.connection import get_db
from app.dependencies.auth import get_current_user
from app.services.team_service import create_team as create_team_func
from app.services.team_service import get_user_teams, invite_member as invite_member_service
from pydantic import BaseModel
from app.services import team_service

router = APIRouter()


class InviteRequest(BaseModel):
    user_id: int


@router.post("/", response_model=TeamResponse)
def create_team(
    team: TeamCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    new_team = create_team_func(
        db=db,
        team_name=team.name,
        owner_id=current_user.id
    )
    
    if new_team is None:
        raise HTTPException(status_code=400, detail="Team already exists")

    return new_team

@router.get("/", response_model=list[TeamResponse])
def get_teams(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    
    teams = get_user_teams(db, current_user.id)
    return teams

@router.post("/{team_id}/invite")
def invite_user(
    team_id:int,
    data:InviteRequest,
    db:Session=Depends(get_db),
    current_user=Depends(get_current_user)
):
    new_member=invite_member_service(db=db, team_id=team_id,user_to_add_id=data.user_id,admin_id=current_user.id)
    if new_member is None:
        raise HTTPException(status_code=400, detail="member already exist")
    return {"message":"user added to team"}

@router.delete("/{team_id}/members/{user_id}")
def remove_team_member(
    team_id: int, 
    user_id: int, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    result = team_service.remove_member(
        db=db,
        team_id=team_id, 
        admin_id=current_user.id, 
        user_to_remove_id=user_id
    )
    if result is None:
        raise HTTPException(status_code=400, detail="user not found in team")
    return { "message":"user removed succesfully"}






