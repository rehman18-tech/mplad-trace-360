import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)
from reportlab.pdfgen import canvas

# A4 dimensions: 595.27 x 841.89 points
# Left/Right margin: 36 pt each -> Usable width = 595.27 - 72 = 523 pt

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
        self.drawString(36, 810, "MPLAD-TRACE 360 | TECHNICAL ARCHITECTURE & OPERATIONAL AUDIT DOSSIER")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(36, 802, 559, 802)
        
        # Footer
        self.line(36, 40, 559, 40)
        self.drawString(36, 28, "Confidential - Ministry of Statistics & Programme Implementation (MoSPI) / District Authority Review")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(559, 28, page_text)
        self.restoreState()

def build_pdf(filename="MPLAD_Audit_and_AI_Quality_Guide.pdf"):
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
        fontSize=11,
        leading=14,
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
    story.append(Paragraph("MPLAD-TRACE 360™ TECHNICAL ARCHITECTURE & EXECUTIVE DOSSIER", subtitle_style))
    story.append(Paragraph("Field Inspections, AI Verification, Material Quality Standards & Fiscal Circuit-Breaker Guide", title_style))
    story.append(Paragraph("Operational Reference for Evaluating Public Works, Quality Standards & Fund Flow Controls", ParagraphStyle('Meta', parent=p_style, fontSize=7.5, textColor=colors.HexColor("#64748b"))))
    story.append(HRFlowable(width="100%", thickness=1.5, color=primary, spaceBefore=3, spaceAfter=6))

    # SECTION 1: Executive Overview
    story.append(Paragraph("1. System Architecture & Lifecycle of an Inspection", h1_style))
    story.append(Paragraph(
        "When an inspecting officer captures a field inspection via the Mobile PWA, a dual-layer statutory workflow executes automatically to eliminate ghost billing, unauthorized geographical uploads, and contractor collusion.",
        p_style
    ))
    
    flow_data = [
        [
            Paragraph("Phase", cell_header),
            Paragraph("Component", cell_header),
            Paragraph("Function & Technical Enforcement", cell_header)
        ],
        [
            Paragraph("<b>1. Capture</b>", cell_style),
            Paragraph("Hardware GPS & Camera", cell_style),
            Paragraph("Enforces active device location services before opening camera viewfinder. Cryptographically stamps coordinates directly into image canvas.", cell_style)
        ],
        [
            Paragraph("<b>2. Walkthrough</b>", cell_style),
            Paragraph("360° Video Recording", cell_style),
            Paragraph("Mandatory continuous panoramic video walkthrough using MediaRecorder API to prove active work perimeter and true site physical progress.", cell_style)
        ],
        [
            Paragraph("<b>3. Offline Cache</b>", cell_style),
            Paragraph("Encrypted Outbox", cell_style),
            Paragraph("Stored locally in browser IndexedDB/localStorage with offline cryptographic hash if deep rural 4G/Wi-Fi is disconnected.", cell_style)
        ],
        [
            Paragraph("<b>4. Cloud Sync</b>", cell_style),
            Paragraph("FastAPI Ingestion", cell_style),
            Paragraph("Transmits package via REST API to central backend once connectivity resumes; logs immutable SHA-256 Audit Trail.", cell_style)
        ],
        [
            Paragraph("<b>5. AI Verification</b>", cell_style),
            Paragraph("Multi-Stage Vision & Risk", cell_style),
            Paragraph("Haversine distance geofencing (<=150m tolerance), OpenCV structural feature matching, and BoQ supply reconciliation.", cell_style)
        ],
        [
            Paragraph("<b>6. Fiscal Lock</b>", cell_style),
            Paragraph("PFMS Circuit-Breaker", cell_style),
            Paragraph("Compares physical progress observed against financial burn. Triggers escrow freeze if discrepancy exceeds 15% or status is Stalled.", cell_style)
        ]
    ]
    t1 = Table(flow_data, colWidths=[65, 125, 333])
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#f8fafc"), colors.white]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t1)
    story.append(Spacer(1, 5))

    # SECTION 2: How AI Evaluates Material Quality
    story.append(Paragraph("2. How Does AI Evaluate Construction Material Quality?", h1_style))
    story.append(Paragraph(
        "A common technical inquiry is: <i>'Since AI software cannot physically touch or squeeze concrete, steel, or sand, how can it reliably verify material quality?'</i>",
        p_style
    ))
    story.append(Paragraph(
        "In MPLAD-TRACE 360, material verification is executed through <b>Three-Way AI Triangulation</b> rather than subjective visual guessing:",
        p_style
    ))

    story.append(Paragraph("A. Computer Vision Surface & Texture Analytics", h2_style))
    story.append(Paragraph("• <b>Concrete Segregation & Honeycombing:</b> Improper water-cement ratios or inadequate vibrator compacting leave hollow pockets and exposed stone voids. OpenCV Laplacian edge filters detect surface porosity; void depths exceeding 5mm are flagged as <i>Substandard Concrete Vibration</i>.", bullet_style))
    story.append(Paragraph("• <b>TMT Steel Rebar Oxidation:</b> Color histogram segmentation analyzes exposed rebar cages for rust scale. Oxidation exceeding 15% on tensile bars flags <i>Structural Corrosion Alert</i>.", bullet_style))
    story.append(Paragraph("• <b>Efflorescence & Salinity:</b> White salt blooming on new brickwork indicates high-saline mixing water or low-grade kiln bricks. Color-clustering filters flag masonry durability failure.", bullet_style))

    story.append(Paragraph("B. Digital Concrete Cube Test Verification (IS 516 / IS 456 Standards)", h2_style))
    story.append(Paragraph(
        "Indian Standards mandate casting 150mm x 150mm test cubes during casting. These are cured and crushed in a Compressive Testing Machine (CTM) at 7 and 28 days. The inspecting officer logs the verified compressive strength (e.g. 24.8 MPa for M20 concrete). The AI evaluates this against standard curing curves; if strength falls below 85% of specified design strength, the material is rejected and the stage payment is halted.",
        p_style
    ))

    story.append(Paragraph("C. GeM & GST e-Way Bill Volumetric Cross-Reconciliation", h2_style))
    story.append(Paragraph(
        "Contractors may claim Grade 53 OPC cement on paper but use adulterated fly-ash on-site. The AI cross-checks the Bill of Quantities (BoQ) volume against verified delivery records on Government e-Marketplace (GeM) and GST e-Way bills. If casting a 3,000 sq.ft hall requires 450 cement bags but supplier records only reflect 180 bags delivered to that coordinate, the system detects a <b>60% Material Volumetric Deficit</b>, exposing material dilution without laboratory delay.",
        p_style
    ))

    # SECTION 3: Risk Thresholds & Fund Freezing
    story.append(PageBreak())
    story.append(Paragraph("3. When Does the AI Freeze Funds? (Risk Thresholds)", h1_style))
    story.append(Paragraph(
        "The automated circuit-breaker monitors the 7-factor MoSPI Risk Matrix (0-100 score). Depending on composite risk and specific red-line anomalies, fund flows are regulated as follows:",
        p_style
    ))

    risk_data = [
        [
            Paragraph("Score Range", cell_header),
            Paragraph("Risk Level", cell_header),
            Paragraph("Disbursal Status", cell_header),
            Paragraph("System Action & Fiscal Mechanism", cell_header)
        ],
        [
            Paragraph("0 – 29", cell_style),
            Paragraph("NORMAL", cell_style),
            Paragraph("Active (100%)", cell_style),
            Paragraph("Tranche releases pass smoothly via PFMS escrow upon milestone sign-off.", cell_style)
        ],
        [
            Paragraph("30 – 49", cell_style),
            Paragraph("WATCH", cell_style),
            Paragraph("Permitted", cell_style),
            Paragraph("Payments released; 14-day expedited field verification scheduled.", cell_style)
        ],
        [
            Paragraph("50 – 74", cell_style),
            Paragraph("HIGH RISK", cell_style),
            Paragraph("Conditional Hold", cell_style),
            Paragraph("Escrow disbursal queued; requires District Planning Officer (DPO) re-audit.", cell_style)
        ],
        [
            Paragraph("75 – 100", cell_style),
            Paragraph("CRITICAL", cell_bold),
            Paragraph("<b>FROZEN (HALTED)</b>", cell_style),
            Paragraph("Zero Ghost Billing Circuit-Breaker triggers lock. Payment button disabled. Tranche release withheld.", cell_style)
        ]
    ]
    t2 = Table(risk_data, colWidths=[65, 70, 85, 303])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#f8fafc"), colors.white]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t2)
    story.append(Spacer(1, 6))

    story.append(Paragraph("Immediate Automatic Freezing Triggers (Independent of Score):", h2_style))
    story.append(Paragraph("1. <b>Progress Discrepancy > 15%:</b> When claimed financial burn outpaces verified physical execution (e.g. 75% payment claimed vs 30% substructure built).", bullet_style))
    story.append(Paragraph("2. <b>Stalled Work Status:</b> Any inspection logging prolonged abandonment or contractor demobilization.", bullet_style))
    story.append(Paragraph("3. <b>Substandard Material Failure:</b> Failed 28-day concrete cube test or counterfeit reinforcement.", bullet_style))
    story.append(Paragraph("4. <b>Active Contract Dispute:</b> Unresolved contractor claim or arbitration flagged in ledger.", bullet_style))
    story.append(Spacer(1, 6))

    # SECTION 4: Where to Check & How to Unfreeze
    story.append(Paragraph("4. Where to Check & How to Unfreeze Halted Funds", h1_style))
    
    story.append(Paragraph("Where to Verify in the Web Application:", h2_style))
    story.append(Paragraph("• <b>Tab 3: PFMS Fund Flow & Ledgers (Project Detail Page):</b> Displays the interactive 6-stage pipeline. If frozen, a prominent red alert appears: <i>'PFMS ESCROW DISBURSAL HALTED: DISCREPANCY FLAGGED'</i> and Step 5 (Paid) switches to <i>'🔒 Halted'</i>. The payment release button is locked with <i>'🔒 Tranche Payment Locked (Awaiting DC Clearance)'</i>.", bullet_style))
    story.append(Paragraph("• <b>AI Risk & Anomaly Center:</b> Lists all GHOST_BILLING_SURVEILLANCE alerts with exact variance (e.g. Δ 42% discrepancy) and contractor risk profile.", bullet_style))
    story.append(Paragraph("• <b>Tab 4: Field Evidence & Photos:</b> Shows geotagged before/after photos, AI CV consistency %, and the 360° Site Video Walkthrough player.", bullet_style))

    story.append(Paragraph("Step-by-Step Protocol to Unfreeze Funds:", h2_style))
    
    steps_data = [
        [
            Paragraph("Step", cell_header),
            Paragraph("Responsible Party", cell_header),
            Paragraph("Action Required", cell_header)
        ],
        [
            Paragraph("<b>Step 1: Rectification</b>", cell_style),
            Paragraph("Executing Contractor", cell_style),
            Paragraph("Execute physical work to catch up with financial milestone (e.g. cast columns/lintels) or recast defective concrete.", cell_style)
        ],
        [
            Paragraph("<b>Step 2: Re-Inspection</b>", cell_style),
            Paragraph("Field Inspecting Officer", cell_style),
            Paragraph("Conduct fresh site inspection with hardware GPS and record mandatory 360° video. Log progress = 75% (Satisfactory).", cell_style)
        ],
        [
            Paragraph("<b>Step 3: Alert Resolution</b>", cell_style),
            Paragraph("District Planning Officer (DPO)", cell_style),
            Paragraph("Access 'AI Risk & Anomaly Center', click 'Take Action' -> 'Resolve Alert', and enter official re-verification notes.", cell_style)
        ],
        [
            Paragraph("<b>Step 4: AI Re-Assessment</b>", cell_style),
            Paragraph("Risk Engine (Automated)", cell_style),
            Paragraph("System re-evaluates risk: Discrepancy drops to 0%, composite score drops below 30 (NORMAL). Red lock clears automatically.", cell_style)
        ],
        [
            Paragraph("<b>Step 5: Release Resumed</b>", cell_style),
            Paragraph("PFMS Gateway (Automated)", cell_style),
            Paragraph("Escrow disbursal unlocked. Tranche release button becomes active for authorized finance officers.", cell_style)
        ]
    ]
    t3 = Table(steps_data, colWidths=[95, 125, 303])
    t3.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#047857")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#f0fdf4"), colors.white]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t3)
    story.append(Spacer(1, 6))

    # Summary Callout Box
    summary_box = [
        [Paragraph("<b>Key Takeaway for Project Teams:</b> The MPLAD-TRACE 360 platform eliminates ghost billing and substandard construction by replacing unverified self-certification with objective 3-way data triangulation (Geotagged 360° Video + Lab Cube Tests + GST/GeM supply records). Funds are never locked arbitrarily—they freeze automatically at Risk Score &ge; 75 or Milestone Delta &gt; 15%, and unfreeze systematically upon verified physical re-inspection.", callout_style)]
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

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Clean Audit Guide PDF recompiled successfully at: {filename}")

if __name__ == "__main__":
    out_path = sys.argv[1] if len(sys.argv) > 1 else "MPLAD_Audit_and_AI_Quality_Guide.pdf"
    build_pdf(out_path)
