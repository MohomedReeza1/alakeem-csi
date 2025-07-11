from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app import schemas, models, crud
from app.db import SessionLocal
from datetime import date

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/feedback", response_model=schemas.FeedbackResponse)
def create_feedback(feedback: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    crud.create_feedback(db, feedback)
    return {"message": "Feedback submitted successfully"}

@router.get("/feedbacks", response_model=List[schemas.FeedbackOut])
def read_feedbacks(
    skip: int = 0,
    limit: int = 15,
    name: Optional[str] = None,
    passport_number: Optional[str] = None,
    reference_number: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    min_rating: Optional[float] = None,
    max_rating: Optional[float] = None,
    criterion: Optional[str] = None,
    criterion_value: Optional[int] = None,
    db: Session = Depends(get_db)
):
    feedbacks = crud.get_feedbacks(
        db,
        skip=skip,
        limit=limit,
        name=name,
        passport_number=passport_number,
        reference_number=reference_number,
        start_date=start_date,
        end_date=end_date,
        min_rating=min_rating,
        max_rating=max_rating,
        criterion=criterion,
        criterion_value=criterion_value
    )
    return feedbacks

@router.get("/feedbacks/average")
def get_average_feedbacks(db: Session = Depends(get_db)):
    return crud.get_average_per_criteria(db)

@router.get("/feedbacks/{feedback_id}", response_model=schemas.FeedbackOut)
def read_feedback(feedback_id: str, db: Session = Depends(get_db)):
    feedback = crud.get_feedback_by_id(db, feedback_id)
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return feedback

@router.get("/feedbacks/monthly_counts")
def get_monthly_feedback_counts(db: Session = Depends(get_db)):
    return crud.get_monthly_feedback_counts(db)

@router.get("/feedbacks/top_complaints", response_model=List[schemas.FeedbackOut])
def get_top_complaints(db: Session = Depends(get_db), limit: int = 5):
    feedbacks = crud.get_top_complaints(db, limit)
    return feedbacks
