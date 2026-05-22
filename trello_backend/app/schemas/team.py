from pydantic import BaseModel

class TeamCreate(BaseModel):
    name:str

class TeamResponse(BaseModel):
    id:int
    name:str
    owner_id:int
    class Config:
        from_attributes = True 