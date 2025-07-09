from sqlalchemy.orm import Session
from app import models, schemas
from typing import List, Optional
from sqlalchemy import func

def create_feedback(db: Session, feedback: schemas.FeedbackCreate):
    db_feedback = models.Feedback(**feedback.dict())
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

def get_feedbacks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Feedback).offset(skip).limit(limit).all()

def get_feedback_by_id(db: Session, feedback_id: str):
    return db.query(models.Feedback).filter(models.Feedback.id == feedback_id).first()

def get_average_per_criteria(db: Session):
    averages = db.query(
        func.avg(models.Feedback.criteria_1),
        func.avg(models.Feedback.criteria_2),
        func.avg(models.Feedback.criteria_3),
        func.avg(models.Feedback.criteria_4),
        func.avg(models.Feedback.criteria_5),
        func.avg(models.Feedback.criteria_6),
        func.avg(models.Feedback.criteria_7),
    ).first()

    return {
        "criteria_1": round(averages[0] or 0, 2),
        "criteria_2": round(averages[1] or 0, 2),
        "criteria_3": round(averages[2] or 0, 2),
        "criteria_4": round(averages[3] or 0, 2),
        "criteria_5": round(averages[4] or 0, 2),
        "criteria_6": round(averages[5] or 0, 2),
        "criteria_7": round(averages[6] or 0, 2),
    }
