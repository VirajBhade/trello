from sqlalchemy.orm import Session
from app.models.team import Team,TeamMember  
from app.models.users import User
from fastapi import HTTPException,Depends


def create_team(db: Session, team_name: str, owner_id: int):

    print("OWNER ID:", owner_id)

    new_team = Team(
        name=team_name,
        owner_id=owner_id
    )

    db.add(new_team)
    db.commit()
    db.refresh(new_team)

    print("TEAM CREATED:", new_team.id)

    new_member = TeamMember(
        team_id=new_team.id,
        user_id=owner_id,
        role="admin"
    )

    db.add(new_member)
    db.commit()
    db.refresh(new_member)

    print("MEMBER CREATED:", new_member.id)

    return new_team


def get_user_teams(db: Session, user_id: int):
   
    memberships = db.query(TeamMember).filter(TeamMember.user_id == user_id).all()
    
    
    return [m.team for m in memberships]



def invite_member(db: Session, team_id: int, admin_id: int, user_to_add_id: int):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")


    admin_check = db.query(TeamMember).filter(
        TeamMember.team_id == team_id, 
        TeamMember.user_id == admin_id,
        TeamMember.role == "admin"
    ).first()

    if not admin_check:
        raise HTTPException(status_code=403, detail="Only team admins can invite members")
    
    new_member = TeamMember(team_id=team_id, user_id=user_to_add_id, role="member",)
    db.add(new_member)
    db.commit()
    return {"message": "User invited successfully"}


def remove_member(db: Session, team_id: int, admin_id: int, user_to_remove_id: int):
    
    admin_check = db.query(TeamMember).filter(
        TeamMember.team_id == team_id, 
        TeamMember.user_id == admin_id,
        TeamMember.role == "admin"
    ).first()
    
    if not admin_check:
        raise HTTPException(status_code=403, detail="Only admins can remove members")

    
    membership = db.query(TeamMember).filter(
        TeamMember.team_id == team_id, 
        TeamMember.user_id == user_to_remove_id
    ).first()

    if not membership:
        raise HTTPException(status_code=404, detail="User is not in this team")

    
    db.delete(membership)
    db.commit()
    return {"message": "Member removed successfully"}


