from sqlalchemy import Column,String,Integer,ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base


class Project(Base):
    __tablename__="projects"

    id=Column(Integer,primary_key=True, index=True)
    name=Column(String(50), nullable=False)
    team_id=Column(Integer, ForeignKey("teams.id"), nullable=False)

    team = relationship("Team", back_populates="projects")
    task=relationship("Task",  back_populates="project")
   
    
