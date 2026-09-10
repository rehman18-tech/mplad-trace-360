import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)
from reportlab.pdfgen import canvas

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
        self.drawString(40, 804, "MPLAD-TRACE 360 | INNOVATION, HISTORICAL CONTEXT & ASSET BENCHMARKING")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(40, 796, 555, 796)
        
        # Footer
        self.line(40, 42, 555, 42)
        self.drawString(40, 30, "Confidential - Recorded at 11:12 PM | SIH & MoSPI Innovation Assessment Dossier")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(555, 30, page_text)
        self.restoreState()

def build_pdf(filename="MPLAD_Innovation_and_Historical_Benchmark.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=50,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()
    
    primary = colors.HexColor("#1e3a8a")     # Deep Navy
    secondary = colors.HexColor("#b45309")   # Saffron / Amber
    body_col = colors.HexColor("#334155")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=primary,
        spaceAfter=3
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=secondary,
        spaceAfter=6
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=primary,
        spaceBefore=8,
        spaceAfter=4
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
        leading=11.5,
        textColor=body_col,
        spaceAfter=4
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=p_style,
        leftIndent=10,
        bulletIndent=3,
        spaceAfter=2.5
    )

    cell_style = ParagraphStyle(
        'CellText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
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
    story.append(Paragraph("MPLAD-TRACE 360™ | EXECUTIVE STRATEGIC DOSSIER (11:12 PM RECORD)", subtitle_style))
    story.append(Paragraph("What Makes Our Project Unique, Historical Precedents & Comparison With Today's Real Asset Portals", title_style))
    story.append(Paragraph("Comprehensive Analysis: Evolutionary Timeline, Real-World Shortcomings of e-SAKSHI, and Breakthrough Innovations", ParagraphStyle('Meta', parent=p_style, fontSize=7.5, textColor=colors.HexColor("#64748b"))))
    story.append(HRFlowable(width="100%", thickness=1.5, color=primary, spaceBefore=3, spaceAfter=6))

    # SECTION 1: Historical Context
    story.append(Paragraph("1. Historical Context: Has Anything Like This Been Made in History?", h1_style))
    story.append(Paragraph(
        "To understand the novelty of MPLAD-TRACE 360, we must trace how India has monitored physical assets and local development schemes over the last 30 years:",
        p_style
    ))

    history_table = [
        [
            Paragraph("Era & Platform", cell_header),
            Paragraph("Technological Mechanism", cell_header),
            Paragraph("Critical Structural Vulnerabilities / Shortcomings", cell_header)
        ],
        [
            Paragraph("<b>1. Paper Era (1993–2010)</b><br/>Physical MB Records", cell_style),
            Paragraph("Handwritten Measurement Books (MB) recorded by junior engineers. Physical sanction letters signed via post.", cell_style),
            Paragraph("Complete opacity. High prevalence of ghost billing, duplicate works billed across multiple schemes, and zero public traceability.", cell_style)
        ],
        [
            Paragraph("<b>2. Early Digital (2011–2020)</b><br/>MPLADS Portal v1.0", cell_style),
            Paragraph("Basic tabular MIS portal (PHP/MySQL). Officers uploaded scanned PDFs and manual progress numbers.", cell_style),
            Paragraph("Zero geotagging or visual evidence. Funds were released based solely on self-certified clerical entries without physical verification.", cell_style)
        ],
        [
            Paragraph("<b>3. Modern Era (2023–Present)</b><br/>e-SAKSHI Portal (MoSPI)", cell_style),
            Paragraph("Central web portal introduced by MoSPI for paperless MP recommendations, fund releases, and web forms.", cell_style),
            Paragraph("Requires continuous 4G connection (crashes in deep rural areas). Static 2D photo upload only (no 360° video). No automated payment circuit-breaker; no supply-chain volumetric reconciliation.", cell_style)
        ]
    ]
    t_hist = Table(history_table, colWidths=[100, 150, 265])
    t_hist.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#f8fafc"), colors.white]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_hist)
    story.append(Spacer(1, 6))

    # SECTION 2: How It Differs From Real-World Portals Today
    story.append(Paragraph("2. How Our Platform Differs From Existing Real-World Asset Portals", h1_style))
    story.append(Paragraph(
        "Current portals like e-SAKSHI, PMGSY OMMAS, or state PWD portals are <b>passive data archives</b>—they record information after payments are already made. MPLAD-TRACE 360 is an <b>active enforcement engine</b> that protects treasury disbursements in real time:",
        p_style
    ))

    diff_table = [
        [
            Paragraph("Audit Dimension", cell_header),
            Paragraph("Existing Real-World Portals (e.g. e-SAKSHI)", cell_header),
            Paragraph("MPLAD-TRACE 360 (Our Platform)", cell_header)
        ],
        [
            Paragraph("<b>Connectivity & Rural Access</b>", cell_style),
            Paragraph("Fails in remote areas with zero network. Upload buttons freeze or error out.", cell_style),
            Paragraph("<b>True Offline PWA:</b> Works 100% in Airplane Mode. Cryptographically queues records in device storage; auto-flushes on sync.", cell_style)
        ],
        [
            Paragraph("<b>Field Evidence Protocol</b>", cell_style),
            Paragraph("Single, easily spoofed gallery photo upload without live camera or video requirements.", cell_style),
            Paragraph("<b>Mandatory Dual Capture:</b> Live hardware-locked camera + continuous 360° Video Walkthrough via MediaRecorder API.", cell_style)
        ],
        [
            Paragraph("<b>Payment Protection</b>", cell_style),
            Paragraph("Manual fund release. Discrepancies require months of post-facto CAG/PAC audit.", cell_style),
            Paragraph("<b>Zero Ghost Billing Circuit-Breaker:</b> Automatically halts PFMS tranche disbursals if physical execution lags financial burn by >15%.", cell_style)
        ],
        [
            Paragraph("<b>Material Verification</b>", cell_style),
            Paragraph("Clerical self-certification. No check on cement, steel, or aggregate quality.", cell_style),
            Paragraph("<b>3-Way Triangulation:</b> CV surface defect analysis + Digital 28-day concrete cube test curves (IS 516) + GeM e-Way bill bag deficit check.", cell_style)
        ],
        [
            Paragraph("<b>Citizen Engagement</b>", cell_style),
            Paragraph("Cumbersome grievance web forms with zero AI routing or feedback visibility.", cell_style),
            Paragraph("<b>Geotagged Citizen Voice:</b> Camera evidence upload, multi-lingual audio intake, and automated AI grievance classification.", cell_style)
        ]
    ]
    t_diff = Table(diff_table, colWidths=[95, 205, 215])
    t_diff.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#f8fafc"), colors.white]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_diff)
    story.append(Spacer(1, 6))

    # SECTION 3: Deep Dive Into Our Key Innovations
    story.append(PageBreak())
    story.append(Paragraph("3. Deep Dive: The 5 Core Innovations in Our Project", h1_style))

    story.append(Paragraph("Innovation 1: Zero Ghost Billing Circuit-Breaker (Automated Fiscal Guard)", h2_style))
    story.append(Paragraph(
        "Historically, the largest leak in MPLADS has been contractors claiming 75% payment on paper while actual physical execution is stalled at the 30% foundation stage. In our platform, the moment an inspection records a progress gap exceeding 15% (or a Risk Score &ge; 75), the PFMS escrow disbursal is <b>instantaneously halted with a hardware lock [HALTED]</b>. Treasury funds cannot be released until physical rectification is certified.",
        p_style
    ))

    story.append(Paragraph("Innovation 2: Mandatory 360° Site Video Walkthrough & Adaptive Viewport", h2_style))
    story.append(Paragraph(
        "Static photos can be taken from deceptive angles or recycled from adjacent village works. Our platform introduces mandatory continuous panoramic video capture directly in the browser viewfinder. The video container dynamically adapts to the recording's native aspect ratio, embedding hardware GPS and date watermarks directly into the video metadata stream.",
        p_style
    ))

    story.append(Paragraph("Innovation 3: Construction Material & Structural Defect Analysis (IS 456 / IS 516)", h2_style))
    story.append(Paragraph(
        "Rather than guessing material quality, the platform cross-triangulates: (1) Computer Vision Laplacian edge filtering to detect concrete segregation and honeycombing voids (>5mm), (2) Digital 28-day Concrete Cube Test compressive curves (CTM records against IS 516 standards), and (3) GeM e-Way bill volumetric analysis (reconciling bags of cement billed vs BoQ theoretical volume).",
        p_style
    ))

    story.append(Paragraph("Innovation 4: True Offline-First PWA (Zero-Network Rural Architecture)", h2_style))
    story.append(Paragraph(
        "Inspectors in tribal, forest, or Himalayan belts frequently lack 4G connectivity. Our Progressive Web App (PWA) operates seamlessly in 100% Airplane Mode. Inspections are cryptographically signed and stored in encrypted local device storage (IndexedDB/localStorage). As soon as the device reconnects to a tower, the background sync queue automatically flushes to the central FastAPI cloud.",
        p_style
    ))

    story.append(Paragraph("Innovation 5: Explainable 7-Factor MoSPI Risk Assessment Matrix", h2_style))
    story.append(Paragraph(
        "Unlike opaque 'black-box' algorithms, our AI Risk Engine calculates an objective composite score (0–100) across 7 transparent parameters: Schedule Delay, Cost Variation, Physical-Financial Discrepancy, Evidence Integrity, Contractor Track Record, Document Verifications, and Citizen Grievance Signals. Every risk factor displays a transparent 'Why Am I Seeing This?' audit breakdown.",
        p_style
    ))
    story.append(Spacer(1, 6))

    # SECTION 4: Strategic Impact & Feasibility Summary
    story.append(Paragraph("4. Strategic Value for Government & Public Works", h1_style))
    
    impact_table = [
        [
            Paragraph("Stakeholder", cell_header),
            Paragraph("The Old Way (Pre-2026)", cell_header),
            Paragraph("The MPLAD-TRACE 360 Way (Our Impact)", cell_header)
        ],
        [
            Paragraph("<b>Members of Parliament (MPs)</b>", cell_style),
            Paragraph("Blamed for stalled works; no real-time visibility into constituency fund utilization.", cell_style),
            Paragraph("Live mobile dashboard of every sanctioned asset with drone/walkthrough proof.", cell_style)
        ],
        [
            Paragraph("<b>District Authorities (DCs / DPOs)</b>", cell_style),
            Paragraph("Overwhelmed with manual paperwork and post-facto audit objections.", cell_style),
            Paragraph("Automated early-warning alerts, pre-filled Form 3.16-A dossiers, and instant circuit-breaker controls.", cell_style)
        ],
        [
            Paragraph("<b>Citizens & Local Voters</b>", cell_style),
            Paragraph("Complete lack of information regarding local public works.", cell_style),
            Paragraph("Transparent public explorer, GPS photo verification, and direct digital grievance tracking.", cell_style)
        ],
        [
            Paragraph("<b>MoSPI & Central Treasury</b>", cell_style),
            Paragraph("Delayed unspent balance reconciliation across thousands of escrow accounts.", cell_style),
            Paragraph("Unified real-time national ledger preventing fund idling and ghost billing.", cell_style)
        ]
    ]
    t_imp = Table(impact_table, colWidths=[110, 195, 210])
    t_imp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#f8fafc"), colors.white]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_imp)
    story.append(Spacer(1, 6))

    # Summary Box
    summary_box = [
        [Paragraph("<b>Concluding Summary:</b> What makes our project genuinely novel is the shift from <i>passive bureaucratic record-keeping</i> to <i>active real-time fiscal enforcement</i>. In the past, government systems only documented corruption months after the funds were lost. MPLAD-TRACE 360 uses hardware GPS enforcement, 360° video walkthroughs, and automated escrow circuit-breakers to halt unauthorized payments before a single rupee leaves the treasury.", callout_style)]
    ]
    t_sum = Table(summary_box, colWidths=[515])
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
    print(f"Perfect PDF generated at: {filename}")

if __name__ == "__main__":
    out_name = sys.argv[1] if len(sys.argv) > 1 else "MPLAD_Innovation_and_Historical_Benchmark.pdf"
    build_pdf(out_name)
