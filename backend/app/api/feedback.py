from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import schemas, models, crud
from app.db import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/feedback", response_model=schemas.FeedbackOut)
def create_feedback(feedback: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    return crud.create_feedback(db, feedback)

@router.get("/feedbacks", response_model=List[schemas.FeedbackOut])
def read_feedbacks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_feedbacks(db, skip=skip, limit=limit)

@router.get("/feedbacks/{feedback_id}", response_model=schemas.FeedbackOut)
def read_feedback(feedback_id: str, db: Session = Depends(get_db)):
    feedback = crud.get_feedback_by_id(db, feedback_id)
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return feedback

@router.get("/feedbacks/average")
def get_average_feedbacks(db: Session = Depends(get_db)):
    return crud.get_average_per_criteria(db)
