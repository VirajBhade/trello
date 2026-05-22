from sqlalchemy import Column,Integer,String,ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Task(Base):
    __tablename__="tasks"

    id=Column(Integer,primary_key=True, index=True)
    title=Column(String(100), nullable=False)
    description=Column(String(100))
    status=Column(String(20), default="todo")
    project_id=Column(Integer, ForeignKey("projects.id"))
    assigned_to=Column(Integer,ForeignKey("users.id"))

    project=relationship("Project", back_populates="task")
    comments = relationship("Comment", back_populates="task")



