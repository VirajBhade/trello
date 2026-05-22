from pydantic import BaseModel
from typing import Optional

class TaskCreate(BaseModel):
    title: str
    project_id: int
    description: Optional[str] = None
    assigned_to: Optional[int] = None
    team_id: Optional[int] = None

class TaskUpdate(BaseModel):
    title:str
    description:str

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None 
    status: str
    project_id: int
    assigned_to: Optional[str]  = None 

    class Config:
        from_attributes = True
