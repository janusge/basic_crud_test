
from typing import Annotated, List
from fastapi import HTTPException, Depends, status, APIRouter
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from uuid import UUID
from ..JWTBearer import JWTBearer
from ..auth import verify_user_token, create_token
from ..application.users import authenticate_user, get_user_by_email, create_user

router = APIRouter(prefix="/users", tags=["Users"])

db_dependency = Annotated[Session, Depends(get_db)]

@router.post("/login", summary="Login user and get access token")
def login_for_access_token(user_login: schemas.UserLogin, db: db_dependency):
    user = authenticate_user(user_login.email, user_login.password, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_token(user)

    return {"access_token": access_token, "token_type": "bearer"}



@router.get("/verify-token/{token}")
def verify_token(token: str):
    return verify_user_token(token)


@router.get("/", response_model=List[schemas.UserOut])
def test_users(db: db_dependency, token: str = Depends(JWTBearer())):
    users = db.query(models.User).all()

    return users

@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: UUID, db: db_dependency, token: str = Depends(JWTBearer())):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return user

@router.post("/", status_code=status.HTTP_201_CREATED)
def register_user(user_create: schemas.CreateUser, db: db_dependency):
    db_user = get_user_by_email(user_create.email, db)

    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user_id = create_user(user_create, db)

    return {"id": str(user_id), "message": "User created successfully"}

@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: UUID, user_update: schemas.UserBase, db: db_dependency, token: str = Depends(JWTBearer())):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    user.name = user_update.name
    user.email = user_update.email

    db.commit()
    db.refresh(user)

    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: UUID, db: db_dependency, token: str = Depends(JWTBearer())):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    db.delete(user)
    db.commit()
