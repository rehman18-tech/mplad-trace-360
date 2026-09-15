import os
import shutil
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

SLIDE_WIDTH = 13.333 * 72  # 960 pt
SLIDE_HEIGHT = 7.5 * 72    # 540 pt

class SlideCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.pages = []

    def showPage(self):
        self.pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        page_count = len(self.pages)
        for page in self.pages:
            self.__dict__.update(page)
            self.draw_slide_decorations(page_count)
            super().showPage()
        super().save()

    def draw_slide_decorations(self, total_pages):
        self.saveState()
        # Top saffron accent
        self.setFillColor(colors.HexColor("#EA580C"))
        self.rect(0, SLIDE_HEIGHT - 8, SLIDE_WIDTH, 8, fill=1, stroke=0)

        # Footer
        if self._pageNumber > 1:
            self.setFont("Helvetica", 9)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawString(54, 25, "MPLAD-TRACE 360™ • National Public Infrastructure Surveillance • MoSPI & CVC Guidelines 2026")
            self.drawRightString(SLIDE_WIDTH - 54, 25, f"Slide {self._pageNumber} of {total_pages}")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 38, SLIDE_WIDTH - 54, 38)
        self.restoreState()

def generate_slides_pdf(filename="MPLAD_Trace_360_Master_Deck.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=(SLIDE_WIDTH, SLIDE_HEIGHT),
        leftMargin=54,
        rightMargin=54,
        topMargin=42,
        bottomMargin=46
    )

    styles = getSampleStyleSheet()

    # Base typography
    title_style = ParagraphStyle(
        'SlideTitle',
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0B2545'),
        spaceAfter=3
    )
    sub_style = ParagraphStyle(
        'SlideSub',
        fontName='Helvetica',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor('#64748B'),
        spaceAfter=14
    )
    card_title = ParagraphStyle(
        'CardTitle',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#0B2545'),
        spaceAfter=4
    )
    card_sub = ParagraphStyle(
        'CardSub',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#EA580C'),
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'CardBody',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#1E293B')
    )
    badge_style = ParagraphStyle(
        'BadgeText',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=1
    )

    story = []

    # -------------------------------------------------------------
    # SLIDE 1: Cover
    # -------------------------------------------------------------
    story.append(Spacer(1, 40))
    cover_table_data = [
        [Paragraph("<font color='#D97706'><b>SMART INDIA HACKATHON 2026 | MoSPI GOVERNANCE TRACK | MASTER EVALUATION DECK</b></font>", body_style)],
        [Paragraph("<font color='#FFFFFF' size='36'><b>MPLAD-TRACE 360™</b></font>", title_style)],
        [Paragraph("<font color='#FED7AA' size='15'><b>Continuous AI Physical Surveillance, Dual-Cadre Consensus & Zero Ghost Billing Circuit-Breaker</b></font>", title_style)],
        [Paragraph("<font color='#CBD5E1' size='11'>An Autonomous Fiscal, Geospatial & Multi-Cadre Field Intelligence Operating System for the Members of Parliament Local Area Development Scheme (MPLADS).</font>", body_style)],
        [Spacer(1, 15)],
        [
            Table([
                [
                    Paragraph("<b>52</b><br/><font color='#D97706'>Sanctioned Works</font><br/><font color='#94A3B8' size='7.5'>10 States & UTs</font>", body_style),
                    Paragraph("<b>Δ ≤ 15%</b><br/><font color='#D97706'>Dual-Cadre Consensus</font><br/><font color='#94A3B8' size='7.5'>MoSPI Clause 3.16-A</font>", body_style),
                    Paragraph("<b>100%</b><br/><font color='#D97706'>Zero-Ghost Billing Lock</font><br/><font color='#94A3B8' size='7.5'>Automated Circuit-Breaker</font>", body_style),
                    Paragraph("<b>100% Offline</b><br/><font color='#D97706'>Rural Ground Mode PWA</font><br/><font color='#94A3B8' size='7.5'>Hardware GPS Watermark</font>", body_style),
                ]
            ], colWidths=[200, 200, 200, 200], style=[
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#132D50')),
                ('TEXTCOLOR', (0,0), (-1,-1), colors.white),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#1E4173')),
                ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#1E4173')),
                ('TOPPADDING', (0,0), (-1,-1), 10),
                ('BOTTOMPADDING', (0,0), (-1,-1), 10),
                ('ALIGN', (0,0), (-1,-1), 'CENTER')
            ])
        ]
    ]

    t_cover = Table(cover_table_data, colWidths=[850])
    t_cover.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#0B2545')),
        ('TOPPADDING', (0,0), (-1,-1), 24),
        ('BOTTOMPADDING', (0,0), (-1,-1), 24),
        ('LEFTPADDING', (0,0), (-1,-1), 32),
        ('RIGHTPADDING', (0,0), (-1,-1), 32),
        ('BOX', (0,0), (-1,-1), 2, colors.HexColor('#1E4173'))
    ]))
    story.append(t_cover)
    story.append(PageBreak())

    # Helper function for 4-column slide
    def add_4col_slide(title, subtitle, col_data):
        story.append(Paragraph(f"<b>{title}</b>", title_style))
        story.append(Paragraph(subtitle, sub_style))

        row = []
        for (head, tag, bullets, bg_col, tag_col) in col_data:
            content = [
                Paragraph(f"<font color='white'><b>{head}</b></font>", badge_style),
                Spacer(1, 4),
                Paragraph(f"<b>{tag}</b>", card_title),
                Spacer(1, 4)
            ]
            for b in bullets:
                content.append(Paragraph(b, body_style))
                content.append(Spacer(1, 3))
            
            c_table = Table([[c] for c in content], colWidths=[198])
            c_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (0,0), tag_col),
                ('BACKGROUND', (0,1), (-1,-1), bg_col),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
                ('TOPPADDING', (0,0), (-1,-1), 5),
                ('BOTTOMPADDING', (0,0), (-1,-1), 5),
                ('LEFTPADDING', (0,0), (-1,-1), 7),
                ('RIGHTPADDING', (0,0), (-1,-1), 7),
            ]))
            row.append(c_table)

        t_row = Table([row], colWidths=[210, 210, 210, 210])
        t_row.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(t_row)
        story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 2: 30 Years of MPLADS Monitoring Evolution
    # -------------------------------------------------------------
    add_4col_slide(
        "1. HISTORICAL CONTEXT: 30 YEARS OF MPLADS MONITORING",
        "Tracing the evolution from paper Measurement Books (1993) to Autonomous Fiscal Enforcement (2026)",
        [
            ("Phase 1: Paper Era (1993–2010)", "Physical Measurement Books",
             ["• Handwritten books recorded by junior engineers.",
              "• Postal sanction routing with months of transit latency.",
              "• High ghost billing and unverified contractor self-claims.",
              "• Opacity: Identical works billed under multiple schemes."],
             colors.HexColor('#FFF1F2'), colors.HexColor('#E11D48')),

            ("Phase 2: Early Digital (2011–2020)", "MPLADS Portal v1.0 (MIS)",
             ["• Basic MySQL database cataloging sanctioned expenditures.",
              "• Clerical upload of scanned sanction letters and text logs.",
              "• Zero spatial geotagging, zero EXIF verification, zero photo proof.",
              "• Vulnerability: Released solely on self-certified numbers."],
             colors.HexColor('#FEF3C7'), colors.HexColor('#D97706')),

            ("Phase 3: Real Assets (2023–Present)", "e-SAKSHI Portal",
             ["• Central portal for paperless MP recommendations.",
              "• Passive repository: Records entries after funds leave treasury.",
              "• Fails in rural/tribal belts without constant 4G data.",
              "• Vulnerability: Static 2D photos easily spoofed; no circuit-breaker."],
             colors.HexColor('#EEF2FF'), colors.HexColor('#4F46E5')),

            ("Phase 4: Autonomous Era (2026)", "MPLAD-TRACE 360™",
             ["• Active Fiscal Circuit-Breaker: Halts PFMS escrow if Δ > 15%.",
              "• Double-Blind Cross-Cadre Consensus: 2 cadres audit blindly.",
              "• 100% Offline PWA: Signed evidence saved in Ground Outbox.",
              "• Zero-Knowledge Whistleblower Drop with direct RBI e-₹ bounty."],
             colors.HexColor('#ECFDF5'), colors.HexColor('#059669'))
        ]
    )

    # -------------------------------------------------------------
    # SLIDE 3: Core Innovations (6 Cards)
    # -------------------------------------------------------------
    story.append(Paragraph("<b>2. CORE BREAKTHROUGH INNOVATIONS</b>", title_style))
    story.append(Paragraph("How MPLAD-TRACE 360 transforms passive archiving into active, real-time fiscal and physical enforcement", sub_style))

    innovations_data = [
        [
            Table([
                [Paragraph("<b>1. Zero Ghost Billing Circuit-Breaker</b>", card_title)],
                [Paragraph("DOMAIN: AUTONOMOUS FISCAL FIREWALL", card_sub)],
                [Paragraph("Halts PFMS escrow payments automatically when physical execution lags financial burn by >15% or site is stalled.", body_style)]
            ], colWidths=[415], style=[
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
                ('PADDING', (0,0), (-1,-1), 8)
            ]),
            Table([
                [Paragraph("<b>2. Autonomous Dual-Inspector Suite</b>", card_title)],
                [Paragraph("DOMAIN: MOSPI CLAUSE 3.16-A MANDATE", card_sub)],
                [Paragraph("Dispatches two independent cadres blindly. Mathematical consensus (Δ ≤ 15%) gates stage progression and payment release.", body_style)]
            ], colWidths=[415], style=[
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
                ('PADDING', (0,0), (-1,-1), 8)
            ])
        ],
        [
            Table([
                [Paragraph("<b>3. Statutory 10-Stage Lifecycle State Machine</b>", card_title)],
                [Paragraph("DOMAIN: LIFECYCLE INTEGRITY", card_sub)],
                [Paragraph("Enforces end-to-end statutory milestones from Hon'ble MP recommendation through tender, PBG, to social audit sign-off.", body_style)]
            ], colWidths=[415], style=[
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
                ('PADDING', (0,0), (-1,-1), 8)
            ]),
            Table([
                [Paragraph("<b>4. Autonomous e-Tender & Anti-Cartel Oracle</b>", card_title)],
                [Paragraph("DOMAIN: CPWD / GEM PROCUREMENT", card_sub)],
                [Paragraph("Statutory price floor (< -25% DSR rejected), sealed cryptographic bids, AI viability scoring, and automated L1 contract award.", body_style)]
            ], colWidths=[415], style=[
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
                ('PADDING', (0,0), (-1,-1), 8)
            ])
        ],
        [
            Table([
                [Paragraph("<b>5. Whistleblower Bounty Marketplace</b>", card_title)],
                [Paragraph("DOMAIN: DIRECT CIVIC INCENTIVE", card_sub)],
                [Paragraph("Citizens upload anonymous proof without login. 12-word seed key claim, CVC forensic probe, and 10% bounty via RBI Digital Rupee.", body_style)]
            ], colWidths=[415], style=[
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
                ('PADDING', (0,0), (-1,-1), 8)
            ]),
            Table([
                [Paragraph("<b>6. Material Quality Testing (IS 456 / IS 516)</b>", card_title)],
                [Paragraph("DOMAIN: STRUCTURAL SOUNDNESS", card_sub)],
                [Paragraph("Computer vision surface defect filtering + 28-day concrete cube compressive tests + GeM/GST e-Way bill quantity reconciliation.", body_style)]
            ], colWidths=[415], style=[
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
                ('PADDING', (0,0), (-1,-1), 8)
            ])
        ]
    ]
    t_innov = Table(innovations_data, colWidths=[425, 425])
    t_innov.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 6)
    ]))
    story.append(t_innov)
    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 4: NEW MODULE: Dual-Inspector Consensus
    # -------------------------------------------------------------
    story.append(Paragraph("<b>3. NEW MODULE: AUTONOMOUS DUAL-INSPECTOR CROSS-CADRE CONSENSUS</b>", title_style))
    story.append(Paragraph("MoSPI Clause 3.16-A & CVC Section 88 Double-Blind Verification Suite with Mathematical Concordance Gating", sub_style))

    dual_cols = [
        Table([
            [Paragraph("<b>CADRE 1: PRIMARY ALLOCATED ENGINEER</b>", badge_style)],
            [Paragraph("<b>Shri R. K. Verma, AEE</b>", card_title)],
            [Paragraph("Panchayati Raj & Rural Engineering (PRED)", card_sub)],
            [Paragraph("• Statutory Duty: Routine departmental supervising engineer.<br/>• Geofence Lock: Device GPS verified within 200m radius.<br/>• Evidence: Geotagged photo + 360° video walkthrough.<br/>• Metric: Observed progress (P1) logged in central register.<br/>• Blind Isolation: Zero access to Inspector 2's schedule or data.", body_style)]
        ], colWidths=[265], style=[
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#4F46E5')),
            ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#EFF6FF')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#93C5FD')),
            ('PADDING', (0,0), (-1,-1), 8)
        ]),

        Table([
            [Paragraph("<b>AI CONSENSUS DECISION ENGINE</b>", badge_style)],
            [Paragraph("<b>Mathematical Delta Formula:<br/>Δ = | P(Inspector 1) - P(Inspector 2) |</b>", card_title)],
            [Paragraph("<b>✓ CONCORDANCE VERIFIED (Δ ≤ 15%):</b><br/>• Both officers give concordant ground observations.<br/>• Official progress updated to average (P1 + P2)/2.<br/>• Advanced to Stage 9 (Measurement & Bill Passing).<br/>• Tranche payment release unlocked in escrow.<br/><br/><b>❌ COLLUSION RED ALERT (Δ > 15%):</b><br/>• Rejected automatically by the machine.<br/>• Stage progression FROZEN at Stage 8.<br/>• Measurement Books quarantined under CVC Sec 88.<br/>• Contractor payment escrow frozen immediately.<br/>• Formal CVC inquiry summons issued to both officers.", body_style)]
        ], colWidths=[295], style=[
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#EA580C')),
            ('BACKGROUND', (0,1), (-1,-1), colors.white),
            ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#EA580C')),
            ('PADDING', (0,0), (-1,-1), 8)
        ]),

        Table([
            [Paragraph("<b>CADRE 2: BLIND CROSS-CADRE AUDITOR</b>", badge_style)],
            [Paragraph("<b>Smt. K. Sarada, AE</b>", card_title)],
            [Paragraph("Rural Water Supply & Sanitation (RWSS)", card_sub)],
            [Paragraph("• Statutory Duty: Independent blind technical auditor.<br/>• Quarantine: Out-of-cadre assignment prevents local collusion.<br/>• Parallel SLA: Dispatched independently within 48-hour window.<br/>• Metric: Independent ground progress (P2) logged on site.<br/>• Persona Switcher: Live cadre toggle for seamless simulation.", body_style)]
        ], colWidths=[265], style=[
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#4F46E5')),
            ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#F5F3FF')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#C4B5FD')),
            ('PADDING', (0,0), (-1,-1), 8)
        ])
    ]

    t_dual = Table([dual_cols], colWidths=[275, 305, 275])
    t_dual.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0)
    ]))
    story.append(t_dual)
    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 5: NEW MODULE: 10-Stage Lifecycle State Machine
    # -------------------------------------------------------------
    story.append(Paragraph("<b>4. NEW MODULE: STATUTORY 10-STAGE LIFECYCLE STATE MACHINE</b>", title_style))
    story.append(Paragraph("End-to-End Milestone Tracking from Hon'ble MP Recommendation through Tender, PBG Escrow, to Social Audit Handover", sub_style))

    stages_row1 = [
        ("Stage 1", "MP Recommendation", "Hon'ble MP proposal letter submitted under guidelines."),
        ("Stage 2", "Admin Sanction", "District Collector approval; baseline geotag locked."),
        ("Stage 3", "Technical Sanction", "Superintending Engineer vetted DPR & structural estimates."),
        ("Stage 4", "Tender Notification", "NIT e-procurement published with itemized BoQ."),
        ("Stage 5", "Contract Award", "L1 selected; 5% Performance Bank Guarantee (PBG) locked.")
    ]
    stages_row2 = [
        ("Stage 6", "Fund Release (Tranche 1)", "PFMS gateway treasury release dispatched to escrow."),
        ("Stage 7", "Work Commencement", "Site handover, groundbreaking, plinth foundation excavation."),
        ("Stage 8", "Field Inspection", "Dual-cadre blind audit + 360° video. GATES STAGE 9!"),
        ("Stage 9", "Progress & Measurement", "Measurement Book (MB) verified and bill passed."),
        ("Stage 10", "Completion & Handover", "Final social audit sign-off & public asset commissioning.")
    ]

    def make_stage_cards(s_list, is_row2=False):
        cells = []
        for s_num, s_name, s_desc in s_list:
            tag_c = colors.HexColor('#EA580C') if s_num == 'Stage 8' else colors.HexColor('#059669')
            card = Table([
                [Paragraph(f"<b>{s_num}</b>", badge_style)],
                [Paragraph(f"<b>{s_name}</b>", card_title)],
                [Paragraph(s_desc, body_style)]
            ], colWidths=[160], style=[
                ('BACKGROUND', (0,0), (-1,0), tag_c),
                ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#F8FAFC')),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
                ('PADDING', (0,0), (-1,-1), 6)
            ])
            cells.append(card)
        return Table([cells], colWidths=[170, 170, 170, 170, 170])

    story.append(make_stage_cards(stages_row1))
    story.append(Spacer(1, 10))
    story.append(make_stage_cards(stages_row2, is_row2=True))
    story.append(Spacer(1, 10))

    callout = Table([
        [Paragraph("<font color='#78350F'><b>CRITICAL STATUTORY GOVERNANCE RULE:</b> Stage 8 (Field Inspection) → Stage 9 (Measurement & Bill Passing) transition is strictly gated by Dual-Inspector Concordance (Δ ≤ 15%). Discrepancies lock progress and freeze payments under CVC Section 88.</font>", body_style)]
    ], colWidths=[850], style=[
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FEF3C7')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#D97706')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('ALIGN', (0,0), (-1,-1), 'CENTER')
    ])
    story.append(callout)
    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 6: NEW MODULE: e-Tender & Anti-Cartel Oracle
    # -------------------------------------------------------------
    add_4col_slide(
        "5. NEW MODULE: AUTONOMOUS E-TENDER BIDDING & ANTI-CARTEL ORACLE",
        "Procurement Integrity Suite: Statutory Price Floor, Sealed Cryptographic Bids & Automated Collusion Ring Detection",
        [
            ("Itemized Bill of Quantities", "BoQ & SOR Schedule",
             ["• Standard Schedule of Rates (SOR) itemization.",
              "• Concrete, TMT rebar, brick masonry, labor.",
              "• Autonomous estimate calculation prevents discretion.",
              "• Every unit linked to state civil schedules."],
             colors.HexColor('#F8FAFC'), colors.HexColor('#4F46E5')),

            ("Price Floor Protection", "Anti-Dumping Rule",
             ["• Bids < -25% DSR rejected as unviable.",
              "• Eliminates contractor insolvency & abandonment.",
              "• Stops substandard material substitution.",
              "• Example: ₹15L estimate has ₹12.75L floor."],
             colors.HexColor('#FFF1F2'), colors.HexColor('#E11D48')),

            ("Sealed Bid Cryptography", "Encrypted Window",
             ["• Encrypted until 30-min countdown timer expires.",
              "• Prevents premature bid leakage & insider coaching.",
              "• Real-time countdown visible on bidder portal.",
              "• Full cryptographic unsealing audit trail."],
             colors.HexColor('#FEF3C7'), colors.HexColor('#D97706')),

            ("Autonomous AI Evaluation", "Anti-Cartel Engine",
             ["• Unseals bids & benchmarks against CPWD DSR.",
              "• BIS Grade-A viability scoring (0–100).",
              "• Cartel detection: flags identical IP/GSTIN rings.",
              "• Auto-awards to L1 contractor with clearance hash."],
             colors.HexColor('#ECFDF5'), colors.HexColor('#059669'))
        ]
    )

    # -------------------------------------------------------------
    # SLIDE 7: NEW MODULE: Whistleblower Bounty Marketplace
    # -------------------------------------------------------------
    add_4col_slide(
        "6. NEW MODULE: WHISTLEBLOWER BOUNTY MARKETPLACE & ZERO-KNOWLEDGE DROP",
        "Encrypted Public Oversight: Anonymous Submissions, Forensic CVC Site Testing & 10% Recovery Bounty via RBI e-₹",
        [
            ("STEP 1: ZERO-KNOWLEDGE DROP", "Anonymous Proof Upload",
             ["• Citizens submit photo, video, or doc proof.",
              "• Zero registration: No phone, email, or KYC.",
              "• End-to-end encrypted drop isolates citizen.",
              "• Complete protection from retaliatory threats."],
             colors.HexColor('#F8FAFC'), colors.HexColor('#4F46E5')),

            ("STEP 2: 12-WORD SEED KEY", "Cryptographic Claim Key",
             ["• Automatically generates BIP-39 mnemonic seed.",
              "• SHA-256 hash locked in registry.",
              "• Phrase is ONLY key to prove ownership.",
              "• No centralized identity database kept."],
             colors.HexColor('#FEF3C7'), colors.HexColor('#D97706')),

            ("STEP 3: FORENSIC CVC AUDIT", "Chief Technical Examiner",
             ["• Dispatched to CVC CTE inspection wing.",
              "• Physical core drilling & non-destructive tests.",
              "• When fraud proven, 100% billing frozen.",
              "• Contractor escrow quarantined in treasury."],
             colors.HexColor('#FFF1F2'), colors.HexColor('#E11D48')),

            ("STEP 4: ANONYMOUS BOUNTY", "10% Statutory Recovery",
             ["• Whistleblower claims 10% of frozen penalty.",
              "• 1. RBI Digital Rupee (e-₹ CBDC Voucher).",
              "• 2. India Post Cash Voucher at rural post office.",
              "• 3. Anonymous UPI Transaction Bridge."],
             colors.HexColor('#ECFDF5'), colors.HexColor('#059669'))
        ]
    )

    # -------------------------------------------------------------
    # SLIDE 8: Construction Material Quality Testing
    # -------------------------------------------------------------
    story.append(Paragraph("<b>7. CONSTRUCTION MATERIAL QUALITY TESTING (IS 456 / IS 516)</b>", title_style))
    story.append(Paragraph("3-Layer Material Verification: Computer Vision Surface Defect Analytics + Concrete Cube Tests + e-Way Bill Auditing", sub_style))

    m_cols = [
        Table([
            [Paragraph("<b>LAYER 1: COMPUTER VISION SURFACE ANALYTICS</b>", badge_style)],
            [Paragraph("<b>Visual & Texture Deep Inspection</b>", card_title)],
            [Paragraph("• OpenCV Laplacian Edge Filtering: Computes surface variance to detect structural honeycombing and void depths >5mm.<br/>• Color Histogram & HSV Masking: Flags tensile rebar corrosion flaking on exposed column reinforcement (>15% oxidation triggers defect).<br/>• Color Clustering (k-Means): Detects white salt efflorescence on newly cast brickwork, indicating high-salinity water mix.<br/>• Outcome: Replaces subjective human guesses with mathematical pixel-level surface defect classification.", body_style)]
        ], colWidths=[270], style=[
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#4F46E5')),
            ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#F5F3FF')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#C4B5FD')),
            ('PADDING', (0,0), (-1,-1), 8)
        ]),

        Table([
            [Paragraph("<b>LAYER 2: DIGITAL CONCRETE CUBE TESTS (IS 516)</b>", badge_style)],
            [Paragraph("<b>Compressive Strength Laboratory Testing</b>", card_title)],
            [Paragraph("• Mandates physical casting of standard 150mm x 150mm concrete test cubes during slab and column pouring.<br/>• Compressive Testing Machine (CTM) logs crushing load at 7 days and 28 days (e.g. 24.8 MPa target for M20 concrete).<br/>• AI checks strength gain curves against statutory IS 456 curing envelopes.<br/>• Outcome: Automatically triggers fiscal freeze if 28-day concrete strength falls below 85% of design compressive specification.", body_style)]
        ], colWidths=[270], style=[
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#EA580C')),
            ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#FFF7ED')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#FDBA74')),
            ('PADDING', (0,0), (-1,-1), 8)
        ]),

        Table([
            [Paragraph("<b>LAYER 3: GEM & GST E-WAY BILL RECONCILIATION</b>", badge_style)],
            [Paragraph("<b>Anti-Dilution Supply-Chain Forensic Audit</b>", card_title)],
            [Paragraph("• Reconciles theoretical Bill of Quantities (BoQ) volume against verified delivery challans and e-Way bills.<br/>• Example: A 3,000 sq.ft hall requires ~450 bags of Grade 43/53 OPC cement and 3.2 tonnes of Fe500D primary steel.<br/>• Cross-checks GST invoices to ensure vendor delivered the exact volume to that specific GPS coordinate.<br/>• Outcome: Detects contractor material dilution (e.g. 60% cement deficit) before structural failure occurs.", body_style)]
        ], colWidths=[270], style=[
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#059669')),
            ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#ECFDF5')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#6EE7B7')),
            ('PADDING', (0,0), (-1,-1), 8)
        ])
    ]

    t_mat = Table([m_cols], colWidths=[280, 280, 280])
    t_mat.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0)
    ]))
    story.append(t_mat)
    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 9: Complete Machine Learning & Algorithmic Inventory
    # -------------------------------------------------------------
    story.append(Paragraph("<b>8. COMPLETE MACHINE LEARNING & ALGORITHMIC INVENTORY</b>", title_style))
    story.append(Paragraph("The 7 Mathematical, Geodesic & Machine Learning Engines Powering Continuous Autonomous Governance", sub_style))

    ml_data = [
        [
            Table([
                [Paragraph("<b>1. Structural CV Verifier</b>", card_title)],
                [Paragraph("OpenCV Laplacian Edge Filtering, SSIM, Color Histograms", card_sub)],
                [Paragraph("Detects honeycombing/voids (>5mm), rebar oxidation flaking, and structural milestone similarity matching.", body_style)]
            ], colWidths=[415], style=[('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')), ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')), ('PADDING', (0,0), (-1,-1), 6)]),
            Table([
                [Paragraph("<b>2. Bayesian Delay Predictor</b>", card_title)],
                [Paragraph("Bayesian Milestone Velocity Regression & Historical Lag Heuristics", card_sub)],
                [Paragraph("Projects completion dates, calculating slippage days and probability based on daily execution velocity.", body_style)]
            ], colWidths=[415], style=[('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')), ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')), ('PADDING', (0,0), (-1,-1), 6)])
        ],
        [
            Table([
                [Paragraph("<b>3. Geospatial Duplicate Engine</b>", card_title)],
                [Paragraph("Spherical Haversine Distance (R=6371km) + Jaccard Token N-Gram", card_sub)],
                [Paragraph("Flags duplicate works within 150m–300m with descriptive title similarity to eliminate cross-scheme double dipping.", body_style)]
            ], colWidths=[415], style=[('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')), ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')), ('PADDING', (0,0), (-1,-1), 6)]),
            Table([
                [Paragraph("<b>4. 7-Factor MoSPI Risk Engine</b>", card_title)],
                [Paragraph("Weighted Multi-Criteria Decision Analysis (MCDA) (0–100 Score)", card_sub)],
                [Paragraph("Aggregates Cost, Schedule, Discrepancy, Evidence, Contractor, Document, and Citizen Grievance signals.", body_style)]
            ], colWidths=[415], style=[('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')), ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')), ('PADDING', (0,0), (-1,-1), 6)])
        ],
        [
            Table([
                [Paragraph("<b>5. Zero Ghost Billing Engine</b>", card_title)],
                [Paragraph("Dynamic Fiscal Discrepancy Gate (Delta = Financial % - Physical %)", card_sub)],
                [Paragraph("Engages automated circuit-breaker if Delta > 15% or status is Stalled; halts PFMS escrow disbursements.", body_style)]
            ], colWidths=[415], style=[('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')), ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')), ('PADDING', (0,0), (-1,-1), 6)]),
            Table([
                [Paragraph("<b>6. Dual-Inspector Consensus Engine</b>", card_title)],
                [Paragraph("Multi-Cadre Discrepancy Gate (Delta = |P1 - P2|)", card_sub)],
                [Paragraph("Enforces MoSPI Clause 3.16-A. Evaluates concordance (Δ ≤ 15%) to unlock next lifecycle stage and release funds.", body_style)]
            ], colWidths=[415], style=[('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')), ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')), ('PADDING', (0,0), (-1,-1), 6)])
        ]
    ]

    t_ml = Table(ml_data, colWidths=[425, 425])
    t_ml.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4)
    ]))
    story.append(t_ml)
    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 10: Fiscal Circuit-Breaker Freezing & Unfreezing
    # -------------------------------------------------------------
    story.append(Paragraph("<b>9. FISCAL CIRCUIT-BREAKER: FREEZING & UNFREEZING PROTOCOLS</b>", title_style))
    story.append(Paragraph("Mathematical Boundaries Governing PFMS Escrow Locks and the Statutory 5-Step Recovery Protocol", sub_style))

    cb_left = Table([
        [Paragraph("<font color='#E11D48'><b>WHEN DOES THE AI FREEZE FUNDS?</b></font>", card_title)],
        [Paragraph("<b>⛔ Risk Score ≥ 75 / 100 (CRITICAL)</b><br/>Engages automatic audit lockout. All pending milestone tranches withheld.<br/><br/><b>⛔ Ghost Billing Discrepancy > 15%</b><br/>Claimed financial release exceeds verified physical execution by >15%.<br/><br/><b>⛔ Site Flagged as 'STALLED'</b><br/>Field inspection confirms prolonged work stoppage, demobilization, or abandonment.<br/><br/><b>⛔ Material Strength Deficit</b><br/>28-day concrete cube compressive test falls below 85% of design target.<br/><br/><b>⛔ Dual-Inspector Discrepancy > 15%</b><br/>Inspector 1 vs Inspector 2 divergence exceeds statutory tolerance under CVC Sec 88.<br/><br/><b>⛔ Active Citizen Defect Liability Claim</b><br/>36-month DLP violation flagged via 1-click GPS reverse-lookup.", body_style)]
    ], colWidths=[415], style=[
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFF1F2')),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#E11D48')),
        ('PADDING', (0,0), (-1,-1), 10)
    ])

    cb_right = Table([
        [Paragraph("<font color='#059669'><b>STATUTORY 5-STEP UNFREEZING PROTOCOL</b></font>", card_title)],
        [Paragraph("<b>✓ Step 1: Contractor Civil Rectification</b><br/>Contractor cures defects on site to catch up physical execution with claimed milestone.<br/><br/><b>✓ Step 2: Fresh Geotagged Field Re-Inspection</b><br/>Field engineer re-inspects site with mandatory 360° video walkthrough within 200m geofence.<br/><br/><b>✓ Step 3: District Planning Officer (DPO) Review</b><br/>DPO scrutinizes evidence dossier in AI Anomaly Center and signs formal digital clearance.<br/><br/><b>✓ Step 4: Automated AI Score Recalculation</b><br/>AI recalculates composite risk; score drops below 30 (NORMAL). Red circuit-breaker clears.<br/><br/><b>✓ Step 5: PFMS Escrow Disbursal Resumed</b><br/>Treasury gateway release unlocks automatically. Finance officers disburse verified tranche.", body_style)]
    ], colWidths=[415], style=[
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ECFDF5')),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#059669')),
        ('PADDING', (0,0), (-1,-1), 10)
    ])

    t_cb = Table([[cb_left, cb_right]], colWidths=[425, 425])
    t_cb.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0)
    ]))
    story.append(t_cb)
    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 11: 1-Click Reverse Lookup & PBG Liability
    # -------------------------------------------------------------
    add_4col_slide(
        "10. 1-CLICK GPS ASSET REVERSE-LOOKUP & DEFECT LIABILITY",
        "Citizen Smartphone Camera Click Isolates Exact Contractor & Freezes 5% Performance Bank Guarantee (PBG)",
        [
            ("STEP 1: HARDWARE CAPTURE", "WGS84 Camera Sensor",
             ["• HTML5 camera viewfinder on mobile browser.",
              "• Samples hardware GPS chip with ±5m accuracy.",
              "• Optical HUD aligns defect/crack in frame.",
              "• Cryptographic watermark burned into EXIF bytes."],
             colors.HexColor('#F8FAFC'), colors.HexColor('#4F46E5')),

            ("STEP 2: SPATIAL MATCHING", "Haversine Geodesy Engine",
             ["• Great-circle distance calculated instantly.",
              "• Queries master registry within 200m–3km.",
              "• Disambiguates junction projects by DLP status.",
              "• Resolves exact Project ID & sanction ledger."],
             colors.HexColor('#FEF3C7'), colors.HexColor('#D97706')),

            ("STEP 3: LEGAL RESOLUTION", "Contractor & PBG Resolution",
             ["• Resolves executing contractor profile.",
              "• Audits active 36-Month Defect Liability Period.",
              "• Identifies 5% PBG bank guarantee in escrow.",
              "• Tags guarantee record: action_required = True."],
             colors.HexColor('#FFF7ED'), colors.HexColor('#EA580C')),

            ("STEP 4: AUTO ESCALATION", "Level-4 Vigilance Trigger",
             ["• Generates CRITICAL Alert (ALT-DEFECT-XXXXX).",
              "• Dispatches 3-day statutory notice to contractor.",
              "• Notifies District Collector & CVC CTE team.",
              "• Citizen tracks forensic audit progress live in HUD."],
             colors.HexColor('#ECFDF5'), colors.HexColor('#059669'))
        ]
    )

    # -------------------------------------------------------------
    # SLIDE 12: Central Database Audit & Jury Takeaway
    # -------------------------------------------------------------
    story.append(Paragraph("<b>11. CENTRAL DATABASE AUDIT & PRODUCTION READINESS</b>", title_style))
    story.append(Paragraph("All 52 Live Works Audited with 100% Mathematical Reconciliation Across 10 States/UTs", sub_style))

    metrics_table = Table([
        [
            Paragraph("<b>52</b><br/><font color='#0B2545'><b>Sanctioned Works</b></font><br/><font color='#64748B' size='7.5'>10 States / UTs across India</font>", body_style),
            Paragraph("<b>24</b><br/><font color='#E11D48'><b>Funds Frozen</b></font><br/><font color='#64748B' size='7.5'>Critical / Stalled / Delta >15%</font>", body_style),
            Paragraph("<b>15</b><br/><font color='#059669'><b>Completed Works</b></font><br/><font color='#64748B' size='7.5'>100% Physically & Financially Closed</font>", body_style),
            Paragraph("<b>24</b><br/><font color='#D97706'><b>Live AI Alerts</b></font><br/><font color='#64748B' size='7.5'>Continuous Surveillance Monitoring</font>", body_style),
        ]
    ], colWidths=[205, 205, 205, 205], style=[
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('PADDING', (0,0), (-1,-1), 10),
        ('ALIGN', (0,0), (-1,-1), 'CENTER')
    ])
    story.append(metrics_table)
    story.append(Spacer(1, 14))

    jury_table = Table([
        [Paragraph("<font color='#EA580C'><b>CORE TAKEAWAY FOR THE EVALUATION JURY</b></font>", card_title)],
        [Paragraph(
            "• <b>Production-Ready Architecture:</b> MPLAD-TRACE 360 is not a mockup or wireframe. It is a live, production-grade system with 0 TypeScript compilation errors and a robust FastAPI async backend.<br/><br/>"
            "• <b>True Paradigm Shift:</b> Previous platforms (MPLADS Portal, e-SAKSHI) operated as passive historical archives. MPLAD-TRACE 360 operates as an active financial and physical circuit-breaker that freezes payment tranches BEFORE funds leave treasury escrow.<br/><br/>"
            "• <b>Statutory Compliance:</b> Built directly against MoSPI MPLADS Scheme Guidelines 2023, CPWD Works Manual 2024, CVC Technical Audit Directives (Section 88), and IS 456 / IS 516 concrete standards.<br/><br/>"
            "• <b>End-to-End Governance Suite:</b> Integrates Autonomous Dual-Inspector Cross-Cadre Consensus, 10-Stage Lifecycle State Machine, e-Tender Anti-Cartel Oracle, Whistleblower e-₹ Bounty Drop, and 1-Click GPS Defect Liability Reverse-Lookup.<br/><br/>"
            "• <b>Impact at Scale:</b> Safeguards thousands of crores in public infrastructure funds, guaranteeing that every public asset is genuinely verified, structurally sound, and accountable to every citizen.",
            body_style
        )]
    ], colWidths=[840], style=[
        ('BACKGROUND', (0,0), (-1,-1), colors.white),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#0B2545')),
        ('PADDING', (0,0), (-1,-1), 14)
    ])
    story.append(jury_table)

    doc.build(story, canvasmaker=SlideCanvas)
    print(f"Slides PDF generated: {filename}")

    # Copy to public and dist
    dest_pub = os.path.join("frontend", "public", filename)
    dest_dst = os.path.join("frontend", "dist", filename)
    try:
        shutil.copyfile(filename, dest_pub)
        print(f"Copied to {dest_pub}")
    except:
        pass
    try:
        if os.path.exists("frontend/dist"):
            shutil.copyfile(filename, dest_dst)
            print(f"Copied to {dest_dst}")
    except:
        pass

if __name__ == "__main__":
    generate_slides_pdf()
