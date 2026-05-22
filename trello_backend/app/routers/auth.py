from app.schemas.users import UserCreate, UserLogin, UserResponse
from fastapi import HTTPException
from app.models.users import User
from fastapi import APIRouter,Depends
router=APIRouter()
from sqlalchemy.orm import Session
from app.dependencies.auth import get_current_user

from app.services.auth_service import create_user, login_user 
from app.database.connection import get_db 



@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    new_user = create_user(db, user.name, user.email, user.password)
    if new_user is None:
        raise HTTPException(status_code=400, detail="User already exists")
    return new_user
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    token = login_user(db, form_data.username, form_data.password)



    if token is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user


 



