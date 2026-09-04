# MPLAD-TRACE 360

## AI-Powered MPLADS Work Monitoring, Contract Intelligence & Early-Warning Platform

> **"Track every rupee. Verify every work. Detect every warning."**

An Indian Government / Citizen public-transparency platform designed for continuous surveillance of MPLADS (Member of Parliament Local Area Development Scheme) infrastructure works throughout their complete lifecycle.

---

## 🏛️ System Architecture

```
[ MoSPI / e-SAKSHI ] ──┐
[ PFMS Treasury ]     ──┼──> [ FastAPI Surveillance Backend ] ──> [ SQLite / PostgreSQL ]
[ PWD State Nodes ]   ──┤               │
[ Mobile Geotag App ] ──┘               ▼
                           [ Transparent AI Analytics Engines ]
                           ├─ 7-Factor Risk Engine (0-100 Score)
                           ├─ Spatial Duplicate Work Detector (Haversine + Lexical)
                           ├─ Bayesian Delay & Completion Forecaster
                           └─ CV Photo & Timestamp Verification
                                        │
                                        ▼
                           [ React 18 + TS + Tailwind + Leaflet UI ]
                           ├─ Role 1: Citizen (Public Works Explorer & Grievances)
                           ├─ Role 2: Field Officer (Mobile Geotagged Inspections)
                           ├─ Role 3: District Authority (Anomalies & Escalations)
                           └─ Role 4: Higher Authority (Nationwide Analytics & Admin)
```

---

## 🚀 Quick Start (Running Both Servers)

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### 1. Start the Backend Server
```bash
cd backend
pip install -r requirements.txt
uvicorn backend.app.main:app --reload --port 8000
```
*Live Backend API:* `http://127.0.0.1:8000`  
*Swagger API Docs:* `http://127.0.0.1:8000/docs`

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Live Application URL:* `http://localhost:5173`

---

## 👥 Demo Role Switcher & Test Accounts

Use the **Role Switcher** in the top navigation bar to explore the application across the 4 user profiles:

| Role | Profile Name | Designation | Key Modules & Permissions |
|---|---|---|---|
| **Role 1: Citizen** | P. Rajesh Kumar | Resident Citizen / Ward Committee | Public Works Explorer, Track 360°, File Grievances, Verify Geotagged Photos |
| **Role 2: Field Officer** | Shri R. K. Verma, AEE | Assistant Executive Engineer, PRED | Mobile-First Geotagged Inspection Screen, GPS Capture, Photo Upload, Progress Certification |
| **Role 3: District Authority** | Smt. Ananya Sharma, IAS | District Collector & Planning Officer | AI Risk Center, Multi-Tier Escalations, Dispute Triage, Guarantee Tracking, Officer Assignment |
| **Role 4: Higher Authority / Admin** | Dr. V. K. Malhotra | State Nodal Officer & Admin (MoSPI) | Nationwide Analytics, Risk Threshold Configuration, Batch Ingestion, Immutable Audit Trail |

---

## 🔍 Core Features & Verification Checklist

1. **Flagship 360° Project Trace (`MPLAD-AP-2026-00125`)**:
   - Community Hall in Visakhapatnam (₹29.5 Lakh sanction).
   - Ashoka Chakra-inspired 5-Dimension Project Health Indicator (Financial, Physical, Contract, Schedule, Evidence).
   - Interactive 10-stage lifecycle timeline from MP Recommendation to Handover.
   - Interactive Fund Flow pipeline from Ministry Allocation to Site Expenditure.
   - Before/After photographic comparison with Computer Vision consistency score.
   - Transparent AI *"Why am I seeing this?"* breakdown with observed vs. expected variance.
   - Bayesian completion forecast with delay probability.

2. **Public Works Explorer**:
   - Multi-faceted dynamic filtering across 10 Indian States, 28 Districts, 8 Categories, Status, and Risk Levels.
   - Real-time search by ID, village, contractor, or parliamentary constituency.

3. **Interactive India Project Map**:
   - Leaflet + OpenStreetMap integration with colored risk marker pins (Normal, Watch, High Risk, Critical).
   - One-click popups linking directly to complete project dossiers.

4. **Spatial Duplicate Work Detection**:
   - Detects overlapping works within 250m radius across schemes.
   - Side-by-side comparison with interactive officer decision buttons (*Confirm Duplicate*, *Not Duplicate*, *Needs Review*).

5. **Mobile-First Field Inspection**:
   - Instant GPS capture button with latitude/longitude validation.
   - Photo attachment and milestone progress slider.
   - Automated CV verification score and timestamp validation.

6. **Citizen Grievance Redressal**:
   - Public issue submission with photo evidence and whistleblower identity protection.
   - Auto-generated tracking ID (e.g., `CMP-2026-XXXXX`) with 5-stage lifecycle progress tracker.

7. **Multi-Tier Alert & Escalation Engine**:
   - Configurable 4-tier routing: Level 1 (AEE) → Level 2 (EE) → Level 3 (District Collector) → Level 4 (MoSPI).
   - Functional action buttons: *Review Evidence*, *Assign Officer*, *Escalate*, *Resolve*, and *Add Note*.

8. **Contractor Intelligence Scorecard**:
   - Comprehensive profiles for 15 contractors with historical delay indices, concurrent workload, and performance risk indicators.

9. **Contract Guarantee & Defect Liability Tracker**:
   - Live countdowns for Performance Bank Guarantees with automated alerts for expirations within 30 days.

10. **Official Dossier Export**:
    - Print-ready parliamentary audit dossiers and CSV dataset downloads.

11. **Immutable Audit Trail**:
    - Chronological log of all inspections, AI anomaly generations, and administrative decisions.

---

## ⚖️ Ethical AI & Administrative Compliance

In compliance with official governance standards:
- The platform uses objective terminology: **"Potential Anomaly / Requires Verification"** and **"Performance Risk Indicator"**.
- AI models **never fabricate accusations of fraud**; every alert provides observed vs. expected benchmarks with source attribution.
- Government-derived data and AI inferences are clearly distinguished with explicit badges.

---

## 🧪 Automated Tests

Run backend automated tests:
```bash
pytest backend/tests/test_api.py
```
Test results:
```
backend/tests/test_api.py::test_root PASSED
backend/tests/test_api.py::test_health PASSED
backend/tests/test_api.py::test_projects_list PASSED
backend/tests/test_api.py::test_project_detail_and_timeline PASSED
backend/tests/test_api.py::test_analytics_overview PASSED
backend/tests/test_api.py::test_duplicate_detection PASSED
backend/tests/test_api.py::test_delay_prediction PASSED
======================= 7 passed in 1.02s =======================
```

Build frontend production bundle:
```bash
cd frontend
npm run build
```
Build result:
```
✓ 1518 modules transformed.
dist/index.html                   1.53 kB
dist/assets/index-CUpUH89t.css   39.46 kB
dist/assets/index-7NsR2MhA.js   525.54 kB
✓ built in 40.33s
```
