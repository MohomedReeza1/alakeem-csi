from pydantic import BaseModel

class AdminBase(BaseModel):
    username: str

class AdminCreate(AdminBase):
    password: str

class AdminOut(AdminBase):
    id: str

    class Config:
        orm_mode = True
