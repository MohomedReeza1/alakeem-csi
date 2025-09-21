from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud
from app.db import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register-admin", response_model=schemas.AdminOut)
def register_admin(admin: schemas.AdminCreate, db: Session = Depends(get_db)):
    existing_admin = crud.admin.get_admin_by_username(db, admin.username)
    if existing_admin:
        raise HTTPException(status_code=400, detail="Username already exists")

    new_admin = crud.admin.create_admin(db, admin)
    return new_admin
