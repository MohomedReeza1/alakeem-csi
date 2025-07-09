from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FeedbackBase(BaseModel):
    name: str
    passport_number: str
    reference_number: str
    comment: Optional[str] = None
    criteria_1: int
    criteria_2: int
    criteria_3: int
    criteria_4: int
    criteria_5: int
    criteria_6: int
    criteria_7: int

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackOut(FeedbackBase):
    id: str
    created_at: datetime

    class Config:
        orm_mode = True

class FeedbackResponse(BaseModel):
    message: str