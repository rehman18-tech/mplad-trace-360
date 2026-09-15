import os
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
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, page_count):
        self.saveState()
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#0B2545"))
            self.drawString(36, 812, "MPLAD-TRACE 360™")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawString(130, 812, "|   PLAIN LANGUAGE & SIMPLIFIED WORDS GUIDE")
            self.drawRightString(559, 812, "EASY-TO-UNDERSTAND HUMAN REFERENCE")
            
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.6)
            self.line(36, 804, 559, 804)
            
            # Footer
            self.line(36, 42, 559, 42)
            self.setFont("Helvetica", 7.5)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawString(36, 30, "Government of India | Citizen-First Transparent Governance Compendium")
            page_text = f"Page {self._pageNumber} of {page_count}"
            self.drawRightString(559, 30, page_text)
        self.restoreState()

def generate_pdf(filename=None):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    if filename is None:
        filename = os.path.join(script_dir, "MPLAD_TRACE_360_SIMPLIFIED_LANGUAGE_GUIDE.pdf")

    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=46,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()

    c_navy = colors.HexColor("#0B2545")
    c_saffron = colors.HexColor("#EA580C")
    c_emerald = colors.HexColor("#047857")
    c_slate = colors.HexColor("#334155")
    c_red_text = colors.HexColor("#991B1B")
    c_green_text = colors.HexColor("#065F46")
    c_border = colors.HexColor("#CBD5E1")
    c_light_bg = colors.HexColor("#F8FAFC")

    title_style = ParagraphStyle(
        'Title',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=c_navy
    )
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=c_saffron
    )
    sec_title = ParagraphStyle(
        'SecTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15.5,
        textColor=c_navy,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )
    body = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=c_slate,
        spaceAfter=5
    )
    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=10.5,
        textColor=c_slate
    )
    table_cell_old = ParagraphStyle(
        'TableCellOld',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=10.5,
        textColor=c_red_text
    )
    table_cell_new = ParagraphStyle(
        'TableCellNew',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=10.5,
        textColor=c_green_text
    )
    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.white
    )

    story = []

    # =========================================================================
    # HEADER & INTRO
    # =========================================================================
    story.append(Spacer(1, 10))
    story.append(Paragraph("MPLAD-TRACE 360™ • CITIZEN & EVALUATOR COMPANION", ParagraphStyle('Tag', fontName='Helvetica-Bold', fontSize=8.5, textColor=c_saffron, spaceAfter=4)))
    story.append(Paragraph("Plain Language & Simplified Words Guide", title_style))
    story.append(Paragraph("A Clear Translation Guide: Difficult Technical/Legal Jargon ➔ Simple Human Words", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2.5, color=c_navy, spaceBefore=4, spaceAfter=8))

    intro_box = (
        "<b>PURPOSE OF THIS DOCUMENT:</b><br/>"
        "Government infrastructure, legal statutes (CVC Section 88, MoSPI, GFR 2017), and artificial intelligence systems often "
        "use complex, academic, and 'professor-level' words that are difficult for an everyday citizen or non-expert to understand. "
        "This guide translates all 24 technical, financial, and mathematical terms used throughout <b>MPLAD-TRACE 360</b> into "
        "crystal-clear, friendly, plain-English human language."
    )
    t_intro = Table([[Paragraph(intro_box, body)]], colWidths=[523])
    t_intro.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#FEF3C7")),
        ('BOX', (0, 0), (-1, -1), 0.8, c_saffron),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_intro)
    story.append(Spacer(1, 8))

    # =========================================================================
    # SECTION 1: FIELD INSPECTION & MOBILE OUTBOX
    # =========================================================================
    story.append(Paragraph("1.0 Field Inspection & Mobile Outbox (Ground Operations)", sec_title))
    
    t1_data = [
        [Paragraph("<b>#</b>", table_header), Paragraph("<b>Difficult Academic Word (Old / In System)</b>", table_header), Paragraph("<b>Simple Human Word (New / Plain English)</b>", table_header), Paragraph("<b>Where It Appears</b>", table_header), Paragraph("<b>Why It Was Confusing / Plain Meaning</b>", table_header)],
        [
            Paragraph("1", table_cell),
            Paragraph("Concordance Verified", table_cell_old),
            Paragraph("Match Confirmed (Both Agree)", table_cell_new),
            Paragraph("Inspection toast & badge", table_cell),
            Paragraph("'Concordance' is formal Latin legal jargon. Simple meaning: <i>Did both field officers agree on the progress?</i>", table_cell)
        ],
        [
            Paragraph("2", table_cell),
            Paragraph("Collusion Alert Triggered", table_cell_old),
            Paragraph("Cheating / Fraud Warning", table_cell_new),
            Paragraph("Alert popup & red banner", table_cell),
            Paragraph("'Collusion' is high-level legal speak. Plain meaning: <i>Someone is trying to fake or inflate work to steal money.</i>", table_cell)
        ],
        [
            Paragraph("3", table_cell),
            Paragraph("Double-Blind Dual-Inspection", table_cell_old),
            Paragraph("Two-Officer Independent Check", table_cell_new),
            Paragraph("Inspection header & audit tabs", table_cell),
            Paragraph("Sounds like a clinical medical drug trial. Plain meaning: <i>Two separate engineers inspect without seeing each other's score.</i>", table_cell)
        ],
        [
            Paragraph("4", table_cell),
            Paragraph("Ground-Zero Milestone 0 Baseline Lock", table_cell_old),
            Paragraph("First Site Photo (Locked)", table_cell_new),
            Paragraph("Inspection camera screen", table_cell),
            Paragraph("'Ground-Zero' sounds like military defense talk. Plain meaning: <i>The first photo of empty ground before digging begins.</i>", table_cell)
        ],
        [
            Paragraph("5", table_cell),
            Paragraph("Ground Outbox Queue", table_cell_old),
            Paragraph("Offline Saved Inspections", table_cell_new),
            Paragraph("Drawer title & sync badge", table_cell),
            Paragraph("'Outbox Queue' is technical email server terminology. Plain meaning: <i>Inspections saved on phone while waiting for network.</i>", table_cell)
        ],
        [
            Paragraph("6", table_cell),
            Paragraph("Zero Latency", table_cell_old),
            Paragraph("Instant (No Waiting Time)", table_cell_new),
            Paragraph("Button subtext", table_cell),
            Paragraph("'Latency' is computer networking language. Plain meaning: <i>Saves in 1 millisecond without lagging or freezing.</i>", table_cell)
        ],
        [
            Paragraph("7", table_cell),
            Paragraph("Geofence Drift Variance", table_cell_old),
            Paragraph("Distance From Site (Location Check)", table_cell_new),
            Paragraph("GPS location bar", table_cell),
            Paragraph("'Geofence drift variance' sounds like aerospace physics. Plain meaning: <i>Is the officer really standing at the project site?</i>", table_cell)
        ]
    ]
    t1 = Table(t1_data, colWidths=[18, 120, 130, 95, 160])
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_navy),
        ('GRID', (0, 0), (-1, -1), 0.4, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_light_bg]),
        ('PADDING', (0, 0), (-1, -1), 3.2),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(t1)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 2: AI & RISK SCORING
    # =========================================================================
    story.append(Paragraph("2.0 AI & Risk Scoring (The Brain & Formulas)", sec_title))
    
    t2_data = [
        [Paragraph("<b>#</b>", table_header), Paragraph("<b>Difficult Academic Word (Old / In System)</b>", table_header), Paragraph("<b>Simple Human Word (New / Plain English)</b>", table_header), Paragraph("<b>Where It Appears</b>", table_header), Paragraph("<b>Why It Was Confusing / Plain Meaning</b>", table_header)],
        [
            Paragraph("8", table_cell),
            Paragraph("Fiscal-Physical Disparity (&Delta;)", table_cell_old),
            Paragraph("Money Spent vs Work Done Gap", table_cell_new),
            Paragraph("7-Factor Risk Cards & Curves", table_cell),
            Paragraph("Ministry economics terminology. Plain meaning: <i>Did they take 80% of taxpayer money when only 30% of building is built?</i>", table_cell)
        ],
        [
            Paragraph("9", table_cell),
            Paragraph("Discrepancy Delta (&Delta;)", table_cell_old),
            Paragraph("Difference / Gap", table_cell_new),
            Paragraph("Risk breakdown & alert cards", table_cell),
            Paragraph("'Delta' is a Greek mathematical symbol. Plain English: <i>The difference or gap between two numbers.</i>", table_cell)
        ],
        [
            Paragraph("10", table_cell),
            Paragraph("Autonomous Surveillance Findings", table_cell_old),
            Paragraph("Automatic Check Results", table_cell_new),
            Paragraph("PDF dossiers & AI Risk page", table_cell),
            Paragraph("Sounds like CIA satellite spy monitoring. Plain meaning: <i>What the computer found after scanning the project.</i>", table_cell)
        ],
        [
            Paragraph("11", table_cell),
            Paragraph("State Schedule of Rates (SoR)", table_cell_old),
            Paragraph("Government Fixed Price List", table_cell_new),
            Paragraph("Tender Oracle & Contract cards", table_cell),
            Paragraph("Non-engineers do not know 'SoR'. Plain meaning: <i>The standard government rate card for cement, bricks, and labour.</i>", table_cell)
        ],
        [
            Paragraph("12", table_cell),
            Paragraph("Abnormally Low / Predatory Bidding", table_cell_old),
            Paragraph("Rejected: Price Too Low (Risky)", table_cell_new),
            Paragraph("Tender evaluation badge", table_cell),
            Paragraph("'Predatory bidding' is college antitrust language. Plain meaning: <i>Quoting dangerously cheap prices to win, then abandoning.</i>", table_cell)
        ]
    ]
    t2 = Table(t2_data, colWidths=[18, 120, 130, 95, 160])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_navy),
        ('GRID', (0, 0), (-1, -1), 0.4, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_light_bg]),
        ('PADDING', (0, 0), (-1, -1), 3.2),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(t2)
    story.append(PageBreak())

    # =========================================================================
    # SECTION 3: CONTRACTOR & CONTRACT TRACKING
    # =========================================================================
    story.append(Paragraph("3.0 Contractor & Contract Tracking", sec_title))
    
    t3_data = [
        [Paragraph("<b>#</b>", table_header), Paragraph("<b>Difficult Academic Word (Old / In System)</b>", table_header), Paragraph("<b>Simple Human Word (New / Plain English)</b>", table_header), Paragraph("<b>Where It Appears</b>", table_header), Paragraph("<b>Why It Was Confusing / Plain Meaning</b>", table_header)],
        [
            Paragraph("13", table_cell),
            Paragraph("Contractor Intelligence & Performance Dossier", table_cell_old),
            Paragraph("Contractor Track Record & History", table_cell_new),
            Paragraph("Page title & navigation bar", table_cell),
            Paragraph("'Intelligence Dossier' sounds like secret police files. Plain meaning: <i>Summary of how many works the contractor finished or delayed.</i>", table_cell)
        ],
        [
            Paragraph("14", table_cell),
            Paragraph("Defect Liability Period (DLP)", table_cell_old),
            Paragraph("1-Year Repair Warranty", table_cell_new),
            Paragraph("Project cards & contractor profile", table_cell),
            Paragraph("Citizens and clerks don't know 'DLP'. Everyone understands <i>Repair Warranty (Fix cracks/leaks for free for 1 year).</i>", table_cell)
        ],
        [
            Paragraph("15", table_cell),
            Paragraph("Running Account (RA) Bill / e-MB", table_cell_old),
            Paragraph("Current Work Bill / Digital Measurement Book", table_cell_new),
            Paragraph("Contractor portal & bill lists", table_cell),
            Paragraph("Technical accounting abbreviations. Plain meaning: <i>Official bill submitted for work finished so far.</i>", table_cell)
        ],
        [
            Paragraph("16", table_cell),
            Paragraph("Portfolio Saturation / Overload", table_cell_old),
            Paragraph("Too Many Works Given to One Firm", table_cell_new),
            Paragraph("Contractor risk card", table_cell),
            Paragraph("'Portfolio saturation' is finance textbook jargon. Plain meaning: <i>Contractor took too many works and can't finish on time.</i>", table_cell)
        ],
        [
            Paragraph("17", table_cell),
            Paragraph("Performance Bank Guarantee (PBG)", table_cell_old),
            Paragraph("Contractor Security Deposit (Bank Guarantee)", table_cell_new),
            Paragraph("Guarantees page & badges", table_cell),
            Paragraph("'PBG' is legal-financial jargon. Plain meaning: <i>Cash deposit kept in bank that government can seize if contractor runs away.</i>", table_cell)
        ]
    ]
    t3 = Table(t3_data, colWidths=[18, 120, 130, 95, 160])
    t3.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_navy),
        ('GRID', (0, 0), (-1, -1), 0.4, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_light_bg]),
        ('PADDING', (0, 0), (-1, -1), 3.2),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(t3)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 4: ALERTS, FINANCE & LEGAL TERMS
    # =========================================================================
    story.append(Paragraph("4.0 Alerts, Finance & Legal Terms", sec_title))
    
    t4_data = [
        [Paragraph("<b>#</b>", table_header), Paragraph("<b>Difficult Academic Word (Old / In System)</b>", table_header), Paragraph("<b>Simple Human Word (New / Plain English)</b>", table_header), Paragraph("<b>Where It Appears</b>", table_header), Paragraph("<b>Why It Was Confusing / Plain Meaning</b>", table_header)],
        [
            Paragraph("18", table_cell),
            Paragraph("Freeze Escrow Disbursements", table_cell_old),
            Paragraph("Put Payments on Hold (Stop Money)", table_cell_new),
            Paragraph("Alerts statutory action bar", table_cell),
            Paragraph("'Escrow disbursements' is high finance jargon. Plain meaning: <i>Lock the bank account so no corrupt money is paid out.</i>", table_cell)
        ],
        [
            Paragraph("19", table_cell),
            Paragraph("Issue Show-Cause Notice", table_cell_old),
            Paragraph("Send Warning Letter (Explain or Face Penalty)", table_cell_new),
            Paragraph("Alerts statutory action bar", table_cell),
            Paragraph("Most people don't know what 'Show-Cause' means. Plain meaning: <i>Give contractor 7 days to explain why they shouldn't be punished.</i>", table_cell)
        ],
        [
            Paragraph("20", table_cell),
            Paragraph("Liquidated Damages (LD)", table_cell_old),
            Paragraph("Late Delay Fine", table_cell_new),
            Paragraph("Disputes table & contract cards", table_cell),
            Paragraph("'Liquidated damages' is high-court legal jargon. Plain meaning: <i>Deducting 0.5% fine every week the work is late.</i>", table_cell)
        ],
        [
            Paragraph("21", table_cell),
            Paragraph("Arbitration & Conciliation", table_cell_old),
            Paragraph("Dispute Settlement Meeting", table_cell_new),
            Paragraph("Disputes timeline", table_cell),
            Paragraph("'Conciliation' is legal terminology. Plain meaning: <i>Formal negotiation meeting between Collector and contractor to resolve fight.</i>", table_cell)
        ],
        [
            Paragraph("22", table_cell),
            Paragraph("Whistleblower Bounty Registry", table_cell_old),
            Paragraph("Secret Corruption Report & Cash Rewards", table_cell_new),
            Paragraph("Citizen grievance page", table_cell),
            Paragraph("'Bounty registry' sounds like wild west movies. Plain meaning: <i>Citizens secretly report theft and get cash rewards when proven.</i>", table_cell)
        ],
        [
            Paragraph("23", table_cell),
            Paragraph("Tamper-Evident System Audit Trail", table_cell_old),
            Paragraph("Permanent Activity Log (Cannot Be Changed)", table_cell_new),
            Paragraph("Sidebar & audit page", table_cell),
            Paragraph("Cybersecurity phrasing. Plain meaning: <i>Every click, bill approval, and edit is permanently written and cannot be erased.</i>", table_cell)
        ],
        [
            Paragraph("24", table_cell),
            Paragraph("Attestation Block", table_cell_old),
            Paragraph("Signatures & Approvals", table_cell_new),
            Paragraph("Official PDF reports", table_cell),
            Paragraph("'Attestation' is bureaucratic Latin. Plain English: <i>Signature and official stamp of the inspecting engineers.</i>", table_cell)
        ]
    ]
    t4 = Table(t4_data, colWidths=[18, 120, 130, 95, 160])
    t4.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_navy),
        ('GRID', (0, 0), (-1, -1), 0.4, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_light_bg]),
        ('PADDING', (0, 0), (-1, -1), 3.2),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(t4)
    story.append(Spacer(1, 10))

    # Summary footer card
    summary_box = (
        "<b>HOW TO USE THIS REFERENCE:</b><br/>"
        "Keep this PDF handy during presentations, jury evaluations, or citizen interactions. Whenever a user encounters a formal "
        "statutory term (like <i>Concordance Verified</i>, <i>DLP</i>, <i>Fiscal-Physical Disparity</i>, or <i>Liquidated Damages</i>), "
        "this guide provides the instant everyday human translation."
    )
    t_sum = Table([[Paragraph(summary_box, body)]], colWidths=[523])
    t_sum.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#ECFDF5")),
        ('BOX', (0, 0), (-1, -1), 0.8, c_emerald),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_sum)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] Language Guide PDF generated: {filename}")

if __name__ == '__main__':
    generate_pdf()
