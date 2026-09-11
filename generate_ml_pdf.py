import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)
from reportlab.pdfgen import canvas

# A4: 595.27 x 841.89 points
# Left/Right margin: 36 pt -> Usable width = 523 pt

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        # Header
        self.drawString(36, 810, "MPLAD-TRACE 360 | COMPLETE ML & AI ARCHITECTURE COMPENDIUM")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(36, 802, 559, 802)
        
        # Footer
        self.line(36, 40, 559, 40)
        self.drawString(36, 28, "Confidential - National Technical Briefing | MoSPI & SIH Evaluation Committee")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(559, 28, page_text)
        self.restoreState()

def build_pdf(filename="MPLAD_ML_Models_and_System_Compendium.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=46,
        bottomMargin=48
    )

    styles = getSampleStyleSheet()
    
    primary = colors.HexColor("#1e3a8a")     # Deep Navy
    secondary = colors.HexColor("#b45309")   # Amber / Saffron
    body_col = colors.HexColor("#334155")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=primary,
        spaceAfter=3
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=secondary,
        spaceAfter=4
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13.5,
        textColor=primary,
        spaceBefore=7,
        spaceAfter=3
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#1e293b"),
        spaceBefore=5,
        spaceAfter=2
    )

    p_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=body_col,
        spaceAfter=3
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=p_style,
        leftIndent=10,
        bulletIndent=3,
        spaceAfter=2
    )

    cell_style = ParagraphStyle(
        'CellText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=body_col
    )

    cell_bold = ParagraphStyle(
        'CellBold',
        parent=cell_style,
        fontName='Helvetica-Bold',
        textColor=colors.HexColor("#0f172a")
    )

    cell_header = ParagraphStyle(
        'CellHeader',
        parent=cell_style,
        fontName='Helvetica-Bold',
        textColor=colors.white
    )

    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor("#065f46")
    )

    story = []

    # Title Banner
    story.append(Paragraph("MPLAD-TRACE 360™ | COMPLETE ARTIFICIAL INTELLIGENCE & MACHINE LEARNING SPECIFICATION", subtitle_style))
    story.append(Paragraph("Every ML Model, Mathematical Algorithm, Dataset & Fiscal Control Mechanism", title_style))
    story.append(Paragraph("Comprehensive Technical Reference: Computer Vision, Bayesian Delay Forecasting, Geospatial Clustered Anti-Duplication & Zero Ghost Billing", ParagraphStyle('Meta', parent=p_style, fontSize=7.5, textColor=colors.HexColor("#64748b"))))
    story.append(HRFlowable(width="100%", thickness=1.5, color=primary, spaceBefore=3, spaceAfter=6))

    # SECTION 1: Master Inventory of ML Models
    story.append(Paragraph("1. Master Inventory of Machine Learning Models & Algorithms", h1_style))
    story.append(Paragraph(
        "MPLAD-TRACE 360 integrates an ensemble of 6 specialized machine learning engines and mathematical models running across FastAPI microservices and client-side Edge PWA routines:",
        p_style
    ))

    ml_table = [
        [
            Paragraph("Model / Engine Name", cell_header),
            Paragraph("Underlying Algorithm & Framework", cell_header),
            Paragraph("Primary Role & Statutory Function in Platform", cell_header)
        ],
        [
            Paragraph("<b>1. Structural CV Verifier</b><br/>(Image & Video Analysis)", cell_style),
            Paragraph("OpenCV Laplacian Gradient Filtering, Canny Edge Detection, Structural Similarity (SSIM)", cell_style),
            Paragraph("Evaluates concrete honeycombing/segregation, rebar oxidation, and compares sequential milestone baseline photos to catch fake/recycled site images.", cell_style)
        ],
        [
            Paragraph("<b>2. Bayesian Delay Predictor</b><br/>(Schedule Forecasting)", cell_style),
            Paragraph("Bayesian Milestone Velocity Regression + Historical Contractor Slippage Heuristics", cell_style),
            Paragraph("Forecasts actual completion dates and slippage probability (%) by combining daily physical pacing, historical contractor delays, and billing disputes.", cell_style)
        ],
        [
            Paragraph("<b>3. Geospatial Duplicate Engine</b><br/>(Anti-Scheme Collusion)", cell_style),
            Paragraph("Spherical Haversine Distance Model + Jaccard Tokenized N-Gram Similarity", cell_style),
            Paragraph("Scans cross-departmental databases within a 150m–300m spatial buffer to detect duplicate community halls, roads, or borewells billed across multiple schemes.", cell_style)
        ],
        [
            Paragraph("<b>4. 7-Factor Risk Matrix</b><br/>(Composite Risk Scoring)", cell_style),
            Paragraph("Weighted Multi-Criteria Decision Analysis (MCDA) normalized to 0–100 scale", cell_style),
            Paragraph("Continuously audits 7 parameters (Cost, Schedule, Progress Gap, Evidence, Contractor, Document, Grievance) to categorize works: NORMAL, WATCH, HIGH RISK, CRITICAL.", cell_style)
        ],
        [
            Paragraph("<b>5. Zero Ghost Billing Engine</b><br/>(Automated Circuit-Breaker)", cell_style),
            Paragraph("Fiscal Discrepancy Gate (Delta = Financial Burn - Physical Execution)", cell_style),
            Paragraph("Instantly freezes PFMS escrow payments if financial claims exceed verified physical execution by >15% or if work is stalled. Requires DC clearance to unlock.", cell_style)
        ],
        [
            Paragraph("<b>6. NLP Grievance Classifier</b><br/>(Citizen Intelligence)", cell_style),
            Paragraph("TF-IDF Vectorization + Multinomial Naive Bayes / Transformer Routing", cell_style),
            Paragraph("Automatically classifies citizen complaints (e.g. Substandard Quality, Abandonment, Bribery) and dispatches alerts directly to the designated Assistant Engineer.", cell_style)
        ],
        [
            Paragraph("<b>7. GPS Reverse-Lookup & Defect Liability Invoker</b><br/>(Contractor Guarantee Hold)", cell_style),
            Paragraph("Spherical Geodesy (Haversine) + Multi-Attribute Disambiguation + PBG Escrow Hold", cell_style),
            Paragraph("Takes single camera click with live GPS, isolates nearest asset/contractor via spatial geofencing, verifies 36-month DLP warranty, freezes 5% Performance Bank Guarantee, and alerts District Collector.", cell_style)
        ]
    ]
    t_ml = Table(ml_table, colWidths=[110, 160, 253])
    t_ml.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#f8fafc"), colors.white]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_ml)
    story.append(Spacer(1, 5))

    # SECTION 2: Technical Breakdown of Each ML Engine
    story.append(Paragraph("2. Deep Technical Breakdown: How Each Engine Operates", h1_style))

    story.append(Paragraph("A. Computer Vision & Structural Milestone Verification", h2_style))
    story.append(Paragraph(
        "• <b>Edge Density & Concrete Void Analysis:</b> Uses Laplacian convolution to calculate pixel intensity variations. Concrete with poor compaction exhibits high variance and void clustering (>5mm), automatically triggering a <i>'Substandard Vibration / Honeycombing Alert'</i>.<br/>"
        "• <b>Structural Similarity (SSIM):</b> Compares baseline inspection photos against current progress. If SSIM score falls below 0.50 while the claimed stage is identical, it detects that the photo was taken at an unrelated location.<br/>"
        "• <b>Cryptographic EXIF Geofencing:</b> Enforces that hardware device GPS coordinates match sanctioned centroid coordinates within a strict 150m boundary.",
        p_style
    ))

    story.append(Paragraph("B. Bayesian Delay & Completion Velocity Predictor", h2_style))
    story.append(Paragraph(
        "• <b>Formula:</b> The daily progress rate <i>V_daily = Physical Progress / Elapsed Days</i> is modulated by <i>Contractor Historical Delay Index (K_c)</i> and <i>Dispute Penalty Factor (D_p)</i>.<br/>"
        "• <b>Slippage Calculation:</b> <i>Projected Days Needed = (100 - Current Progress) / Adjusted V_daily</i>. If projected finish extends beyond contractual completion date by >60 days, it automatically outputs a <b>HIGH RISK</b> delay probability (>85%) and recommends PERT/CPM chart re-submission.",
        p_style
    ))

    story.append(Paragraph("D. 1-Click GPS Defect Liability & Contractor Guarantee Hold Engine", h2_style))
    story.append(Paragraph(
        "• <b>Real-Time Spherical Inversion:</b> When a citizen snaps a site defect photo, the system extracts the device hardware GPS coordinate <i>(Lat_c, Lon_c)</i> and queries all public works within radius <i>R</i> using the Haversine equation: <i>d = 2R &middot; arcsin(&radic;(sin&sup2;(&Delta;lat/2) + cos(lat1)cos(lat2)sin&sup2;(&Delta;lon/2)))</i>.<br/>"
        "• <b>Multi-Project Disambiguation Score (S):</b> If multiple contractors worked at the same junction (e.g. road contractor + drain contractor), candidates are scored via: <i>S = 0.50 &middot; (1 - d/d_max) + 0.35 &middot; Active_DLP_Flag + 0.15 &middot; Cosine_Sim(Category, Claimed_Issue)</i>.<br/>"
        "• <b>Statutory Defect Liability & Bank Guarantee Freeze:</b> Under CPWD Works Manual 2024 & MoSPI Clause 4.2 (36-month Defect Liability Period), the system automatically locks the contractor's 5% Performance Bank Guarantee (PBG) in escrow and escalates a Level-4 CRITICAL Alert directly to the District Collector and Chief Vigilance Officer.",
        p_style
    ))

    # SECTION 3: Risk Thresholds & Circuit-Breaker Data
    story.append(PageBreak())
    story.append(Paragraph("3. Everything You Must Know About Fund Freezing & Unfreezing", h1_style))
    story.append(Paragraph(
        "To present confidently to judges, evaluators, and officials, here are the exact mathematical thresholds governing fund releases:",
        p_style
    ))

    freeze_data = [
        [
            Paragraph("Parameter / Trigger", cell_header),
            Paragraph("Mathematical Threshold", cell_header),
            Paragraph("System Action on PFMS Escrow", cell_header)
        ],
        [
            Paragraph("<b>Ghost Billing Discrepancy</b>", cell_style),
            Paragraph("Financial Burn - Physical Execution > 15%", cell_style),
            Paragraph("<b>IMMEDIATE PAYMENT FREEZE:</b> Circuit-breaker locks Step 5 (Paid) to '🔒 Halted'. Payment button disabled.", cell_style)
        ],
        [
            Paragraph("<b>Overall AI Risk Score</b>", cell_style),
            Paragraph("Composite Risk Score &ge; 75 / 100 (CRITICAL)", cell_style),
            Paragraph("<b>AUTOMATIC AUDIT HOLD:</b> Tranche release blocked pending District Planning Officer re-verification.", cell_style)
        ],
        [
            Paragraph("<b>Field Inspection Stalled</b>", cell_style),
            Paragraph("Status marked as 'STALLED' during inspection", cell_style),
            Paragraph("<b>COMPLETE DISBURSAL FREEZE:</b> Escrows locked. Contractor performance guarantee (PBG) placed on notice.", cell_style)
        ],
        [
            Paragraph("<b>Material Lab Failure</b>", cell_style),
            Paragraph("28-Day Concrete Cube Strength < 85% of design", cell_style),
            Paragraph("<b>DEFECT LIABILITY HOLD:</b> Payment held until defective structural member is dismantled and re-cast.", cell_style)
        ]
    ]
    t_frz = Table(freeze_data, colWidths=[120, 150, 253])
    t_frz.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#b91c1c")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#fef2f2"), colors.white]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_frz)
    story.append(Spacer(1, 6))

    story.append(Paragraph("Step-by-Step Unfreezing Protocol (How Funds Resume):", h2_style))
    story.append(Paragraph("<b>Step 1 (Civil Rectification):</b> Contractor executes physical civil works on site to bring physical progress up to the claimed financial level (e.g. from 30% to 75%).", bullet_style))
    story.append(Paragraph("<b>Step 2 (Fresh Geotagged Inspection):</b> Field Officer re-visits site, captures satellite GPS lock and records mandatory 360° video walkthrough, logging status as 'Satisfactory'.", bullet_style))
    story.append(Paragraph("<b>Step 3 (DPO Administrative Action):</b> District Planning Officer reviews audit evidence in the 'AI Risk & Anomaly Center' and clicks 'Resolve Alert'.", bullet_style))
    story.append(Paragraph("<b>Step 4 (Automated AI Clearance):</b> Risk score drops below 30 (NORMAL). Red circuit-breaker banner clears and switches to <i>'✓ PFMS Disbursal Pathway: Active & Fully Synchronized'</i>.", bullet_style))
    story.append(Spacer(1, 6))

    # SECTION 4: Database & Infrastructure Metrics
    story.append(Paragraph("4. Complete Database & Operational Metrics in the Project", h1_style))
    
    db_metrics = [
        [
            Paragraph("System Entity", cell_header),
            Paragraph("Audited Count in Database", cell_header),
            Paragraph("Operational Status & Real-World Compliance", cell_header)
        ],
        [
            Paragraph("<b>Sanctioned Works</b>", cell_style),
            Paragraph("52 Projects across 10 States/UTs", cell_style),
            Paragraph("All 52 audited: 24 frozen (Critical/Stalled), 15 completed, 13 active standby.", cell_style)
        ],
        [
            Paragraph("<b>Registered Contractors</b>", cell_style),
            Paragraph("8 Major Contracting Entities", cell_style),
            Paragraph("Categorized by Class 1/2, past delay averages, defect reports, and PBG expiries.", cell_style)
        ],
        [
            Paragraph("<b>Active Surveillance Alerts</b>", cell_style),
            Paragraph("24 AI Early-Warning Alerts", cell_style),
            Paragraph("Spanning Ghost Billing, Schedule Slippages, PBG Expiries, and Duplicate Checks.", cell_style)
        ],
        [
            Paragraph("<b>Statutory Inspection Form</b>", cell_style),
            Paragraph("Form 3.16-A (MoSPI Norms)", cell_style),
            Paragraph("Print-ready official PDF dossiers with SHA-256 digital seals and QR verification.", cell_style)
        ]
    ]
    t_db = Table(db_metrics, colWidths=[120, 130, 273])
    t_db.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#f8fafc"), colors.white]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_db)
    story.append(Spacer(1, 6))

    # Summary Callout Box
    summary_box = [
        [Paragraph("<b>Key Presentation Takeaway:</b> Our solution is not a theoretical prototype. It implements concrete mathematical algorithms (Haversine, Jaccard, Laplacian Edge Detection, Bayesian Pacing, and MCDA Risk Weighting) directly linked to treasury escrow gates. By automatically halting funds when discrepancies exceed 15%, the system enforces zero ghost billing in real time.", callout_style)]
    ]
    t_sum = Table(summary_box, colWidths=[523])
    t_sum.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#ecfdf5")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#10b981")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_sum)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"ML Compendium PDF compiled successfully at: {filename}")

if __name__ == "__main__":
    out_file = sys.argv[1] if len(sys.argv) > 1 else "MPLAD_ML_Models_and_System_Compendium.pdf"
    build_pdf(out_file)
