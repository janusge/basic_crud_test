from pydantic import BaseModel, EmailStr
from uuid import UUID


class UserBase(BaseModel):
    name: str
    email: EmailStr

    class Config:
        orm_mode = True


class UserOut(UserBase):
    id: UUID

    class Config:
        orm_mode = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class CreateUser(UserBase):
    password: str

    class Config:
        orm_mode = True


class Joke(BaseModel):
    value: str

    class Config:
        orm_mode = True
