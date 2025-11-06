from sqlalchemy import Column, Integer, String, Date, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db import Base

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, nullable=False)
    passport_number = Column(String, nullable=False)
    reference_number = Column(String, nullable=False)
    comment = Column(String)

    security_welcome = Column(Integer, nullable=False)
    criteria_1 = Column(Integer, nullable=False)
    criteria_2 = Column(Integer, nullable=False)
    criteria_3 = Column(Integer, nullable=False)
    criteria_4 = Column(Integer, nullable=False)
    criteria_5 = Column(Integer, nullable=False)
    criteria_6 = Column(Integer, nullable=False)
    criteria_7 = Column(Integer, nullable=False)

    created_at = Column(Date, server_default=func.current_date(), nullable=False)
