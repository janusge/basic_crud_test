from datetime import datetime, timedelta, timezone
from .. import models, schemas, utils
from ..database import get_db
from uuid import UUID
from sqlalchemy.orm import Session
from fastapi import Depends
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def authenticate_user(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user:
        return False

    if not pwd_context.verify(password, user.password):
        return False

    return user


def get_user_by_email(email: str, db: Session = Depends(get_db)):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(user: schemas.CreateUser, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(user.password)
    user.password = hashed_password
    new_user = models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user.id
