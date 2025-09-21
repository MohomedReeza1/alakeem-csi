from pydantic import BaseModel
from uuid import UUID

class AdminBase(BaseModel):
    username: str

class AdminCreate(AdminBase):
    password: str

class AdminOut(AdminBase):
    id: UUID

    class Config:
        orm_mode = True
