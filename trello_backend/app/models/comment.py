from sqlalchemy import Integer,String,ForeignKey,Column
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Comment(Base):
    __tablename__="comments"

    id=Column(Integer,primary_key=True,index=True)
    content=Column(String(300))
    task_id=Column(Integer, ForeignKey("tasks.id"),nullable=False)
    user_id=Column(Integer, ForeignKey("users.id"), nullable=False)

    task=relationship("Task", back_populates="comments")
    user=relationship("User",back_populates="comments")


    
