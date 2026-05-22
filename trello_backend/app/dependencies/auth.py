from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.security import decode_access_token
from app.models.users import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    print("TOKEN:", token)

    try:

        payload = decode_access_token(token)

        print("PAYLOAD:", payload)

        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except Exception as e:

        print("JWT ERROR:", e)

        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()

    print("USER:", user)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user