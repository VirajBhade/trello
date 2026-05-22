from sqlalchemy.orm import Session
from app.core.security import hash_password, verify_password, create_access_token
from app.models.users import User


# signup logic
def create_user(db: Session, name: str, email: str, password: str):
    print("Step 1: Checking for existing user...")
    existing_user = db.query(User).filter(User.email == email).first()
    
    if existing_user:
        print("Step 2: User exists, returning None")
        return None

    print("Step 3: Hashing password...")
    hashed_password = hash_password(password) 

    print("Step 4: Creating User object...")
    new_user = User(name=name, email=email, password=hashed_password)

    print("Step 5: Adding to DB...")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    print("Step 6: Done!")
    return new_user

#login logic 
def login_user(db: Session, email: str, password: str):
    # find the user
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    
# verify the  password
    if not verify_password(password, user.password):
        return None

    # create a  token
    token = create_access_token({"user_id": user.id})

    return token
    
    