from sqlalchemy import Column,Integer,ForeignKey,String
from sqlalchemy.orm import relationship
from app.database.connection import Base

class User(Base):
    __tablename__="users"
    id=Column(Integer, primary_key=True, index=True)
    name=Column(String(50),nullable=False)
    email=Column(String(100),unique=True,nullable=False)
    password=Column(String(300),nullable=False)
    
    owned_teams = relationship("Team", back_populates="owner")
    comments = relationship("Comment", back_populates="user")
   
    

