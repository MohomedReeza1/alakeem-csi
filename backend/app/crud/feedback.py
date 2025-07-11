from sqlalchemy.orm import Session
from app import models, schemas
from typing import List, Optional
from sqlalchemy import func, and_, extract
from datetime import date

def create_feedback(db: Session, feedback: schemas.FeedbackCreate):
    db_feedback = models.Feedback(**feedback.dict())
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

def get_feedbacks(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    name: Optional[str] = None,
    passport_number: Optional[str] = None,
    reference_number: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    min_rating: Optional[float] = None,
    max_rating: Optional[float] = None,
    criterion: Optional[str] = None,
    criterion_value: Optional[int] = None,
):
    query = db.query(models.Feedback)

    if name:
        query = query.filter(models.Feedback.name.ilike(f"%{name}%"))
    if passport_number:
        query = query.filter(models.Feedback.passport_number.ilike(f"%{passport_number}%"))
    if reference_number:
        query = query.filter(models.Feedback.reference_number.ilike(f"%{reference_number}%"))
    if start_date:
        query = query.filter(models.Feedback.created_at >= start_date)
    if end_date:
        query = query.filter(models.Feedback.created_at <= end_date)

    if criterion and criterion_value is not None:
        criterion_column = getattr(models.Feedback, criterion, None)
        if criterion_column is not None:
            query = query.filter(criterion_column == criterion_value)

    if min_rating is not None or max_rating is not None:
        avg_rating = (
            (models.Feedback.criteria_1 +
             models.Feedback.criteria_2 +
             models.Feedback.criteria_3 +
             models.Feedback.criteria_4 +
             models.Feedback.criteria_5 +
             models.Feedback.criteria_6 +
             models.Feedback.criteria_7) / 7.0
        )
        if min_rating is not None:
            query = query.filter(avg_rating >= min_rating)
        if max_rating is not None:
            query = query.filter(avg_rating <= max_rating)

    return query.order_by(models.Feedback.created_at.desc()).offset(skip).limit(limit).all()

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

def get_monthly_feedback_counts(db: Session):
    results = db.query(
        extract('year', models.Feedback.created_at).label('year'),
        extract('month', models.Feedback.created_at).label('month'),
        func.count(models.Feedback.id)
    ).group_by('year', 'month').order_by('year', 'month').all()

    monthly_counts = [{"year": int(r[0]), "month": int(r[1]), "count": r[2]} for r in results]
    return monthly_counts

def get_top_complaints(db: Session, limit: int = 5):
    avg_rating_expr = (
        (models.Feedback.criteria_1 + models.Feedback.criteria_2 + models.Feedback.criteria_3 +
         models.Feedback.criteria_4 + models.Feedback.criteria_5 + models.Feedback.criteria_6 +
         models.Feedback.criteria_7) / 7
    )

    feedbacks = db.query(models.Feedback).filter(models.Feedback.comment != None).order_by(
        avg_rating_expr.asc()
    ).limit(limit).all()

    return feedbacks
