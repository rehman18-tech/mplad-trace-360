from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .config import settings
from .models.schema import (
    Base, Project, Contractor, TimelineEvent, FundFlow,
    Inspection, Complaint, Dispute, Guarantee, Alert, AuditLog
)
from .seed_data import ALL_PROJECTS, CONTRACTORS_DATA

engine = create_engine(
    settings.DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_and_seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if already seeded
    if db.query(Contractor).first() or db.query(Project).first():
        db.close()
        return

    # 1. Seed Contractors
    for c_data in CONTRACTORS_DATA:
        contractor = Contractor(**c_data)
        db.add(contractor)
    db.commit()

    # 2. Seed Projects
    for p_data in ALL_PROJECTS:
        # Create Project
        proj_dict = dict(p_data)
        project = Project(**proj_dict)
        db.add(project)
        db.flush()

        # Seed 10-stage Lifecycle Timeline for Project
        p_id = project.id
        sanc = project.sanctioned_amount
        cont = project.contract_amount
        stages = [
            ("MP Recommendation", 1, "2025-01-15", f"Hon'ble MP {project.mp_name}", sanc + 50000, "MP_Proposal_Letter.pdf", "VERIFIED"),
            ("Administrative Sanction", 2, "2025-02-10", "District Collector / DDC", sanc, "Admin_Sanction_Order.pdf", "VERIFIED"),
            ("Technical Sanction", 3, "2025-03-05", "Superintending Engineer PWD", sanc, "Tech_Sanction_DPR.pdf", "VERIFIED"),
            ("Tender Notification", 4, "2025-03-25", "Executive Engineer", cont, "eTender_Notice_NIT.pdf", "VERIFIED"),
            ("Contract Award", 5, "2025-04-20", "District Tender Committee", cont, "Contract_Agreement_LOA.pdf", "VERIFIED"),
            ("Fund Release (First Tranche)", 6, "2025-05-15", "District Planning Office", round(cont * 0.4, -3), "Treasury_Disbursement.pdf", "VERIFIED"),
            ("Work Commencement", 7, "2025-06-01", "Executive Engineer & AE", None, "Site_Handover_Order.pdf", "VERIFIED"),
            ("Field Inspection #1", 8, "2025-09-12", "Assistant Executive Engineer", None, "Inspection_Report_01.pdf", "VERIFIED"),
            ("Progress & Measurement", 9, "2025-11-20", "Divisional Accounts Officer", round(cont * 0.35, -3), "MB_Measurement_Record.pdf", "PARTIAL" if project.overall_risk_score > 50 else "VERIFIED"),
            ("Completion & Handover", 10, "2026-02-15" if project.status == "COMPLETED" else "Scheduled 2026-04", "Executive Engineer & District Collector", None, "Completion_Certificate.pdf" if project.status == "COMPLETED" else None, "VERIFIED" if project.status == "COMPLETED" else "PENDING")
        ]
        for s_name, s_ord, s_date, s_auth, s_amt, s_doc, s_ver in stages:
            te = TimelineEvent(
                id=f"TL-{p_id}-{s_ord}",
                project_id=p_id,
                stage_name=s_name,
                stage_order=s_ord,
                event_date=s_date,
                authority=s_auth,
                amount=s_amt,
                document_name=s_doc,
                document_url=f"/documents/{s_doc}" if s_doc else None,
                verification_status=s_ver,
                notes=f"Milestone step {s_ord} for {project.title} recorded in official register."
            )
            db.add(te)

        # Seed Fund Flows
        fund_stages = [
            ("Funds Available", project.recommended_amount, "2025-01-20", f"TX-GOI-{p_id[-5:]}-01", "Ministry of Statistics & Programme Implementation (MoSPI)", "District Treasury"),
            ("Sanctioned", project.sanctioned_amount, "2025-02-15", f"TX-DPC-{p_id[-5:]}-02", "District Collectorate", "Implementing Agency Bank Account"),
            ("Contracted", project.contract_amount, "2025-04-25", f"TX-AGR-{p_id[-5:]}-03", "Implementing Division", f"Contractor: {project.contractor_name}"),
            ("Released", project.funds_released, "2025-05-18", f"TX-REL-{p_id[-5:]}-04", "District Nodal Bank", "Project Escrow A/c"),
            ("Paid", project.funds_paid, "2025-11-25", f"TX-PAY-{p_id[-5:]}-05", "Project Escrow A/c", f"Contractor: {project.contractor_name}"),
            ("Expenditure", project.actual_expenditure, "2026-01-10", f"TX-EXP-{p_id[-5:]}-06", "Treasury Measurement Book", "Work Site Materials & Labour")
        ]
        for f_stage, f_amt, f_date, f_ref, f_src, f_dst in fund_stages:
            ff = FundFlow(
                id=f"FF-{p_id}-{f_ref[-5:]}",
                project_id=p_id,
                stage=f_stage,
                amount=f_amt,
                transaction_date=f_date,
                reference_no=f_ref,
                source_agency=f_src,
                destination_agency=f_dst,
                verification_status="VERIFIED_GOVERNMENT_RECORD"
            )
            db.add(ff)

        # Seed Field Inspection
        insp = Inspection(
            id=f"INSP-{p_id}",
            project_id=p_id,
            officer_name="Shri R. K. Verma, AEE",
            officer_designation="Assistant Executive Engineer, PRED",
            inspection_date=project.last_inspected_date or "2026-02-12",
            latitude=project.latitude + 0.0001,
            longitude=project.longitude + 0.0001,
            gps_matched=True,
            distance_variance_meters=14.5,
            physical_progress_observed=project.physical_progress,
            quality_rating="Satisfactory" if project.overall_risk_score < 40 else "Requires Rectification",
            material_observations="Cement grade 43 PPC, tested aggregate on site. Structural columns cast according to schedule.",
            labour_activity_observations="18 workers on site during inspection. Reinforcement binding in progress.",
            general_remarks="Work verified against milestone DPR. Defect notices issued for unlevelled shuttering if any.",
            defects_reported="Minor honeycombing on column #4" if project.overall_risk_score > 50 else None,
            stalled_status=(project.status == "STALLED"),
            photo_urls=[
                "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600",
                "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600"
            ],
            ai_cv_similarity_score=0.91 if project.overall_risk_score < 50 else 0.72,
            ai_progress_discrepancy_pct=float(abs(project.financial_progress - project.physical_progress)),
            ai_verification_notes="Geotag confirmed within 15 meters of sanctioned point. Timestamp hash valid.",
            status="VERIFIED"
        )
        db.add(insp)

        # Seed Citizen Complaints for high risk projects
        if project.overall_risk_score >= 60:
            cmp = Complaint(
                id=f"CMP-{p_id}",
                project_id=p_id,
                citizen_name="Grievance Redressal Cell (Citizen Anonymized)",
                citizen_phone="+91 98765 XXXXX",
                citizen_email="citizen.complaint@gov.in",
                category="Work stopped" if project.status == "STALLED" else "Poor quality",
                description=f"Work on {project.title} has seen intermittent delays. Requesting district verification of structural progress.",
                evidence_photo_url="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600",
                location=f"{project.village}, {project.district}",
                submission_date="2026-01-20",
                status="INVESTIGATION",
                assigned_to="Assistant Executive Engineer",
                resolution_notes="Site inspection scheduled for physical verification."
            )
            db.add(cmp)

        # Seed Disputes for high risk / stalled projects
        if project.overall_risk_score >= 65:
            disp = Dispute(
                id=f"DSP-{p_id}",
                project_id=p_id,
                dispute_type="Progress dispute" if project.delay_days > 60 else "Payment dispute",
                claimant="Contractor",
                contractor_claim_progress=project.physical_progress + 15.0,
                officer_inspected_progress=project.physical_progress,
                financial_progress_record=project.financial_progress,
                ai_evidence_consistency="Medium",
                claimed_amount=round(project.contract_amount * 0.15, -3),
                description=f"Contractor submitted Running Account (RA) bill claiming higher progress than certified by field officer in measurement book.",
                status="UNDER_INVESTIGATION",
                resolution_summary="Joint measurement committee constituted by District Collector."
            )
            db.add(disp)

        # Seed Guarantee
        expiry_days = 25 if project.id == "MPLAD-UP-2026-00084" else (45 if project.overall_risk_score > 60 else 180)
        guar = Guarantee(
            id=f"PBG-{p_id}",
            project_id=p_id,
            contractor_name=project.contractor_name or "Executing Contractor",
            guarantee_type="Performance Bank Guarantee",
            bank_or_institution="State Bank of India / Punjab National Bank",
            amount=round(project.contract_amount * 0.05, -3), # 5% PBG
            issue_date="2025-04-22",
            expiry_date="2026-03-31" if expiry_days < 30 else "2026-08-30",
            days_to_expiry=expiry_days,
            status="EXPIRING_SOON" if expiry_days <= 30 else "ACTIVE",
            action_required=(expiry_days <= 30),
            defects_logged="Extension notice triggered due to pending project completion." if expiry_days <= 30 else None,
            contractor_response="Extension under process with branch manager" if expiry_days <= 30 else None
        )
        db.add(guar)

        # Seed Alert if Risk > 40
        if project.overall_risk_score >= 40:
            sev = "CRITICAL" if project.overall_risk_score >= 75 else ("HIGH" if project.overall_risk_score >= 55 else "MEDIUM")
            cat = "Schedule Delay" if project.delay_days > 45 else ("Cost Anomaly" if project.financial_progress > project.physical_progress + 15 else "Guarantee Alert")
            al = Alert(
                id=f"ALT-{p_id}",
                project_id=p_id,
                project_title=project.title,
                severity=sev,
                category=cat,
                title=f"Potential Anomaly: {cat} in {project.id}",
                description=f"Autonomous surveillance flagged {project.title}. Delay of {project.delay_days} days detected. Financial progress Δ {round(abs(project.financial_progress - project.physical_progress), 1)}% from physical progress.",
                observed_data=f"Reported Physical Progress: {project.physical_progress}%, Financial Disbursal: {project.financial_progress}%",
                expected_data=f"Target Milestone Progress: {min(100.0, project.physical_progress + 22.0)}%",
                difference=f"Milestone variance of {project.delay_days} days; progress delta {round(abs(project.financial_progress - project.physical_progress), 1)}%",
                confidence_score=0.91,
                recommended_action="Conduct mandatory on-ground inspection and verify measurement book with site geo-coordinates.",
                escalation_level="Level 3 - District Authority" if sev in ["CRITICAL", "HIGH"] else "Level 2 - Implementing Authority",
                assigned_authority="District Planning Officer / Collectorate",
                due_days=7 if sev == "CRITICAL" else 14,
                status="OPEN",
                created_at="2026-02-18",
                audit_history=[
                    {"time": "2026-02-18 09:30", "action": "Anomaly Flagged by MPLAD-TRACE Surveillance Engine", "actor": "AI Engine"},
                    {"time": "2026-02-18 10:15", "action": "Escalated to Level 3 District Authority", "actor": "System Routing"}
                ]
            )
            db.add(al)

    # 3. Seed Audit Logs
    initial_logs = [
        ("08:15", "District Authority", "District Collector Visakhapatnam", "PROJECT_VIEWED", "MPLAD-AP-2026-00125", "Opened 360 trace dossier for review"),
        ("08:30", "System AI", "Surveillance Engine", "AI_ANOMALY_GENERATED", "MPLAD-UP-2026-00084", "Flagged 110-day delay and 36.5% physical vs financial disparity"),
        ("08:45", "Field Officer", "Shri R. K. Verma, AEE", "INSPECTION_SUBMITTED", "MPLAD-AP-2026-00125", "Submitted milestone #2 physical verification report with geotagged images"),
        ("09:12", "District Authority", "Chief Planning Officer", "ALERT_ESCALATED", "ALT-2026-00084", "Escalated to Superintending Engineer Jal Nigam with 7-day compliance SLA"),
        ("09:40", "Higher Authority / Admin", "State Nodal Officer MoSPI", "DATA_IMPORTED", "BATCH-2026-02", "Refreshed e-SAKSHI master sanctions dataset")
    ]
    for tm, role, name, act, ent, det in initial_logs:
        log = AuditLog(
            id=f"LOG-{tm.replace(':', '')}-{ent[-5:]}",
            timestamp=f"2026-02-28 {tm}:00",
            actor_role=role,
            actor_name=name,
            action=act,
            entity_id=ent,
            details=det,
            ip_address="10.42.18.5"
        )
        db.add(log)

    db.commit()
    db.close()
