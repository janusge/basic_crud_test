from datetime import datetime, timedelta, timezone
from typing import Annotated, List
from jose import jwt
from fastapi import HTTPException, Depends, status, APIRouter
from sqlalchemy.orm import Session
from .. import models
from .. import schemas
from ..database import get_db
from passlib.context import CryptContext
from .. import security
from uuid import UUID

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
router = APIRouter(prefix="/users", tags=["Users"])

db_dependency = Annotated[Session, Depends(get_db)]


@router.get("/", response_model=List[schemas.UserOut])
def test_users(db: db_dependency):
    users = db.query(models.User).all()

    return users


def authenticate_user(email: str, password: str, db: db_dependency) -> bool:
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user:
        return False

    if not pwd_context.verify(password, user.password):
        return False

    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode, security.SECRET_KEY, algorithm=security.ALGORITHM
    )

    return encoded_jwt


def get_user_by_email(db: db_dependency, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: db_dependency, user: schemas.CreateUser):
    hashed_password = pwd_context.hash(user.password)
    user.password = hashed_password
    new_user = models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user.id


@router.post("/", status_code=status.HTTP_201_CREATED)
def register_user(user_create: schemas.CreateUser, db: db_dependency):
    db_user = get_user_by_email(db, user_create.email)

    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user_id = create_user(db, user_create)

    return {"id": str(user_id), "message": "User created successfully"}


@router.post("/token")
def login_for_access_token(user_login: schemas.UserLogin, db: db_dependency):
    user = authenticate_user(user_login.email, user_login.password, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/verify-token/{token}")
def verify_user_token(token: str):
    try:
        payload = jwt.decode(
            token, security.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: UUID, user_update: schemas.CreateUser, db: db_dependency):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    user.name = user_update.name
    user.email = user_update.email
    user.password = pwd_context.hash(user_update.password)

    db.commit()
    db.refresh(user)

    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: UUID, db: db_dependency):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    db.delete(user)
    db.commit()
