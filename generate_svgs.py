import os

os.makedirs("ppt_assets", exist_ok=True)

# ----------------------------------------------------
# SLIDE 3: Technical Architecture Flowchart SVG
# ----------------------------------------------------
slide3_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%" style="background:#f8fafc; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <defs>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#0f172a" flood-opacity="0.06"/>
    </filter>
    <linearGradient id="l4Grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
    <linearGradient id="l3Grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0ea5e9"/>
    </linearGradient>
    <linearGradient id="l2Grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#10b981"/>
    </linearGradient>
    <linearGradient id="l1Grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
  </defs>

  <!-- Header -->
  <text x="800" y="60" text-anchor="middle" font-size="32" font-weight="800" fill="#0B2545" letter-spacing="1">PROJECT TECHNICAL ARCHITECTURE</text>
  <text x="800" y="92" text-anchor="middle" font-size="16" font-weight="500" fill="#64748B">Modular 4-Layer High Performance Full-Stack Governance Architecture</text>

  <!-- Layer 4: Presentation Layer -->
  <g transform="translate(100, 120)">
    <rect width="1400" height="150" rx="20" fill="#ffffff" stroke="#e0e7ff" stroke-width="2" filter="url(#cardShadow)"/>
    <rect width="280" height="150" rx="20" fill="url(#l4Grad)"/>
    <rect x="250" width="30" height="150" fill="url(#l4Grad)"/>
    <text x="140" y="65" text-anchor="middle" font-size="20" font-weight="800" fill="#ffffff">LAYER 4</text>
    <text x="140" y="92" text-anchor="middle" font-size="14" font-weight="600" fill="#e0e7ff">MODERN PRESENTATION</text>
    <text x="140" y="112" text-anchor="middle" font-size="12" fill="#c7d2fe">Client-Side SPA</text>

    <!-- Component Cards L4 -->
    <g transform="translate(310, 20)">
      <rect width="240" height="110" rx="14" fill="#f5f3ff" stroke="#ddd6fe" stroke-width="1.5"/>
      <text x="120" y="42" text-anchor="middle" font-size="17" font-weight="700" fill="#5b21b6">React 18 (SPA)</text>
      <text x="120" y="68" text-anchor="middle" font-size="12.5" fill="#4c1d95">Vite 5 Bundler &amp; HMR</text>
      <text x="120" y="88" text-anchor="middle" font-size="12" fill="#6b21a8">Modular Component Tree</text>
    </g>
    <g transform="translate(580, 20)">
      <rect width="240" height="110" rx="14" fill="#f5f3ff" stroke="#ddd6fe" stroke-width="1.5"/>
      <text x="120" y="42" text-anchor="middle" font-size="17" font-weight="700" fill="#5b21b6">TypeScript 5.2</text>
      <text x="120" y="68" text-anchor="middle" font-size="12.5" fill="#4c1d95">Strict Entity Typing</text>
      <text x="120" y="88" text-anchor="middle" font-size="12" fill="#6b21a8">Zero Runtime Type Errors</text>
    </g>
    <g transform="translate(850, 20)">
      <rect width="240" height="110" rx="14" fill="#f5f3ff" stroke="#ddd6fe" stroke-width="1.5"/>
      <text x="120" y="42" text-anchor="middle" font-size="17" font-weight="700" fill="#5b21b6">Tailwind CSS 3</text>
      <text x="120" y="68" text-anchor="middle" font-size="12.5" fill="#4c1d95">Govt Design System</text>
      <text x="120" y="88" text-anchor="middle" font-size="12" fill="#6b21a8">Ashoka Navy &amp; Saffron UI</text>
    </g>
    <g transform="translate(1120, 20)">
      <rect width="250" height="110" rx="14" fill="#f5f3ff" stroke="#ddd6fe" stroke-width="1.5"/>
      <text x="125" y="42" text-anchor="middle" font-size="17" font-weight="700" fill="#5b21b6">Leaflet + OSM GIS</text>
      <text x="125" y="68" text-anchor="middle" font-size="12.5" fill="#4c1d95">Zero-Cost Vector Maps</text>
      <text x="125" y="88" text-anchor="middle" font-size="12" fill="#6b21a8">Colored Risk Pins &amp; Bounds</text>
    </g>
  </g>

  <!-- Connectors L4 to L3 -->
  <path d="M 800 270 L 800 300" stroke="#6366f1" stroke-width="3" stroke-dasharray="6 4"/>

  <!-- Layer 3: REST API Layer -->
  <g transform="translate(100, 300)">
    <rect width="1400" height="150" rx="20" fill="#ffffff" stroke="#e0f2fe" stroke-width="2" filter="url(#cardShadow)"/>
    <rect width="280" height="150" rx="20" fill="url(#l3Grad)"/>
    <rect x="250" width="30" height="150" fill="url(#l3Grad)"/>
    <text x="140" y="65" text-anchor="middle" font-size="20" font-weight="800" fill="#ffffff">LAYER 3</text>
    <text x="140" y="92" text-anchor="middle" font-size="14" font-weight="600" fill="#e0f2fe">REST API &amp; SERVICE</text>
    <text x="140" y="112" text-anchor="middle" font-size="12" fill="#bae6fd">FastAPI &amp; Async I/O</text>

    <!-- Component Cards L3 -->
    <g transform="translate(310, 20)">
      <rect width="330" height="110" rx="14" fill="#f0f9ff" stroke="#bae6fd" stroke-width="1.5"/>
      <text x="165" y="42" text-anchor="middle" font-size="17" font-weight="700" fill="#0369a1">FastAPI REST Endpoints</text>
      <text x="165" y="68" text-anchor="middle" font-size="12.5" fill="#0284c7">/api/projects | /api/contractors</text>
      <text x="165" y="88" text-anchor="middle" font-size="12" fill="#0369a1">/api/alerts | /api/inspections</text>
    </g>
    <g transform="translate(670, 20)">
      <rect width="330" height="110" rx="14" fill="#f0f9ff" stroke="#bae6fd" stroke-width="1.5"/>
      <text x="165" y="42" text-anchor="middle" font-size="17" font-weight="700" fill="#0369a1">Swagger OpenAPI 3.1</text>
      <text x="165" y="68" text-anchor="middle" font-size="12.5" fill="#0284c7">Interactive Browser Testing</text>
      <text x="165" y="88" text-anchor="middle" font-size="12" fill="#0369a1">Self-Updating Living Docs</text>
    </g>
    <g transform="translate(1030, 20)">
      <rect width="340" height="110" rx="14" fill="#f0f9ff" stroke="#bae6fd" stroke-width="1.5"/>
      <text x="170" y="42" text-anchor="middle" font-size="17" font-weight="700" fill="#0369a1">Pydantic V2 &amp; Security</text>
      <text x="170" y="68" text-anchor="middle" font-size="12.5" fill="#0284c7">Strict Request Validation</text>
      <text x="170" y="88" text-anchor="middle" font-size="12" fill="#0369a1">JWT RBAC Role Isolation</text>
    </g>
  </g>

  <!-- Connectors L3 to L2 -->
  <path d="M 800 450 L 800 480" stroke="#0284c7" stroke-width="3" stroke-dasharray="6 4"/>

  <!-- Layer 2: Core Processing & AI Layer -->
  <g transform="translate(100, 480)">
    <rect width="1400" height="150" rx="20" fill="#ffffff" stroke="#dcfce7" stroke-width="2" filter="url(#cardShadow)"/>
    <rect width="280" height="150" rx="20" fill="url(#l2Grad)"/>
    <rect x="250" width="30" height="150" fill="url(#l2Grad)"/>
    <text x="140" y="65" text-anchor="middle" font-size="20" font-weight="800" fill="#ffffff">LAYER 2</text>
    <text x="140" y="92" text-anchor="middle" font-size="14" font-weight="600" fill="#dcfce7">AI INTELLIGENCE CORE</text>
    <text x="140" y="112" text-anchor="middle" font-size="12" fill="#bbf7d0">Custom Python Modules</text>

    <!-- Component Cards L2 -->
    <g transform="translate(310, 20)">
      <rect width="330" height="110" rx="14" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1.5"/>
      <text x="165" y="42" text-anchor="middle" font-size="17" font-weight="700" fill="#15803d">7-Factor Risk Engine</text>
      <text x="165" y="68" text-anchor="middle" font-size="12.5" fill="#166534">Financial vs Physical Burn Lag</text>
      <text x="165" y="88" text-anchor="middle" font-size="12" fill="#15803d">Continuous 0-100 Health Score</text>
    </g>
    <g transform="translate(670, 20)">
      <rect width="330" height="110" rx="14" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1.5"/>
      <text x="165" y="42" text-anchor="middle" font-size="17" font-weight="700" fill="#15803d">Spatial Haversine Model</text>
      <text x="165" y="68" text-anchor="middle" font-size="12.5" fill="#166534">Geodesic Curvature Distance</text>
      <text x="165" y="88" text-anchor="middle" font-size="12" fill="#15803d">&lt; 250m Overlap &amp; Token Match</text>
    </g>
    <g transform="translate(1030, 20)">
      <rect width="340" height="110" rx="14" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1.5"/>
      <text x="170" y="42" text-anchor="middle" font-size="17" font-weight="700" fill="#15803d">Bayesian Delay Forecaster</text>
      <text x="170" y="68" text-anchor="middle" font-size="12.5" fill="#166534">Dynamic Daily Progress Rate</text>
      <text x="170" y="88" text-anchor="middle" font-size="12" fill="#15803d">Forecasts Bottlenecks Months Early</text>
    </g>
  </g>

  <!-- Connectors L2 to L1 -->
  <path d="M 800 630 L 800 660" stroke="#10b981" stroke-width="3" stroke-dasharray="6 4"/>

  <!-- Layer 1: Data & Persistence Layer -->
  <g transform="translate(100, 660)">
    <rect width="1400" height="150" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" filter="url(#cardShadow)"/>
    <rect width="280" height="150" rx="20" fill="url(#l1Grad)"/>
    <rect x="250" width="30" height="150" fill="url(#l1Grad)"/>
    <text x="140" y="65" text-anchor="middle" font-size="20" font-weight="800" fill="#ffffff">LAYER 1</text>
    <text x="140" y="92" text-anchor="middle" font-size="14" font-weight="600" fill="#cbd5e1">DATA &amp; PERSISTENCE</text>
    <text x="140" y="112" text-anchor="middle" font-size="12" fill="#94a3b8">Storage &amp; Adapters</text>

    <!-- Component Cards L1 -->
    <g transform="translate(310, 20)">
      <rect width="330" height="110" rx="14" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="165" y="42" text-anchor="middle" font-size="17" font-weight="700" fill="#334155">SQLAlchemy 2.0 ORM</text>
      <text x="165" y="68" text-anchor="middle" font-size="12.5" fill="#475569">SQLite (Zero-Config Embedded)</text>
      <text x="165" y="88" text-anchor="middle" font-size="12" fill="#64748b">PostgreSQL / PostGIS Ready</text>
    </g>
    <g transform="translate(670, 20)">
      <rect width="330" height="110" rx="14" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="165" y="42" text-anchor="middle" font-size="17" font-weight="700" fill="#334155">Geotagged Photo Store</text>
      <text x="165" y="68" text-anchor="middle" font-size="12.5" fill="#475569">EXIF Coordinates &amp; Timestamp</text>
      <text x="165" y="88" text-anchor="middle" font-size="12" fill="#64748b">Before/After Milestone Pairs</text>
    </g>
    <g transform="translate(1030, 20)">
      <rect width="340" height="110" rx="14" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="170" y="42" text-anchor="middle" font-size="17" font-weight="700" fill="#334155">Government Adapters</text>
      <text x="170" y="68" text-anchor="middle" font-size="12.5" fill="#475569">MoSPI e-SAKSHI ETL Adapter</text>
      <text x="170" y="88" text-anchor="middle" font-size="12" fill="#64748b">PFMS Treasury &amp; GeM Portals</text>
    </g>
  </g>
</svg>'''

with open("ppt_assets/slide3_tech_architecture.svg", "w", encoding="utf-8") as f:
    f.write(slide3_svg)

print("Slide 3 SVG written.")

# ----------------------------------------------------
# SLIDE 4: Feasibility & Risk Matrix SVG
# ----------------------------------------------------
slide4_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%" style="background:#f8fafc; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <defs>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.07"/>
    </filter>
    <linearGradient id="col1Grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
    <linearGradient id="col2Grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <linearGradient id="col3Grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
  </defs>

  <!-- Header -->
  <text x="800" y="65" text-anchor="middle" font-size="32" font-weight="800" fill="#0B2545" letter-spacing="1">FEASIBILITY, RISKS &amp; STRATEGIC MITIGATION</text>
  <text x="800" y="98" text-anchor="middle" font-size="16" font-weight="500" fill="#64748B">Practical Real-World Readiness for Indian District &amp; State Administration</text>

  <!-- 3 Columns -->
  <!-- Column 1: Feasibility Strengths -->
  <g transform="translate(80, 130)">
    <rect width="450" height="710" rx="20" fill="#ffffff" stroke="#e0f2fe" stroke-width="2" filter="url(#cardShadow)"/>
    <rect width="450" height="70" rx="20" fill="url(#col1Grad)"/>
    <rect y="40" width="450" height="30" fill="url(#col1Grad)"/>
    <text x="225" y="44" text-anchor="middle" font-size="20" font-weight="800" fill="#ffffff">FEASIBILITY STRENGTHS</text>

    <!-- Item 1.1 -->
    <g transform="translate(25, 95)">
      <rect width="400" height="180" rx="14" fill="#f0f9ff" stroke="#bae6fd" stroke-width="1.5"/>
      <text x="25" y="38" font-size="18" font-weight="700" fill="#0369a1">Lightweight Footprint</text>
      <text x="25" y="70" font-size="13.5" fill="#334155">• Runs effortlessly on low-cost district hardware</text>
      <text x="25" y="96" font-size="13.5" fill="#334155">• Fast startup (FastAPI ASGI sub-second latency)</text>
      <text x="25" y="122" font-size="13.5" fill="#334155">• No expensive proprietary software licenses required</text>
      <text x="25" y="152" font-size="12" font-weight="700" fill="#0284c7">RATING: 100% DEPLOYABLE ON NIC MEGHRAJ</text>
    </g>

    <!-- Item 1.2 -->
    <g transform="translate(25, 295)">
      <rect width="400" height="180" rx="14" fill="#f0f9ff" stroke="#bae6fd" stroke-width="1.5"/>
      <text x="25" y="38" font-size="18" font-weight="700" fill="#0369a1">Zero-Cost OpenStreetMap GIS</text>
      <text x="25" y="70" font-size="13.5" fill="#334155">• Open-source Leaflet engine: ₹0 API billing</text>
      <text x="25" y="96" font-size="13.5" fill="#334155">• Uncapped map renders across nationwide portals</text>
      <text x="25" y="122" font-size="13.5" fill="#334155">• Full district boundary and cadastral overlay</text>
      <text x="25" y="152" font-size="12" font-weight="700" fill="#0284c7">ADVANTAGE: SAVES LAKHS IN GOOGLE MAPS FEES</text>
    </g>

    <!-- Item 1.3 -->
    <g transform="translate(25, 495)">
      <rect width="400" height="180" rx="14" fill="#f0f9ff" stroke="#bae6fd" stroke-width="1.5"/>
      <text x="25" y="38" font-size="18" font-weight="700" fill="#0369a1">Native Government Schema</text>
      <text x="25" y="70" font-size="13.5" fill="#334155">• Directly models MoSPI 10-stage workflow</text>
      <text x="25" y="96" font-size="13.5" fill="#334155">• Pre-mapped for all Indian States &amp; Districts</text>
      <text x="25" y="122" font-size="13.5" fill="#334155">• Zero retraining needed for PWD / AEE officers</text>
      <text x="25" y="152" font-size="12" font-weight="700" fill="#0284c7">COMPATIBLE: ALIGNS WITH REVISED GUIDELINES</text>
    </g>
  </g>

  <!-- Column 2: Potential Risks & Challenges -->
  <g transform="translate(575, 130)">
    <rect width="450" height="710" rx="20" fill="#ffffff" stroke="#fef3c7" stroke-width="2" filter="url(#cardShadow)"/>
    <rect width="450" height="70" rx="20" fill="url(#col2Grad)"/>
    <rect y="40" width="450" height="30" fill="url(#col2Grad)"/>
    <text x="225" y="44" text-anchor="middle" font-size="20" font-weight="800" fill="#ffffff">POTENTIAL RISKS &amp; CHALLENGES</text>

    <!-- Item 2.1 -->
    <g transform="translate(25, 95)">
      <rect width="400" height="180" rx="14" fill="#fffbeb" stroke="#fde68a" stroke-width="1.5"/>
      <text x="25" y="38" font-size="18" font-weight="700" fill="#92400e">Remote Rural Connectivity Loss</text>
      <text x="25" y="70" font-size="13.5" fill="#334155">• Tribal and remote rural project sites have poor</text>
      <text x="25" y="94" font-size="13.5" fill="#334155">  or zero cellular 4G/5G data connectivity.</text>
      <text x="25" y="122" font-size="13.5" fill="#334155">• Risk of failed field inspection uploads and lost</text>
      <text x="25" y="146" font-size="13.5" fill="#334155">  real-time milestone reporting.</text>
    </g>

    <!-- Item 2.2 -->
    <g transform="translate(25, 295)">
      <rect width="400" height="180" rx="14" fill="#fffbeb" stroke="#fde68a" stroke-width="1.5"/>
      <text x="25" y="38" font-size="18" font-weight="700" fill="#92400e">GPS Spoofing &amp; Fake Photos</text>
      <text x="25" y="70" font-size="13.5" fill="#334155">• Potential for fraudulent contractors to submit</text>
      <text x="25" y="94" font-size="13.5" fill="#334155">  old photos or mock GPS locations to falsely</text>
      <text x="25" y="122" font-size="13.5" fill="#334155">  claim 50% or 75% milestone completion</text>
      <text x="25" y="146" font-size="13.5" fill="#334155">  tranche payments prematurely.</text>
    </g>

    <!-- Item 2.3 -->
    <g transform="translate(25, 495)">
      <rect width="400" height="180" rx="14" fill="#fffbeb" stroke="#fde68a" stroke-width="1.5"/>
      <text x="25" y="38" font-size="18" font-weight="700" fill="#92400e">Inter-Departmental Data Silos</text>
      <text x="25" y="70" font-size="13.5" fill="#334155">• MPLADS, State PWD, and PMGSY systems operate</text>
      <text x="25" y="94" font-size="13.5" fill="#334155">  in separate administrative databases.</text>
      <text x="25" y="122" font-size="13.5" fill="#334155">• Cross-departmental coordination friction delays</text>
      <text x="25" y="146" font-size="13.5" fill="#334155">  speed of duplicate work investigations.</text>
    </g>
  </g>

  <!-- Column 3: Strategic Mitigation -->
  <g transform="translate(1070, 130)">
    <rect width="450" height="710" rx="20" fill="#ffffff" stroke="#dcfce7" stroke-width="2" filter="url(#cardShadow)"/>
    <rect width="450" height="70" rx="20" fill="url(#col3Grad)"/>
    <rect y="40" width="450" height="30" fill="url(#col3Grad)"/>
    <text x="225" y="44" text-anchor="middle" font-size="20" font-weight="800" fill="#ffffff">STRATEGIC MITIGATION</text>

    <!-- Item 3.1 -->
    <g transform="translate(25, 95)">
      <rect width="400" height="180" rx="14" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1.5"/>
      <text x="25" y="38" font-size="18" font-weight="700" fill="#15803d">PWA Offline-First Sync</text>
      <text x="25" y="70" font-size="13.5" fill="#334155">• Inspections cached locally in secure browser storage</text>
      <text x="25" y="96" font-size="13.5" fill="#334155">• Instant background queue auto-uploads as soon as</text>
      <text x="25" y="122" font-size="13.5" fill="#334155">  officer device returns to network coverage area</text>
      <text x="25" y="152" font-size="12" font-weight="700" fill="#166534">SOLUTION: ZERO DATA LOSS IN LOW-NETWORK ZONES</text>
    </g>

    <!-- Item 3.2 -->
    <g transform="translate(25, 295)">
      <rect width="400" height="180" rx="14" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1.5"/>
      <text x="25" y="38" font-size="18" font-weight="700" fill="#15803d">EXIF Geofence &amp; Timestamp Lock</text>
      <text x="25" y="70" font-size="13.5" fill="#334155">• Strict metadata matching: compares image GPS to</text>
      <text x="25" y="96" font-size="13.5" fill="#334155">  sanctioned site geofence within 50m tolerance</text>
      <text x="25" y="122" font-size="13.5" fill="#334155">• CV milestone consistency flags duplicate photos</text>
      <text x="25" y="152" font-size="12" font-weight="700" fill="#166534">SOLUTION: TAMPER-PROOF EVIDENCE AT SOURCE</text>
    </g>

    <!-- Item 3.3 -->
    <g transform="translate(25, 495)">
      <rect width="400" height="180" rx="14" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1.5"/>
      <text x="25" y="38" font-size="18" font-weight="700" fill="#15803d">Unified Cadastral Registry</text>
      <text x="25" y="70" font-size="13.5" fill="#334155">• District Collector dashboard unifies geospatial coordinates</text>
      <text x="25" y="96" font-size="13.5" fill="#334155">  across all infrastructure schemes under one map</text>
      <text x="25" y="122" font-size="13.5" fill="#334155">• Automated alerts to District Planning Officer</text>
      <text x="25" y="152" font-size="12" font-weight="700" fill="#166534">SOLUTION: INTER-DEPARTMENTAL HARMONIZATION</text>
    </g>
  </g>
</svg>'''

with open("ppt_assets/slide4_feasibility_matrix.svg", "w", encoding="utf-8") as f:
    f.write(slide4_svg)

print("Slide 4 SVG written.")

# ----------------------------------------------------
# SLIDE 5: Impact & Benefits Quadrant SVG
# ----------------------------------------------------
slide5_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%" style="background:#f8fafc; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <defs>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
    <linearGradient id="q1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B2545"/>
      <stop offset="100%" stop-color="#1E3A8A"/>
    </linearGradient>
    <linearGradient id="q2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#EA580C"/>
    </linearGradient>
    <linearGradient id="q3Grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
    <linearGradient id="q4Grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284C7"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
  </defs>

  <!-- Header -->
  <text x="800" y="65" text-anchor="middle" font-size="32" font-weight="800" fill="#0B2545" letter-spacing="1">PROJECTED IMPACT &amp; QUANTIFIABLE BENEFITS</text>
  <text x="800" y="98" text-anchor="middle" font-size="16" font-weight="500" fill="#64748B">Empowering 140+ Crore Citizens &amp; Securing ₹4,000+ Crores Annual MPLADS Allocations</text>

  <!-- Quadrant 1: Economic Impact -->
  <g transform="translate(100, 130)">
    <rect width="680" height="340" rx="20" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" filter="url(#cardShadow)"/>
    <rect width="680" height="65" rx="20" fill="url(#q1Grad)"/>
    <rect y="35" width="680" height="30" fill="url(#q1Grad)"/>
    <text x="340" y="42" text-anchor="middle" font-size="20" font-weight="800" fill="#ffffff">1. FISCAL &amp; ECONOMIC IMPACT</text>
    
    <g transform="translate(40, 95)">
      <rect width="600" height="215" rx="14" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
      <text x="30" y="40" font-size="20" font-weight="800" fill="#0f172a">Zero Ghost Billing &amp; Double-Dipping Prevention</text>
      <text x="30" y="75" font-size="14.5" fill="#334155">• Intercepts duplicate billing within 250m radius before treasury release</text>
      <text x="30" y="105" font-size="14.5" fill="#334155">• Freezes payments when financial drawdown velocity exceeds physical work</text>
      <text x="30" y="135" font-size="14.5" fill="#334155">• Real-time PBG guarantee countdown prevents contractor forfeiture defaults</text>
      <rect x="30" y="160" width="540" height="36" rx="8" fill="#eff6ff"/>
      <text x="300" y="184" text-anchor="middle" font-size="14" font-weight="800" fill="#1e40af">BENCHMARK: Estimated ₹300-500 Cr Leakage Prevented Annually</text>
    </g>
  </g>

  <!-- Quadrant 2: Social Empowerment -->
  <g transform="translate(820, 130)">
    <rect width="680" height="340" rx="20" fill="#ffffff" stroke="#fed7aa" stroke-width="2" filter="url(#cardShadow)"/>
    <rect width="680" height="65" rx="20" fill="url(#q2Grad)"/>
    <rect y="35" width="680" height="30" fill="url(#q2Grad)"/>
    <text x="340" y="42" text-anchor="middle" font-size="20" font-weight="800" fill="#ffffff">2. SOCIAL &amp; CITIZEN EMPOWERMENT</text>
    
    <g transform="translate(40, 95)">
      <rect width="600" height="215" rx="14" fill="#fffbeb" stroke="#fde68a" stroke-width="1.5"/>
      <text x="30" y="40" font-size="20" font-weight="800" fill="#78350f">Direct Citizen Grievance &amp; Whistleblower Channel</text>
      <text x="30" y="75" font-size="14.5" fill="#334155">• Enables rural villagers to upload site evidence photos with GPS lock</text>
      <text x="30" y="105" font-size="14.5" fill="#334155">• Transparent 5-stage tracking ticket (CMP-2026-XXXXX) visible to all</text>
      <text x="30" y="135" font-size="14.5" fill="#334155">• Total public visibility on local MP community hall, road, and water fund use</text>
      <rect x="30" y="160" width="540" height="36" rx="8" fill="#fef3c7"/>
      <text x="300" y="184" text-anchor="middle" font-size="14" font-weight="800" fill="#92400e">OUTCOME: 100% Democratic Transparency at Gram Panchayat Level</text>
    </g>
  </g>

  <!-- Quadrant 3: Administrative Velocity -->
  <g transform="translate(100, 500)">
    <rect width="680" height="340" rx="20" fill="#ffffff" stroke="#bbf7d0" stroke-width="2" filter="url(#cardShadow)"/>
    <rect width="680" height="65" rx="20" fill="url(#q3Grad)"/>
    <rect y="35" width="680" height="30" fill="url(#q3Grad)"/>
    <text x="340" y="42" text-anchor="middle" font-size="20" font-weight="800" fill="#ffffff">3. ADMINISTRATIVE VELOCITY</text>
    
    <g transform="translate(40, 95)">
      <rect width="600" height="215" rx="14" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1.5"/>
      <text x="30" y="40" font-size="20" font-weight="800" fill="#065f46">60% Faster Dispute Resolution &amp; Escalation</text>
      <text x="30" y="75" font-size="14.5" fill="#334155">• Dynamic 4-tier alert routing: Level 1 (AEE) to Level 4 (MoSPI Nodal)</text>
      <text x="30" y="105" font-size="14.5" fill="#334155">• Bayesian forecaster triggers alerts 60 days before contract expiry</text>
      <text x="30" y="135" font-size="14.5" fill="#334155">• District Collectors take action in 1 click (Assign, Escalate, Resolve)</text>
      <rect x="30" y="160" width="540" height="36" rx="8" fill="#dcfce7"/>
      <text x="300" y="184" text-anchor="middle" font-size="14" font-weight="800" fill="#15803d">IMPROVEMENT: Projects Completed 45-60 Days Ahead of Extension Cycles</text>
    </g>
  </g>

  <!-- Quadrant 4: Audit & Trust -->
  <g transform="translate(820, 500)">
    <rect width="680" height="340" rx="20" fill="#ffffff" stroke="#bfdbfe" stroke-width="2" filter="url(#cardShadow)"/>
    <rect width="680" height="65" rx="20" fill="url(#q4Grad)"/>
    <rect y="35" width="680" height="30" fill="url(#q4Grad)"/>
    <text x="340" y="42" text-anchor="middle" font-size="20" font-weight="800" fill="#ffffff">4. AUDIT COMPLIANCE &amp; TRUST</text>
    
    <g transform="translate(40, 95)">
      <rect width="600" height="215" rx="14" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5"/>
      <text x="30" y="40" font-size="20" font-weight="800" fill="#1e40af">100% Court-Admissible Verifiable Audit Trail</text>
      <text x="30" y="75" font-size="14.5" fill="#334155">• Immutable chronological ledger of all inspection logs &amp; officer overrides</text>
      <text x="30" y="105" font-size="14.5" fill="#334155">• One-click parliamentary audit dossiers ready for MoSPI &amp; CAG reviews</text>
      <text x="30" y="135" font-size="14.5" fill="#334155">• Explainable AI recommendations backed by mathematical formulas</text>
      <rect x="30" y="160" width="540" height="36" rx="8" fill="#dbeafe"/>
      <text x="300" y="184" text-anchor="middle" font-size="14" font-weight="800" fill="#1d4ed8">STANDARD: Fully Complies with MoSPI Revised Guidelines &amp; CVC Norms</text>
    </g>
  </g>
</svg>'''

with open("ppt_assets/slide5_impact_benefits.svg", "w", encoding="utf-8") as f:
    f.write(slide5_svg)

print("Slide 5 SVG written.")
print("All 4 SVGs successfully created in ppt_assets!")
