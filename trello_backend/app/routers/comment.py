from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.dependencies.auth import get_current_user
from app.schemas.comment import CommentCreate,CommentResponse
from app.services.comment_service import create_comment as create_comment_funct
from app.services import comment_service
router= APIRouter()

@router.post("/comments",response_model=CommentResponse)
def create_comment(
    comment:CommentCreate,
    db:Session=Depends(get_db),
    current_user=Depends(get_current_user)
):
    new_comment=create_comment_funct(
        db=db,
        task_id=comment.task_id,
        team_id=comment.team_id,
        content=comment.content,
        user_id=current_user.id
    )
    return new_comment

@router.get("/comments/{task_id}", response_model=list[CommentResponse])
def get_comment(
    task_id:int,
    team_id:int,
    db:Session=Depends(get_db),
    current_user=Depends(get_current_user)
):
    comments=comment_service.get_comments_by_task(
        db=db,
        task_id=task_id,
        user_id=current_user.id

    )
    return comments

@router.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return comment_service.delete_comment(
        db=db,
        comment_id=comment_id,
        user_id=current_user.id
    )