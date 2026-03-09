from .database import Base
from sqlalchemy import Column, String, TIMESTAMP, text, func
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
import uuid


class User(Base):
    __tablename__ = "users"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    created_at = Column(
        TIMESTAMP(timezone=True), nullable=False, server_default=text("now()")
    )
    update_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("now()"),
        server_onupdate=func.now(),
    )
