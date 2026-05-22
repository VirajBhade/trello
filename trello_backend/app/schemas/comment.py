from pydantic import BaseModel

class CommentCreate(BaseModel):
    content:str
    task_id:int
    team_id:int

class CommentResponse(BaseModel):
    id:int
    content:str
    task_id:int
    user_id:int
    

    
