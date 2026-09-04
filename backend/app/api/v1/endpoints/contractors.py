from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....database import get_db
from ....models.schema import Contractor
from ....schemas.schemas import ContractorSchema

router = APIRouter(prefix="/contractors", tags=["contractors-v1"])

@router.get("", response_model=List[ContractorSchema])
def list_contractors_v1(search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Contractor)
    if search:
        s = f"%{search}%"
        query = query.filter((Contractor.name.ilike(s)) | (Contractor.id.ilike(s)))
    return query.all()

@router.get("/{contractor_id}", response_model=ContractorSchema)
def get_contractor_detail_v1(contractor_id: str, db: Session = Depends(get_db)):
    c = db.query(Contractor).filter(Contractor.id == contractor_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Contractor not found")
    return c
