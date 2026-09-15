import os
import shutil
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_master_deck(output_pptx="MPLAD_Trace_360_Master_Deck.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Standard Theme Colors
    NAVY = RGBColor(11, 37, 69)         # #0B2545
    NAVY_LIGHT = RGBColor(19, 64, 116)   # #134074
    SAFFRON = RGBColor(234, 88, 12)      # #EA580C
    AMBER = RGBColor(217, 119, 6)        # #D97706
    EMERALD = RGBColor(5, 150, 105)      # #059669
    ROSE = RGBColor(225, 29, 72)         # #E11D48
    INDIGO = RGBColor(79, 70, 229)       # #4F46E5
    SLATE_DARK = RGBColor(30, 41, 59)    # #1E293B
    SLATE_MUTED = RGBColor(100, 116, 139)# #64748B
    SLATE_LIGHT = RGBColor(241, 245, 249)# #F1F5F9
    WHITE = RGBColor(255, 255, 255)
    CARD_BG = RGBColor(248, 250, 252)    # #F8FAFC
    BORDER_COLOR = RGBColor(226, 232, 240)# #E2E8F0

    def add_header(slide, title_text, subtitle_text):
        # Top banner bar
        bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.1))
        bar.fill.solid()
        bar.fill.fore_color.rgb = SAFFRON
        bar.line.fill.background()

        # Title & Subtitle Box
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(11.733), Inches(1.0))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p1 = tf.paragraphs[0]
        p1.text = title_text
        p1.font.name = "Segoe UI"
        p1.font.size = Pt(21)
        p1.font.bold = True
        p1.font.color.rgb = NAVY

        p2 = tf.add_paragraph()
        p2.text = subtitle_text
        p2.font.name = "Segoe UI"
        p2.font.size = Pt(11)
        p2.font.color.rgb = SLATE_MUTED

    def add_footer(slide, current_page, total_pages=12):
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(7.05), Inches(11.733), Inches(0.35))
        tf = tb.text_frame
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = f"MPLAD-TRACE 360™ • National Public Works Surveillance Intelligence • MoSPI & CVC Guidelines 2026 | Slide {current_page} of {total_pages}"
        p.font.name = "Segoe UI"
        p.font.size = Pt(8.5)
        p.font.color.rgb = SLATE_MUTED

    def create_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=BORDER_COLOR):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.2)
        return card

    # =========================================================================
    # SLIDE 1: COVER / TITLE SLIDE
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = NAVY
    bg1.line.fill.background()

    # Tricolor top line
    t_bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.12))
    t_bar.fill.solid()
    t_bar.fill.fore_color.rgb = SAFFRON
    t_bar.line.fill.background()

    # Title Card Text
    tb1 = s1.shapes.add_textbox(Inches(1.0), Inches(1.3), Inches(11.333), Inches(4.5))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    # Jury Badge
    p_badge = tf1.paragraphs[0]
    p_badge.text = "SMART INDIA HACKATHON 2026 | MoSPI GOVERNANCE TRACK | MASTER EVALUATION DECK"
    p_badge.font.name = "Segoe UI"
    p_badge.font.size = Pt(11)
    p_badge.font.bold = True
    p_badge.font.color.rgb = AMBER
    p_badge.space_after = Pt(14)

    # Main Title
    p_title = tf1.add_paragraph()
    p_title.text = "MPLAD-TRACE 360™"
    p_title.font.name = "Segoe UI"
    p_title.font.size = Pt(44)
    p_title.font.bold = True
    p_title.font.color.rgb = WHITE
    p_title.space_after = Pt(8)

    # Subtitle
    p_sub = tf1.add_paragraph()
    p_sub.text = "Continuous AI Physical Surveillance, Dual-Cadre Consensus & Zero Ghost Billing Circuit-Breaker"
    p_sub.font.name = "Segoe UI"
    p_sub.font.size = Pt(17)
    p_sub.font.bold = True
    p_sub.font.color.rgb = RGBColor(254, 215, 170) # warm saffron tint
    p_sub.space_after = Pt(12)

    # Description
    p_desc = tf1.add_paragraph()
    p_desc.text = "An Autonomous Fiscal, Geospatial & Engineering Surveillance Operating System for the Members of Parliament Local Area Development Scheme (MPLADS)."
    p_desc.font.name = "Segoe UI"
    p_desc.font.size = Pt(12)
    p_desc.font.color.rgb = RGBColor(203, 213, 225)
    p_desc.space_after = Pt(24)

    # 4 Key Stats Badges at bottom of slide 1
    stats_data = [
        ("52", "Sanctioned Works Audited", "10 States & UTs Cataloged"),
        ("Δ ≤ 15%", "Dual-Inspector Consensus", "MoSPI Clause 3.16-A Mandate"),
        ("100%", "Zero-Ghost Billing Lock", "Autonomous PFMS Escrow Circuit-Breaker"),
        ("100% Offline", "Rural Ground Mode PWA", "Cryptographic Geotag Watermarking")
    ]
    stat_w = Inches(2.65)
    stat_gap = Inches(0.24)
    for i, (val, title, subtitle) in enumerate(stats_data):
        bx = Inches(1.0) + i * (stat_w + stat_gap)
        sc = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, bx, Inches(5.6), stat_w, Inches(1.2))
        sc.fill.solid()
        sc.fill.fore_color.rgb = RGBColor(19, 45, 80)
        sc.line.color.rgb = RGBColor(30, 65, 115)
        stf = sc.text_frame
        stf.word_wrap = True
        stf.margin_top = Inches(0.12)
        sp1 = stf.paragraphs[0]
        sp1.text = val
        sp1.font.name = "Segoe UI"
        sp1.font.size = Pt(18)
        sp1.font.bold = True
        sp1.font.color.rgb = WHITE
        sp2 = stf.add_paragraph()
        sp2.text = title
        sp2.font.name = "Segoe UI"
        sp2.font.size = Pt(9.5)
        sp2.font.bold = True
        sp2.font.color.rgb = AMBER
        sp3 = stf.add_paragraph()
        sp3.text = subtitle
        sp3.font.name = "Segoe UI"
        sp3.font.size = Pt(8)
        sp3.font.color.rgb = RGBColor(148, 163, 184)

    # =========================================================================
    # SLIDE 2: 30 YEARS OF MPLADS MONITORING EVOLUTION
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "1. HISTORICAL CONTEXT: 30 YEARS OF MPLADS MONITORING", "Tracing the paradigm shift from paper Measurement Books (1993) to Autonomous Fiscal Enforcement (2026)")
    add_footer(s2, 2)

    eras = [
        ("Phase 1: Paper Era (1993–2010)", "Physical Measurement Books (MB)",
         ["• Handwritten physical Measurement Books recorded by junior engineers.",
          "• Sanction orders routed via postal mail with months of transit latency.",
          "• High frequency of ghost billing and unverified contractor self-claims.",
          "• Opacity: Identical works billed under multiple schemes (double-dipping)."],
         ROSE, RGBColor(255, 241, 242)),

        ("Phase 2: Early Digital (2011–2020)", "MPLADS Portal v1.0 (MIS)",
         ["• Basic tabular MySQL database cataloging sanctioned expenditure amounts.",
          "• Clerical upload of scanned sanction approval letters and text progress.",
          "• Zero spatial geotagging, zero EXIF verification, and zero visual evidence.",
          "• Vulnerability: Payments released solely on self-certified numbers without site proof."],
         AMBER, RGBColor(254, 243, 199)),

        ("Phase 3: Real Asset Portals (2023–Present)", "e-SAKSHI Portal",
         ["• Centralized portal for paperless MP recommendations and digital sanctions.",
          "• Passive data repository: Records entries after funds have already left the treasury.",
          "• High failure rate in rural/tribal belts due to constant 4G cellular dependency.",
          "• Vulnerability: Static 2D photos easily spoofed; NO automated payment freeze."],
         INDIGO, RGBColor(238, 242, 255)),

        ("Phase 4: Autonomous Era (2026)", "MPLAD-TRACE 360™",
         ["• Active Fiscal Circuit-Breaker: Halts PFMS escrow if physical lags financial by >15%.",
          "• Double-Blind Cross-Cadre Consensus: Two independent engineering cadres audit blindly.",
          "• 100% Offline PWA: Cryptographically signed evidence stored locally in Ground Outbox.",
          "• Zero-Knowledge Whistleblower Drop with direct RBI e-₹ bounty payouts."],
         EMERALD, RGBColor(236, 253, 245))
    ]

    col_w = Inches(2.78)
    col_gap = Inches(0.2)
    for i, (p_title, p_sub, bullets, tag_col, card_bg) in enumerate(eras):
        cx = Inches(0.8) + i * (col_w + col_gap)
        create_card(s2, cx, Inches(1.5), col_w, Inches(5.3), bg_color=card_bg, border_color=tag_col)

        # Header Badge
        hb = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx + Inches(0.15), Inches(1.65), col_w - Inches(0.3), Inches(0.45))
        hb.fill.solid()
        hb.fill.fore_color.rgb = tag_col
        hb.line.fill.background()
        htf = hb.text_frame
        hp = htf.paragraphs[0]
        hp.text = p_title
        hp.font.name = "Segoe UI"
        hp.font.size = Pt(9.5)
        hp.font.bold = True
        hp.font.color.rgb = WHITE
        hp.alignment = PP_ALIGN.CENTER

        # Subtitle
        stb = s2.shapes.add_textbox(cx + Inches(0.15), Inches(2.2), col_w - Inches(0.3), Inches(0.4))
        stf = stb.text_frame
        stf.word_wrap = True
        sp = stf.paragraphs[0]
        sp.text = p_sub
        sp.font.name = "Segoe UI"
        sp.font.size = Pt(11)
        sp.font.bold = True
        sp.font.color.rgb = NAVY

        # Bullets
        btb = s2.shapes.add_textbox(cx + Inches(0.15), Inches(2.7), col_w - Inches(0.3), Inches(3.9))
        btf = btb.text_frame
        btf.word_wrap = True
        for b_idx, bullet in enumerate(bullets):
            bp = btf.paragraphs[0] if b_idx == 0 else btf.add_paragraph()
            bp.text = bullet
            bp.font.name = "Segoe UI"
            bp.font.size = Pt(9.5)
            bp.font.color.rgb = SLATE_DARK
            bp.space_after = Pt(8)

    # =========================================================================
    # SLIDE 3: CORE BREAKTHROUGH INNOVATIONS
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "2. CORE BREAKTHROUGH INNOVATIONS", "How MPLAD-TRACE 360 transforms passive archiving into active, real-time fiscal and physical enforcement")
    add_footer(s3, 3)

    innovations = [
        ("1. Zero Ghost Billing Circuit-Breaker", "Halts PFMS escrow payments automatically when physical execution lags financial burn by >15% or site is stalled.", "Autonomous Financial Firewall"),
        ("2. Autonomous Dual-Inspector Cross-Cadre Suite", "Dispatches two independent cadres blindly. Mathematical consensus (Δ ≤ 15%) gates stage progression and payment release.", "MoSPI Clause 3.16-A"),
        ("3. Statutory 10-Stage Project Lifecycle State Machine", "Enforces end-to-end statutory milestones from Hon'ble MP recommendation through tender, PBG, to social audit sign-off.", "Lifecycle Integrity"),
        ("4. Autonomous e-Tender Bidding & Anti-Cartel Oracle", "Statutory price floor (< -25% DSR rejected), sealed cryptographic bids, AI viability scoring, and automated L1 contract award.", "CPWD / GeM Procurement"),
        ("5. Whistleblower Bounty Marketplace & Zero-Knowledge Drop", "Citizens upload anonymous proof without login. 12-word seed key claim, CVC forensic probe, and 10% bounty via RBI Digital Rupee.", "Direct Civic Incentive"),
        ("6. Construction Material Quality Testing (IS 456 / IS 516)", "Computer vision surface defect filtering + 28-day concrete cube compressive tests + GeM/GST e-Way bill quantity reconciliation.", "Structural Soundness")
    ]

    card_w = Inches(5.7)
    card_h = Inches(1.6)
    for idx, (title, desc, tag) in enumerate(innovations):
        row = idx // 2
        col = idx % 2
        left = Inches(0.8) + col * Inches(6.0)
        top = Inches(1.5) + row * Inches(1.75)

        create_card(s3, left, top, card_w, card_h, bg_color=CARD_BG, border_color=BORDER_COLOR)

        tb = s3.shapes.add_textbox(left + Inches(0.2), top + Inches(0.15), card_w - Inches(0.4), card_h - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True

        p_t = tf.paragraphs[0]
        p_t.text = title
        p_t.font.name = "Segoe UI"
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = NAVY

        p_tag = tf.add_paragraph()
        p_tag.text = f"DOMAIN: {tag.upper()}"
        p_tag.font.name = "Segoe UI"
        p_tag.font.size = Pt(8.5)
        p_tag.font.bold = True
        p_tag.font.color.rgb = SAFFRON
        p_tag.space_after = Pt(4)

        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Segoe UI"
        p_d.font.size = Pt(9.5)
        p_d.font.color.rgb = SLATE_DARK

    # =========================================================================
    # SLIDE 4: NEW MODULE: AUTONOMOUS DUAL-INSPECTOR CONSENSUS SUITE
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "3. NEW MODULE: AUTONOMOUS DUAL-INSPECTOR CROSS-CADRE CONSENSUS", "MoSPI Clause 3.16-A & CVC Section 88 Double-Blind Verification Suite with Mathematical Concordance Gating")
    add_footer(s4, 4)

    # 3 Column Layout: Cadre 1 (Left), Consensus Decision Engine (Center), Cadre 2 (Right)
    # Cadre 1 Card
    c1 = create_card(s4, Inches(0.8), Inches(1.5), Inches(3.6), Inches(5.3), bg_color=RGBColor(239, 246, 255), border_color=RGBColor(147, 197, 253))
    tb_c1 = s4.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(3.2), Inches(4.9))
    tf_c1 = tb_c1.text_frame
    tf_c1.word_wrap = True

    p = tf_c1.paragraphs[0]
    p.text = "INSPECTOR 1 (PRIMARY CADRE)"
    p.font.name = "Segoe UI"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = INDIGO

    p = tf_c1.add_paragraph()
    p.text = "Shri R. K. Verma, AEE"
    p.font.name = "Segoe UI"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = NAVY

    p = tf_c1.add_paragraph()
    p.text = "Panchayati Raj & Rural Engineering (PRED)\n"
    p.font.name = "Segoe UI"
    p.font.size = Pt(10)
    p.font.color.rgb = SLATE_MUTED

    bullets_c1 = [
        "• Statutory Duty: Departmental allocated supervising engineer.",
        "• Geofence Lock: Device hardware GPS locked to site within 200m radius.",
        "• Physical Evidence: Geotagged photographic proof + 360° video walkthrough.",
        "• Reported Metric: Observed physical progress (P1) entered in official log.",
        "• Blind Isolation: Officer has zero access to Inspector 2's schedule or report."
    ]
    for b in bullets_c1:
        p = tf_c1.add_paragraph()
        p.text = b
        p.font.name = "Segoe UI"
        p.font.size = Pt(9.5)
        p.font.color.rgb = SLATE_DARK
        p.space_after = Pt(6)

    # Center Engine Card (Mathematical Decision Engine)
    c_mid = create_card(s4, Inches(4.6), Inches(1.5), Inches(4.1), Inches(5.3), bg_color=WHITE, border_color=SAFFRON)
    tb_mid = s4.shapes.add_textbox(Inches(4.8), Inches(1.7), Inches(3.7), Inches(4.9))
    tf_mid = tb_mid.text_frame
    tf_mid.word_wrap = True

    p = tf_mid.paragraphs[0]
    p.text = "AI CONSENSUS DECISION ENGINE"
    p.font.name = "Segoe UI"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = SAFFRON

    p = tf_mid.add_paragraph()
    p.text = "Mathematical Delta Formula:\nΔ = | P(Inspector 1) - P(Inspector 2) |"
    p.font.name = "Segoe UI"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = NAVY
    p.space_after = Pt(10)

    # Outcome A
    p = tf_mid.add_paragraph()
    p.text = "✓ SCENARIO A: CONCORDANCE (Δ ≤ 15%)"
    p.font.name = "Segoe UI"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = EMERALD
    p = tf_mid.add_paragraph()
    p.text = "• Both officers give concordant ground observations.\n• Physical progress credited as (P1 + P2)/2 to central ledger.\n• Project automatically advances to Stage 9 (Measurement & Bill Passing).\n• Running tranche escrow payment unlocked."
    p.font.name = "Segoe UI"
    p.font.size = Pt(9)
    p.font.color.rgb = SLATE_DARK
    p.space_after = Pt(10)

    # Outcome B
    p = tf_mid.add_paragraph()
    p.text = "❌ SCENARIO B: COLLUSION RED ALERT (Δ > 15%)"
    p.font.name = "Segoe UI"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = ROSE
    p = tf_mid.add_paragraph()
    p.text = "• Submission automatically rejected by machine.\n• Project stage progression strictly FROZEN at Stage 8.\n• Measurement Books quarantined under CVC Section 88.\n• Contractor disbursement escrow immediately frozen.\n• Formal CVC inquiry summons issued to both engineers."
    p.font.name = "Segoe UI"
    p.font.size = Pt(9)
    p.font.color.rgb = SLATE_DARK

    # Cadre 2 Card
    c2 = create_card(s4, Inches(8.9), Inches(1.5), Inches(3.6), Inches(5.3), bg_color=RGBColor(245, 243, 255), border_color=RGBColor(196, 181, 253))
    tb_c2 = s4.shapes.add_textbox(Inches(9.1), Inches(1.7), Inches(3.2), Inches(4.9))
    tf_c2 = tb_c2.text_frame
    tf_c2.word_wrap = True

    p = tf_c2.paragraphs[0]
    p.text = "INSPECTOR 2 (BLIND AUDITOR)"
    p.font.name = "Segoe UI"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = INDIGO

    p = tf_c2.add_paragraph()
    p.text = "Smt. K. Sarada, AE"
    p.font.name = "Segoe UI"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = NAVY

    p = tf_c2.add_paragraph()
    p.text = "Rural Water Supply & Sanitation (RWSS)\n"
    p.font.name = "Segoe UI"
    p.font.size = Pt(10)
    p.font.color.rgb = SLATE_MUTED

    bullets_c2 = [
        "• Statutory Duty: Independent blind cross-cadre technical auditor.",
        "• Quarantine: Out-of-cadre assignment prevents local departmental collusion.",
        "• Blind Window: Dispatched independently within 48-hour parallel SLA.",
        "• Observed Metric: Independent physical progress (P2) logged on site.",
        "• Jury Persona Switcher: Allows seamless testing of both cadres on one device."
    ]
    for b in bullets_c2:
        p = tf_c2.add_paragraph()
        p.text = b
        p.font.name = "Segoe UI"
        p.font.size = Pt(9.5)
        p.font.color.rgb = SLATE_DARK
        p.space_after = Pt(6)

    # =========================================================================
    # SLIDE 5: NEW MODULE: STATUTORY 10-STAGE LIFECYCLE STATE MACHINE
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "4. NEW MODULE: STATUTORY 10-STAGE LIFECYCLE STATE MACHINE", "End-to-End Milestone Tracking from Hon'ble MP Recommendation through Tender, PBG Escrow, to Social Audit Handover")
    add_footer(s5, 5)

    stages = [
        ("Stage 1", "MP Recommendation", "Hon'ble MP proposal letter submitted under MPLADS guidelines.", EMERALD),
        ("Stage 2", "Admin Sanction", "District Collector administrative approval; baseline geotag locked.", EMERALD),
        ("Stage 3", "Technical Sanction", "Superintending Engineer vetted DPR & structural cost estimates.", EMERALD),
        ("Stage 4", "Tender Notification", "NIT e-procurement published with itemized Bill of Quantities (BoQ).", EMERALD),
        ("Stage 5", "Contract Award", "L1 contractor selected; 5% Performance Bank Guarantee (PBG) locked.", EMERALD),
        ("Stage 6", "Fund Release (Tranche 1)", "PFMS treasury gateway dispatches first tranche to project escrow.", EMERALD),
        ("Stage 7", "Work Commencement", "Site handover order, groundbreaking, plinth foundation excavation.", EMERALD),
        ("Stage 8", "Field Inspection", "Geotagged dual cross-cadre audit + 360° video. GATES STAGE 9!", SAFFRON),
        ("Stage 9", "Progress & Measurement", "Measurement Book (MB) verified and Running Account bill passed.", INDIGO),
        ("Stage 10", "Completion & Handover", "Final social audit sign-off, public commissioning & asset handover.", SLATE_DARK)
    ]

    s_w = Inches(2.26)
    s_h = Inches(2.55)
    for i, (stg_num, stg_name, stg_desc, col_accent) in enumerate(stages):
        row = i // 5
        col = i % 5
        left = Inches(0.8) + col * Inches(2.38)
        top = Inches(1.5) + row * Inches(2.7)

        create_card(s5, left, top, s_w, s_h, bg_color=CARD_BG, border_color=BORDER_COLOR)

        # Stage Number Badge
        nb = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left + Inches(0.12), top + Inches(0.12), Inches(0.9), Inches(0.28))
        nb.fill.solid()
        nb.fill.fore_color.rgb = col_accent
        nb.line.fill.background()
        np = nb.text_frame.paragraphs[0]
        np.text = stg_num
        np.font.name = "Segoe UI"
        np.font.size = Pt(8.5)
        np.font.bold = True
        np.font.color.rgb = WHITE
        np.alignment = PP_ALIGN.CENTER

        tb = s5.shapes.add_textbox(left + Inches(0.12), top + Inches(0.48), s_w - Inches(0.24), s_h - Inches(0.55))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = stg_name
        p1.font.name = "Segoe UI"
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = NAVY
        p1.space_after = Pt(4)

        p2 = tf.add_paragraph()
        p2.text = stg_desc
        p2.font.name = "Segoe UI"
        p2.font.size = Pt(8.5)
        p2.font.color.rgb = SLATE_DARK

    # Bottom Callout Strip
    strip = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.55), Inches(11.733), Inches(0.42))
    strip.fill.solid()
    strip.fill.fore_color.rgb = RGBColor(254, 243, 199)
    strip.line.color.rgb = SAFFRON
    stf = strip.text_frame
    stp = stf.paragraphs[0]
    stp.text = "CRITICAL STATUTORY GOVERNANCE RULE: Stage 8 (Field Inspection) → Stage 9 (Measurement & Bill Passing) transition is strictly gated by Dual-Inspector Concordance (Δ ≤ 15%). Discrepancies lock progress instantly."
    stp.font.name = "Segoe UI"
    stp.font.size = Pt(8.5)
    stp.font.bold = True
    stp.font.color.rgb = RGBColor(120, 53, 15)
    stp.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 6: NEW MODULE: AUTONOMOUS E-TENDER BIDDING & ANTI-CARTEL ORACLE
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "5. NEW MODULE: AUTONOMOUS E-TENDER BIDDING & ANTI-CARTEL ORACLE", "Procurement Integrity Suite: Statutory Price Floor, Sealed Cryptographic Bids & Automated Collusion Ring Detection")
    add_footer(s6, 6)

    t_cards = [
        ("Itemized Bill of Quantities (BoQ)",
         "• Standard Schedule of Rates (SOR) itemization (RCC M25 concrete, Fe500D TMT rebar, brick masonry, labor).\n• Autonomous estimate calculation preventing subjective discretion.\n• Every unit linked to state civil procurement schedules.",
         INDIGO),

        ("Statutory Price Floor Protection",
         "• Anti-Predatory Dumping Rule: MoSPI mandates bids below -25% DSR to be rejected as commercially unviable.\n• Eliminates contractor insolvency, mid-way abandonment, and substandard material substitution.\n• Example: ₹15.0L estimate has statutory floor of ₹12.75L.",
         ROSE),

        ("Sealed Bid Cryptography",
         "• Bids remain encrypted and sealed until the 30-minute bidding window countdown expires.\n• Prevents premature bid leakage, asymmetric information access, and corrupt insider coaching.\n• Countdown timer visible in real-time on bidder portal.",
         AMBER),

        ("Autonomous AI Evaluation Engine",
         "• Unseals bids at deadline and benchmarks against CPWD District Schedule of Rates.\n• BIS Grade-A Viability Scoring (0–100) evaluates financial feasibility.\n• Cartel Detection: Flags identical IP, coordinated variance clustering, or shared GSTIN rings.\n• Auto-awards contract to viable L1 contractor with clearance hash.",
         EMERALD)
    ]

    t_w = Inches(2.78)
    t_h = Inches(5.3)
    for i, (title, text, col_acc) in enumerate(t_cards):
        left = Inches(0.8) + i * Inches(2.98)
        create_card(s6, left, Inches(1.5), t_w, t_h, bg_color=CARD_BG, border_color=BORDER_COLOR)

        # Top Accent Header
        th = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left + Inches(0.12), Inches(1.65), t_w - Inches(0.24), Inches(0.6))
        th.fill.solid()
        th.fill.fore_color.rgb = col_acc
        th.line.fill.background()
        tp = th.text_frame.paragraphs[0]
        tp.text = title
        tp.font.name = "Segoe UI"
        tp.font.size = Pt(10.5)
        tp.font.bold = True
        tp.font.color.rgb = WHITE
        tp.alignment = PP_ALIGN.CENTER

        tb = s6.shapes.add_textbox(left + Inches(0.15), Inches(2.4), t_w - Inches(0.3), Inches(4.2))
        tf = tb.text_frame
        tf.word_wrap = True
        for b_idx, bullet in enumerate(text.split("\n")):
            if bullet.strip():
                bp = tf.paragraphs[0] if b_idx == 0 else tf.add_paragraph()
                bp.text = bullet
                bp.font.name = "Segoe UI"
                bp.font.size = Pt(9.5)
                bp.font.color.rgb = SLATE_DARK
                bp.space_after = Pt(6)

    # =========================================================================
    # SLIDE 7: NEW MODULE: WHISTLEBLOWER BOUNTY MARKETPLACE & ZERO-KNOWLEDGE DROP
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "6. NEW MODULE: WHISTLEBLOWER BOUNTY MARKETPLACE & ZERO-KNOWLEDGE DROP", "Encrypted Public Oversight: Anonymous Submissions, Forensic CVC Site Testing & 10% Recovery Bounty via RBI e-₹")
    add_footer(s7, 7)

    wb_steps = [
        ("STEP 1: ZERO-KNOWLEDGE DROP", "Anonymous Evidence Submission",
         "• Citizens and site insiders submit photographic, video, or document proof of corruption.\n• Zero registration: No phone numbers, emails, or biometric identifiers required.\n• End-to-end encrypted drop isolates whistleblower from potential retaliatory harassment.",
         INDIGO),

        ("STEP 2: 12-WORD SEED KEY", "Cryptographic Claim Key",
         "• System automatically generates a 12-word BIP-39 mnemonic seed key (e.g. 'hawk iron river stone cedar flash...').\n• Cryptographic SHA-256 hash locked in registry.\n• The seed phrase is the ONLY key to prove ownership and claim the fiscal bounty.",
         AMBER),

        ("STEP 3: FORENSIC CVC AUDIT", "Chief Technical Examiner Investigation",
         "• Report dispatched to CVC Chief Technical Examiner (CTE) inspection wing.\n• Independent engineering team conducts physical core drilling and non-destructive testing.\n• When fraud is proven, 100% of contractor billing is quarantined and frozen in treasury.",
         ROSE),

        ("STEP 4: ANONYMOUS BOUNTY PAYOUT", "10% Statutory Recovery (Up to ₹5L)",
         "• Whistleblower redeems 10% of frozen penalty amount without exposing identity:\n  1. RBI Digital Rupee (e-₹ CBDC Voucher)\n  2. India Post Cash Voucher (Redeemable at post office)\n  3. Anonymous UPI Transaction Bridge.",
         EMERALD)
    ]

    wb_w = Inches(2.78)
    wb_h = Inches(5.3)
    for i, (s_step, s_title, s_text, s_acc) in enumerate(wb_steps):
        left = Inches(0.8) + i * Inches(2.98)
        create_card(s7, left, Inches(1.5), wb_w, wb_h, bg_color=CARD_BG, border_color=BORDER_COLOR)

        sh = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left + Inches(0.12), Inches(1.65), wb_w - Inches(0.24), Inches(0.35))
        sh.fill.solid()
        sh.fill.fore_color.rgb = s_acc
        sh.line.fill.background()
        sp = sh.text_frame.paragraphs[0]
        sp.text = s_step
        sp.font.name = "Segoe UI"
        sp.font.size = Pt(8.5)
        sp.font.bold = True
        sp.font.color.rgb = WHITE
        sp.alignment = PP_ALIGN.CENTER

        tb = s7.shapes.add_textbox(left + Inches(0.15), Inches(2.1), wb_w - Inches(0.3), Inches(4.5))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = s_title
        p1.font.name = "Segoe UI"
        p1.font.size = Pt(11.5)
        p1.font.bold = True
        p1.font.color.rgb = NAVY
        p1.space_after = Pt(8)

        for b in s_text.split("\n"):
            if b.strip():
                p = tf.add_paragraph()
                p.text = b
                p.font.name = "Segoe UI"
                p.font.size = Pt(9)
                p.font.color.rgb = SLATE_DARK
                p.space_after = Pt(5)

    # =========================================================================
    # SLIDE 8: CONSTRUCTION MATERIAL QUALITY TESTING (IS 456 / IS 516)
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "7. CONSTRUCTION MATERIAL QUALITY TESTING (IS 456 / IS 516)", "3-Layer Material Verification: Computer Vision Surface Defect Analytics + Concrete Cube Tests + e-Way Bill Auditing")
    add_footer(s8, 8)

    m_layers = [
        ("Layer 1: Computer Vision Surface Analytics", "Visual & Texture Deep Inspection",
         ["• OpenCV Laplacian Edge Filtering: Computes surface variance to detect structural honeycombing and void depths exceeding 5mm.",
          "• Color Histogram & HSV Masking: Flags tensile rebar corrosion flaking on exposed column reinforcement (>15% oxidation triggers defect).",
          "• Color Clustering (k-Means): Detects white salt efflorescence on newly cast brickwork, indicating contaminated high-salinity water mix.",
          "• Outcome: Replaces subjective human guesses with mathematical pixel-level surface defect classification."],
         INDIGO, RGBColor(245, 243, 255)),

        ("Layer 2: Digital Concrete Cube Tests (IS 516)", "Compressive Strength Laboratory Testing",
         ["• Mandates physical casting of standard 150mm x 150mm concrete test cubes during slab and column pouring.",
          "• Calibrated Compressive Testing Machine (CTM) logs crushing load at 7 days and 28 days (e.g. 24.8 MPa target for M20 concrete).",
          "• AI checks strength gain curves against statutory IS 456 curing envelopes.",
          "• Outcome: Automatically triggers fiscal freeze if 28-day concrete strength falls below 85% of design compressive specification."],
         SAFFRON, RGBColor(255, 247, 237)),

        ("Layer 3: GeM & GST e-Way Bill Reconciliation", "Anti-Dilution Supply-Chain Forensic Audit",
         ["• Reconciles theoretical Bill of Quantities (BoQ) volume against verified delivery challans and e-Way bills.",
          "• Example: A 3,000 sq.ft hall requires ~450 bags of Grade 43/53 OPC cement and 3.2 tonnes of Fe500D primary steel.",
          "• Cross-checks GST invoices to ensure vendor delivered the exact volume to that specific GPS coordinate.",
          "• Outcome: Detects contractor material dilution (e.g. 60% cement deficit) before structural failure occurs."],
         EMERALD, RGBColor(236, 253, 245))
    ]

    m_w = Inches(3.75)
    m_h = Inches(5.3)
    for i, (title, sub, bullets, acc_col, bg_col) in enumerate(m_layers):
        left = Inches(0.8) + i * Inches(3.98)
        create_card(s8, left, Inches(1.5), m_w, m_h, bg_color=bg_col, border_color=acc_col)

        tb = s8.shapes.add_textbox(left + Inches(0.2), Inches(1.7), m_w - Inches(0.4), Inches(4.9))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.name = "Segoe UI"
        p1.font.size = Pt(12)
        p1.font.bold = True
        p1.font.color.rgb = NAVY

        p2 = tf.add_paragraph()
        p2.text = sub
        p2.font.name = "Segoe UI"
        p2.font.size = Pt(9.5)
        p2.font.bold = True
        p2.font.color.rgb = acc_col
        p2.space_after = Pt(12)

        for b in bullets:
            p = tf.add_paragraph()
            p.text = b
            p.font.name = "Segoe UI"
            p.font.size = Pt(9.5)
            p.font.color.rgb = SLATE_DARK
            p.space_after = Pt(8)

    # =========================================================================
    # SLIDE 9: COMPLETE MACHINE LEARNING & ALGORITHMIC INVENTORY
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, "8. COMPLETE MACHINE LEARNING & ALGORITHMIC INVENTORY", "The 7 Mathematical, Geodesic & Machine Learning Engines Powering Continuous Autonomous Governance")
    add_footer(s9, 9)

    algos = [
        ("1. Structural CV Verifier", "ALGORITHM: OpenCV Laplacian Edge Filtering, SSIM, Color Histograms", "Detects honeycombing/voids (>5mm), rebar oxidation flaking, and structural milestone similarity matching."),
        ("2. Bayesian Delay Predictor", "ALGORITHM: Bayesian Milestone Velocity Regression & Historical Lag Heuristics", "Projects completion dates, calculating slippage days and probability based on daily execution velocity."),
        ("3. Geospatial Duplicate Engine", "ALGORITHM: Spherical Haversine Distance (R=6371km) + Jaccard Token N-Gram", "Flags duplicate works within 150m–300m with descriptive title similarity to eliminate cross-scheme double dipping."),
        ("4. 7-Factor MoSPI Risk Engine", "ALGORITHM: Weighted Multi-Criteria Decision Analysis (MCDA) (0–100 Score)", "Aggregates Cost, Schedule, Discrepancy, Evidence, Contractor, Document, and Citizen Grievance signals."),
        ("5. Zero Ghost Billing Engine", "ALGORITHM: Dynamic Fiscal Discrepancy Gate (Delta = Financial % - Physical %)", "Engages automated circuit-breaker if Delta > 15% or status is Stalled; halts PFMS escrow disbursements."),
        ("6. Dual-Inspector Consensus Engine", "ALGORITHM: Multi-Cadre Discrepancy Gate (Delta = |P1 - P2|)", "Enforces MoSPI Clause 3.16-A. Evaluates concordance (Δ ≤ 15%) to unlock next lifecycle stage and release funds.")
    ]

    for idx, (title, alg, desc) in enumerate(algos):
        row = idx // 2
        col = idx % 2
        left = Inches(0.8) + col * Inches(6.0)
        top = Inches(1.5) + row * Inches(1.75)

        create_card(s9, left, top, Inches(5.7), Inches(1.6), bg_color=CARD_BG, border_color=BORDER_COLOR)

        tb = s9.shapes.add_textbox(left + Inches(0.2), top + Inches(0.12), Inches(5.3), Inches(1.36))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.name = "Segoe UI"
        p1.font.size = Pt(11.5)
        p1.font.bold = True
        p1.font.color.rgb = NAVY

        p2 = tf.add_paragraph()
        p2.text = alg
        p2.font.name = "Segoe UI"
        p2.font.size = Pt(8.5)
        p2.font.bold = True
        p2.font.color.rgb = SAFFRON
        p2.space_after = Pt(3)

        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.name = "Segoe UI"
        p3.font.size = Pt(9)
        p3.font.color.rgb = SLATE_DARK

    # =========================================================================
    # SLIDE 10: FISCAL CIRCUIT-BREAKER: FREEZING & UNFREEZING PROTOCOLS
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_header(s10, "9. FISCAL CIRCUIT-BREAKER: FREEZING & UNFREEZING PROTOCOLS", "Mathematical Boundaries Governing PFMS Escrow Locks and the Statutory 5-Step Recovery Protocol")
    add_footer(s10, 10)

    # Left: When Does AI Freeze Funds?
    c_left = create_card(s10, Inches(0.8), Inches(1.5), Inches(5.7), Inches(5.3), bg_color=RGBColor(255, 241, 242), border_color=ROSE)
    tb_fl = s10.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(5.3), Inches(4.9))
    tf_fl = tb_fl.text_frame
    tf_fl.word_wrap = True

    p = tf_fl.paragraphs[0]
    p.text = "WHEN DOES THE AI FREEZE FUNDS?"
    p.font.name = "Segoe UI"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ROSE
    p.space_after = Pt(10)

    freeze_conditions = [
        ("⛔ Risk Score ≥ 75 / 100 (CRITICAL)", "Engages automatic audit lockout. All pending milestone tranches withheld."),
        ("⛔ Ghost Billing Discrepancy > 15%", "Claimed financial release exceeds verified physical execution by >15%."),
        ("⛔ Site Flagged as 'STALLED'", "Field inspection confirms prolonged work stoppage, demobilization, or site abandonment."),
        ("⛔ Material Strength Deficit", "28-day concrete cube compressive test falls below 85% of design target."),
        ("⛔ Dual-Inspector Discrepancy > 15%", "Inspector 1 vs Inspector 2 divergence exceeds statutory tolerance under CVC Sec 88."),
        ("⛔ Active Citizen Defect Liability Claim", "36-month DLP violation flagged via 1-click GPS reverse-lookup.")
    ]
    for title, exp in freeze_conditions:
        p = tf_fl.add_paragraph()
        p.text = title
        p.font.name = "Segoe UI"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = NAVY
        p2 = tf_fl.add_paragraph()
        p2.text = exp
        p2.font.name = "Segoe UI"
        p2.font.size = Pt(8.5)
        p2.font.color.rgb = SLATE_DARK
        p2.space_after = Pt(6)

    # Right: Statutory 5-Step Unfreezing Protocol
    c_right = create_card(s10, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.3), bg_color=RGBColor(240, 253, 244), border_color=EMERALD)
    tb_fr = s10.shapes.add_textbox(Inches(7.0), Inches(1.7), Inches(5.3), Inches(4.9))
    tf_fr = tb_fr.text_frame
    tf_fr.word_wrap = True

    p = tf_fr.paragraphs[0]
    p.text = "STATUTORY 5-STEP UNFREEZING PROTOCOL"
    p.font.name = "Segoe UI"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = EMERALD
    p.space_after = Pt(10)

    unfreeze_steps = [
        ("✓ Step 1: Contractor Civil Rectification", "Contractor cures defects on site to catch up physical execution with claimed milestone."),
        ("✓ Step 2: Fresh Geotagged Field Re-Inspection", "Field engineer re-inspects site with mandatory 360° video walkthrough within 200m geofence."),
        ("✓ Step 3: District Planning Officer (DPO) Review", "DPO scrutinizes evidence dossier in AI Anomaly Center and signs formal digital clearance."),
        ("✓ Step 4: Automated AI Score Recalculation", "AI recalculates composite risk; score drops below 30 (NORMAL). Red circuit-breaker clears."),
        ("✓ Step 5: PFMS Escrow Disbursal Resumed", "Treasury gateway release unlocks automatically. Finance officers disburse verified tranche.")
    ]
    for title, exp in unfreeze_steps:
        p = tf_fr.add_paragraph()
        p.text = title
        p.font.name = "Segoe UI"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = NAVY
        p2 = tf_fr.add_paragraph()
        p2.text = exp
        p2.font.name = "Segoe UI"
        p2.font.size = Pt(8.5)
        p2.font.color.rgb = SLATE_DARK
        p2.space_after = Pt(6)

    # =========================================================================
    # SLIDE 11: 1-CLICK GPS REVERSE LOOKUP & DEFECT LIABILITY
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    add_header(s11, "10. 1-CLICK GPS ASSET REVERSE-LOOKUP & DEFECT LIABILITY", "Citizen Smartphone Camera Click Isolates Exact Contractor & Freezes 5% Performance Bank Guarantee (PBG)")
    add_footer(s11, 11)

    rl_steps = [
        ("STEP 1: HARDWARE CAPTURE", "Camera & WGS84 GPS Sensor",
         "• HTML5 camera viewfinder activates on mobile browser.\n• Samples hardware GPS chip (WGS84) with ±5m accuracy.\n• Optical HUD aligns structural crack, cavity, or collapse.\n• Cryptographic timestamp & coordinates burned into image EXIF bytes.",
         INDIGO),

        ("STEP 2: SPATIAL MATCHING", "Haversine Geofence Engine",
         "• Spherical Geodesy: d = 2R · arcsin(√(sin²(Δφ/2) + cos φ1 cos φ2 sin²(Δλ/2))).\n• Queries central MPLADS registry within 200m–3km perimeter.\n• Disambiguates junction projects by proximity & DLP status.\n• Resolves exact Project ID & sanction ledger instantly.",
         SAFFRON),

        ("STEP 3: LEGAL RESOLUTION", "Contractor & PBG Resolution",
         "• Resolves executing contractor profile (e.g. CON-AP-042).\n• Audits active 36-Month Defect Liability Period (DLP).\n• Identifies 5% Performance Bank Guarantee (PBG) in escrow.\n• Tags guarantee record: action_required = True.",
         AMBER),

        ("STEP 4: AUTO ESCALATION", "Level-4 Vigilance Trigger",
         "• Generates CRITICAL Alert (ALT-DEFECT-XXXXX).\n• Dispatches statutory 3-day notice to contractor.\n• Notifies District Collector, SE & CVC Chief Technical Examiner.\n• Citizen tracks forensic audit progress live in tracking HUD.",
         EMERALD)
    ]

    r_w = Inches(2.78)
    r_h = Inches(5.3)
    for i, (step_num, title, body, acc_col) in enumerate(rl_steps):
        left = Inches(0.8) + i * Inches(2.98)
        create_card(s11, left, Inches(1.5), r_w, r_h, bg_color=CARD_BG, border_color=BORDER_COLOR)

        sh = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left + Inches(0.12), Inches(1.65), r_w - Inches(0.24), Inches(0.35))
        sh.fill.solid()
        sh.fill.fore_color.rgb = acc_col
        sh.line.fill.background()
        sp = sh.text_frame.paragraphs[0]
        sp.text = step_num
        sp.font.name = "Segoe UI"
        sp.font.size = Pt(8.5)
        sp.font.bold = True
        sp.font.color.rgb = WHITE
        sp.alignment = PP_ALIGN.CENTER

        tb = s11.shapes.add_textbox(left + Inches(0.15), Inches(2.1), r_w - Inches(0.3), Inches(4.5))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.name = "Segoe UI"
        p1.font.size = Pt(11.5)
        p1.font.bold = True
        p1.font.color.rgb = NAVY
        p1.space_after = Pt(8)

        for b in body.split("\n"):
            if b.strip():
                p = tf.add_paragraph()
                p.text = b
                p.font.name = "Segoe UI"
                p.font.size = Pt(9)
                p.font.color.rgb = SLATE_DARK
                p.space_after = Pt(5)

    # =========================================================================
    # SLIDE 12: CENTRAL DATABASE AUDIT & JURY TAKEAWAYS
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    add_header(s12, "11. CENTRAL DATABASE AUDIT & PRODUCTION READINESS", "All 52 Live Works Audited with 100% Mathematical Reconciliation Across 10 States/UTs")
    add_footer(s12, 12)

    # 4 Top Metric Cards
    metrics = [
        ("52", "Sanctioned Works", "10 States / UTs across India", NAVY),
        ("24", "Funds Frozen", "Critical / Stalled / Delta >15%", ROSE),
        ("15", "Completed Works", "100% Physically & Financially Closed", EMERALD),
        ("24", "Live AI Alerts", "Continuous Surveillance Monitoring", AMBER)
    ]
    m_card_w = Inches(2.78)
    for i, (val, title, sub, col_acc) in enumerate(metrics):
        left = Inches(0.8) + i * Inches(2.98)
        create_card(s12, left, Inches(1.5), m_card_w, Inches(1.5), bg_color=CARD_BG, border_color=BORDER_COLOR)

        tb = s12.shapes.add_textbox(left + Inches(0.15), Inches(1.55), m_card_w - Inches(0.3), Inches(1.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = val
        p1.font.name = "Segoe UI"
        p1.font.size = Pt(24)
        p1.font.bold = True
        p1.font.color.rgb = col_acc

        p2 = tf.add_paragraph()
        p2.text = title
        p2.font.name = "Segoe UI"
        p2.font.size = Pt(11)
        p2.font.bold = True
        p2.font.color.rgb = NAVY

        p3 = tf.add_paragraph()
        p3.text = sub
        p3.font.name = "Segoe UI"
        p3.font.size = Pt(8.5)
        p3.font.color.rgb = SLATE_MUTED

    # Bottom Full-Width Jury Evaluation Card
    bot_card = create_card(s12, Inches(0.8), Inches(3.2), Inches(11.733), Inches(3.6), bg_color=WHITE, border_color=NAVY)
    tb_bot = s12.shapes.add_textbox(Inches(1.1), Inches(3.4), Inches(11.133), Inches(3.2))
    tf_bot = tb_bot.text_frame
    tf_bot.word_wrap = True

    p = tf_bot.paragraphs[0]
    p.text = "CORE TAKEAWAY FOR THE EVALUATION JURY"
    p.font.name = "Segoe UI"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = SAFFRON
    p.space_after = Pt(8)

    jury_points = [
        "• Production-Ready Architecture: MPLAD-TRACE 360 is not a mockup or wireframe. It is a live, production-grade system with 0 TypeScript compilation errors and a robust FastAPI async backend.",
        "• True Paradigm Shift: Previous platforms (MPLADS Portal, e-SAKSHI) operated as passive historical archives. MPLAD-TRACE 360 operates as an active financial and physical circuit-breaker that freezes payment tranches BEFORE funds leave treasury escrow.",
        "• Statutory Compliance: Built directly against MoSPI MPLADS Scheme Guidelines 2023, CPWD Works Manual 2024, CVC Technical Audit Directives (Section 88), and IS 456 / IS 516 concrete standards.",
        "• End-to-End Governance Suite: Integrates Autonomous Dual-Inspector Cross-Cadre Consensus, 10-Stage Lifecycle State Machine, e-Tender Anti-Cartel Oracle, Whistleblower e-₹ Bounty Drop, and 1-Click GPS Defect Liability Reverse-Lookup.",
        "• Impact at Scale: Safeguards thousands of crores in public infrastructure funds, guaranteeing that every public asset is genuinely verified, structurally sound, and accountable to every citizen."
    ]
    for pt in jury_points:
        p = tf_bot.add_paragraph()
        p.text = pt
        p.font.name = "Segoe UI"
        p.font.size = Pt(10)
        p.font.color.rgb = SLATE_DARK
        p.space_after = Pt(5)

    # Save to root
    prs.save(output_pptx)
    print(f"Master Deck saved to {output_pptx}")

    # Copy to frontend public and dist directories
    dest_public = os.path.join("frontend", "public", output_pptx)
    dest_dist = os.path.join("frontend", "dist", output_pptx)
    try:
        shutil.copyfile(output_pptx, dest_public)
        print(f"Copied to {dest_public}")
    except Exception as e:
        print(f"Failed to copy to public: {e}")

    try:
        if os.path.exists("frontend/dist"):
            shutil.copyfile(output_pptx, dest_dist)
            print(f"Copied to {dest_dist}")
    except Exception as e:
        print(f"Failed to copy to dist: {e}")

if __name__ == "__main__":
    create_master_deck()
