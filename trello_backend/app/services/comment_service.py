from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.comment import Comment
from app.models.task import Task
from app.models.team import TeamMember

def create_comment(db:Session,user_id:int,team_id:int,content:str,task_id:int):
    task=db.query(Task).filter(Task.id==task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found in this team")
    membership = db.query(TeamMember).filter(
        TeamMember.team_id == team_id, 
        TeamMember.user_id == user_id
    ).first()

    if not membership:
        raise HTTPException(status_code=403, detail="You are not a member of this team")
    
    new_comment=Comment(
        content=content,
        task_id=task_id,
        user_id=user_id
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return new_comment

def get_comments_by_task(db: Session, task_id: int, team_id: int, user_id: int):

    membership = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == user_id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=403, detail="Not a team member")

    return db.query(Comment).filter(Comment.task_id == task_id).all()

def delete_comment(db: Session, comment_id: int, user_id: int):
    
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

   
    if comment.user_id != user_id:
        raise HTTPException(status_code=403, detail="You can only delete your own comments")

    db.delete(comment)
    db.commit()
    return {"detail": "Comment deleted"}

    

