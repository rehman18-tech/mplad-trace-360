from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....database import get_db
from ....models.schema import Project

router = APIRouter(prefix="/documents", tags=["documents-v1"])

@router.get("/{project_id}")
def get_project_documents_v1(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    docs = [
        {
            "id": f"DOC-{project.id}-AA",
            "doc_type": "Administrative Approval",
            "title": f"Administrative Approval - {project.title}",
            "ref_number": f"GO/MPLADS/{project.id[:8]}/2024",
            "issued_date": "2024-02-15",
            "is_verified": True,
            "file_size_kb": 1240,
            "url": f"/documents/{project.id}_AA.pdf"
        },
        {
            "id": f"DOC-{project.id}-TS",
            "doc_type": "Technical Sanction",
            "title": f"Technical Sanction Order - {project.sector}",
            "ref_number": f"EE/PWD/TS/{project.id[:8]}",
            "issued_date": "2024-03-01",
            "is_verified": True,
            "file_size_kb": 3480,
            "url": f"/documents/{project.id}_TS.pdf"
        },
        {
            "id": f"DOC-{project.id}-MB",
            "doc_type": "Measurement Book",
            "title": f"Measurement Book Record (MB #{project.id[-4:]})",
            "ref_number": f"MB-VOL-IV-P{project.id[-3:]}",
            "issued_date": "2024-07-10",
            "is_verified": project.physical_progress > 30,
            "file_size_kb": 4120,
            "url": f"/documents/{project.id}_MB.pdf"
        }
    ]
    return docs
