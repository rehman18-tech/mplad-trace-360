from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.schema import Contractor, Project
from ..schemas.schemas import ContractorSchema, ProjectSummarySchema

router = APIRouter(prefix="/contractors", tags=["contractors"])

@router.get("", response_model=List[ContractorSchema])
def list_contractors(
    risk_level: Optional[str] = None,
    state: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Contractor)
    if risk_level:
        query = query.filter(Contractor.risk_level == risk_level)
    if state:
        query = query.filter(Contractor.state == state)
    return query.all()

@router.get("/{contractor_id}", response_model=ContractorSchema)
def get_contractor(contractor_id: str, db: Session = Depends(get_db)):
    contractor = db.query(Contractor).filter(Contractor.id == contractor_id).first()
    if not contractor:
        raise HTTPException(status_code=404, detail="Contractor profile not found")
    return contractor

@router.get("/{contractor_id}/projects", response_model=List[ProjectSummarySchema])
def get_contractor_projects(contractor_id: str, db: Session = Depends(get_db)):
    projects = db.query(Project).filter(Project.contractor_id == contractor_id).all()
    return projects
