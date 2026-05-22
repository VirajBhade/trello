from pydantic import BaseModel

class ProjectCreate(BaseModel):
    name:str
    team_id:int

class ProjectResponse(BaseModel):
    id:int
    name:str
    team_id:int

    