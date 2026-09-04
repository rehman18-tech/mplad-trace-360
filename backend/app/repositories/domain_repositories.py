from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_
from .base_repository import BaseRepository
from ..models.schema import Project, Contractor, Alert, FieldInspection, Complaint

class ProjectRepository(BaseRepository[Project]):
    def __init__(self, db: Session):
        super().__init__(Project, db)

    def search(
        self,
        query: Optional[str] = None,
        state: Optional[str] = None,
        district: Optional[str] = None,
        status: Optional[str] = None,
        risk_level: Optional[str] = None,
        sector: Optional[str] = None,
        skip: int = 0,
        limit: int = 50
    ) -> List[Project]:
        q = self.db.query(Project)
        if query:
            pattern = f%{query}%
            q = q.filter(
                or_(
                    Project.title.ilike(pattern),
                    Project.id.ilike(pattern),
                    Project.mp_name.ilike(pattern),
                    Project.constituency.ilike(pattern),
                    Project.contractor_name.ilike(pattern)
                )
            )
        if state:
            q = q.filter(Project.state == state)
        if district:
            q = q.filter(Project.district == district)
        if status:
            q = q.filter(Project.status == status)
        if risk_level:
            q = q.filter(Project.risk_level == risk_level)
        if sector:
            q = q.filter(Project.sector == sector)
        return q.offset(skip).limit(limit).all()

class ContractorRepository(BaseRepository[Contractor]):
    def __init__(self, db: Session):
        super().__init__(Contractor, db)

    def get_by_name(self, name: str) -> Optional[Contractor]:
        return self.db.query(Contractor).filter(Contractor.name == name).first()

class AlertRepository(BaseRepository[Alert]):
    def __init__(self, db: Session):
        super().__init__(Alert, db)

    def get_active(self, limit: int = 100) -> List[Alert]:
        return self.db.query(Alert).filter(Alert.status != RESOLVED).order_by(Alert.severity.desc()).limit(limit).all()

    def get_by_project(self, project_id: str) -> List[Alert]:
        return self.db.query(Alert).filter(Alert.project_id == project_id).all()
