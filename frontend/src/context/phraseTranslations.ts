import { Language } from '../types';

// Multilingual Phrase Mappings for All Modules, Tables, Buttons, Badges, and Stats
export const PHRASE_DICTIONARY: Record<Language, Record<string, string>> = {
  en: {},
  hi: {
    // Navigation & Module Headers
    "Platform Home": "मुख्य पृष्ठ",
    "Departmental Portals": "विभागीय पोर्टल",
    "Public Works Explorer": "सार्वजनिक कार्य अन्वेषक",
    "Interactive India Map": "भारत का लाइव मानचित्र",
    "Fund Flow Intelligence & PFMS Disbursal Tracker": "धन प्रवाह विश्लेषण एवं PFMS संवितरण ट्रैकर",
    "Fund Flow Intelligence": "धन प्रवाह विश्लेषण",
    "Contracts Registry & SLA Monitoring": "अनुबंध पंजिका एवं सेवा स्तर निगरानी",
    "Contracts Registry": "अनुबंध पंजिका",
    "Contractor Intelligence & Performance Matrix": "ठेकेदार कार्यकुशलता एवं प्रदर्शन मैट्रिक्स",
    "Contractor Intelligence": "ठेकेदार कार्यकुशलता",
    "AI Risk & Early Warning Surveillance Center": "एआई जोखिम एवं पूर्व चेतावनी निगरानी केंद्र",
    "AI Risk & Anomaly Center": "एआई जोखिम एवं विसंगति केंद्र",
    "Dispute Management & Settlement Engine": "विवाद प्रबंधन एवं निपटान प्रणाली",
    "Dispute Management": "विवाद प्रबंधन",
    "Guarantee & Warranty Tracker": "बैंक गारंटी एवं वारंटी ट्रैकर",
    "Field Inspection & Geotag Verification Console": "क्षेत्र निरीक्षण एवं भू-टैग सत्यापन कंसोल",
    "Field Inspections (Mobile)": "क्षेत्र निरीक्षण (मोबाइल)",
    "Citizen Grievances & Redressal Tracking": "नागरिक शिकायत एवं निवारण ट्रैकिंग",
    "Citizen Grievances": "नागरिक शिकायत पोर्टल",
    "Automated Alerts & Escalation Engine": "स्वचालित चेतावनी एवं समाधान प्रणाली",
    "Alert & Escalation Engine": "चेतावनी एवं समाधान प्रणाली",
    "Executive Dossier & Statutory Report Generator": "आधिकारिक रिपोर्ट व डॉजियर जनरेटर",
    "Dossier & Report Generator": "आधिकारिक रिपोर्ट व डॉजियर",
    "Document Intelligence": "दस्तावेज़ विश्लेषण",
    "Tamper-Evident System Audit Trail": "अपरिवर्तनीय सिस्टम ऑडिट रिकॉर्ड",
    "Audit Trail & Logs": "ऑडिट रिकॉर्ड एवं लॉग्स",
    "Administrative Master Ingestion & Data Management": "डेटा अंतर्ग्रहण एवं नियम प्रबंधन",
    "Admin Data & Rules": "डेटा एवं नियम प्रबंधन",

    // Categories in Sidebar
    "Core Portals": "मुख्य पोर्टल",
    "Financials & Contracts": "वित्तीय एवं अनुबंध",
    "AI & Risk Analytics": "एआई एवं जोखिम विश्लेषण",
    "Ground Operations": "जमीनी निरीक्षण",
    "Governance & Reports": "प्रशासन एवं रिपोर्ट",
    "Administration": "प्रबंधन",

    // Roles & Persona Menu
    "Role: Citizen": "भूमिका: नागरिक",
    "Role: Field Officer / Inspector": "भूमिका: क्षेत्रीय अधिकारी / निरीक्षक",
    "Role: District Authority": "भूमिका: ज़िला प्राधिकारी",
    "Role: Higher Authority / Admin": "भूमिका: उच्च प्राधिकारी / व्यवस्थापक",
    "Citizen": "नागरिक",
    "Field Officer / Inspector": "क्षेत्रीय अधिकारी / निरीक्षक",
    "Field Officer": "क्षेत्रीय अधिकारी",
    "District Authority": "ज़िला प्राधिकारी",
    "Higher Authority / Admin": "उच्च प्राधिकारी / व्यवस्थापक",
    "Switch Evaluation Persona": "मूल्यांकन भूमिका बदलें",
    "Simulate different administrative workflows": "विभिन्न प्रशासनिक प्रक्रियाओं का सिमुलेशन करें",
    "Public works search, financials & grievance reporting": "सार्वजनिक कार्य खोज, वित्तीय ब्यौरा व शिकायत निवारण",
    "Mobile geotagging, inspection & photo upload": "मोबाइल भू-टैगिंग, निरीक्षण एवं फोटो अपलोड",
    "Anomaly review, officer assignment & dispute resolution": "विसंगति समीक्षा, अधिकारी आवंटन व विवाद निवारण",
    "Nationwide analytics, risk rules & data import": "राष्ट्रव्यापी विश्लेषण, जोखिम नियम व डेटा आयात",
    "ACTIVE": "सक्रिय",

    // Table Columns & Details
    "Contractor & Reg": "ठेकेदार एवं पंजीकरण",
    "Work Agreement": "कार्य अनुबंध",
    "Contract Value (₹)": "अनुबंध राशि (₹)",
    "Contract Value": "अनुबंध राशि",
    "Contract Amount": "अनुबंध धनराशि",
    "Start / Target Date": "प्रारंभ / लक्षित तिथि",
    "Start Date": "प्रारंभ तिथि",
    "Target Date": "लक्षित तिथि",
    "Defect Liability": "दोष दायित्व अवधि",
    "Contract Health": "अनुबंध स्थिति",
    "Contract Health Legend:": "अनुबंध स्थिति संकेतक:",
    "Active Public Contracts": "सक्रिय सार्वजनिक अनुबंध",
    "Actions": "कार्रवाई",
    "Action": "कार्रवाई",
    "View": "देखें",
    "View Details": "विवरण देखें",
    "Due:": "अपेक्षित:",
    "Due": "अपेक्षित",
    "36 Months": "36 माह",
    "24 Months": "24 माह",
    "12 Months": "12 माह",
    "Assigned PWD Agency": "नामित लोक निर्माण एजेंसी",

    // Status Badges
    "Normal (On Schedule & Compliant)": "सामान्य (समयबद्ध एवं नियमानुकूल)",
    "Attention (<45d delay)": "सावधानी (<45 दिन विलंब)",
    "High Risk (Significant lag)": "उच्च जोखिम (अत्यधिक विलंब)",
    "Critical (Default / Abandonment risk)": "गंभीर (डिफ़ॉल्ट / रुकने का जोखिम)",
    "Under Progress": "प्रगति पर",
    "Completed": "पूर्ण",
    "Stalled Work": "अवरुद्ध कार्य",
    "Stalled": "अवरुद्ध",
    "Sanctioned": "स्वीकृत",
    "Delayed": "विलंबित",
    "Normal": "सामान्य",
    "Watch": "निगरानी",
    "High Risk": "उच्च जोखिम",
    "Critical": "गंभीर",
    "Critical Surveillance": "गंभीर निगरानी",

    // Filter Controls
    "Department:": "विभाग:",
    "All States": "सभी राज्य",
    "All Districts": "सभी ज़िले",
    "Select State First": "पहले राज्य चुनें",
    "All Execution Statuses": "सभी कार्य स्थितियां",
    "All AI Risk Levels": "सभी एआई जोखिम स्तर",
    "Matching Works:": "अनुरूप कार्य:",
    "Active Filters:": "सक्रिय फ़िल्टर:",
    "Filtered Results:": "फ़िल्टर परिणाम:",
    "Total": "कुल",
    "Works": "कार्य",
    "Works Mapped": "मानचित्रित कार्य",
    "Reset Filters": "फ़िल्टर रीसेट करें",
    "Clear Search": "खोज हटाएं",
    "Search": "खोजें",
    "Clear": "हटाएं",
    "None (Showing nationwide works)": "कोई नहीं (अखिल भारतीय कार्य प्रदर्शित)",

    // Metrics & Fiscal Pipeline
    "Total Monitored Works": "कुल निगरानी अधीन कार्य",
    "Sanctioned Funds": "स्वीकृत धनराशि",
    "Disbursed Funds": "जारी धनराशि",
    "Active Critical Alerts": "सक्रिय गंभीर चेतावनियां",
    "Geotagged Verified Works": "भू-टैग सत्यापित कार्य",
    "Sanctioned Amount": "स्वीकृत धनराशि",
    "Funds Released": "जारी धनराशि",
    "Funds Paid": "भुगतान की गई राशि",
    "Actual Expenditure": "वास्तविक व्यय",
    "Unspent Balance": "अव्ययित शेष राशि",
    "Fiscal Pipeline Overview": "वित्तीय पाइपलाइन अवलोकन",
    "Cumulative Sanctioned": "कुल संचित स्वीकृत",
    "Total Released from Ministry": "मंत्रालय द्वारा कुल जारी",
    "Total Paid to Contractors": "ठेकेदारों को कुल भुगतान",
    "Unspent in District Escrows": "ज़िला एस्क्रो में अव्ययित शेष",
    "Physical Progress": "भौतिक प्रगति",
    "Progress Velocity": "प्रगति गति",
    "Constituency & MP": "संसदीय क्षेत्र व सांसद",
    "Work Title & Location": "कार्य का नाम व स्थान",
    "Project ID": "परियोजना क्रमांक",
    "Delay Days": "विलंब (दिन)",

    // Social Audit & Signboard
    "STATUTORY DIGITAL SIGNBOARD (SOCIAL AUDIT)": "सांविधिक डिजिटल सूचना पट्ट (सामाजिक अंकेक्षण)",
    "As mandated by Section 3.16 of MoSPI MPLADS Guidelines": "सांख्यिकी मंत्रालय के MPLADS दिशा-निर्देशों की धारा 3.16 के अंतर्गत अनिवार्य",
    "Citizen Social Audit & Statutory Signboard": "नागरिक सामाजिक अंकेक्षण एवं सांविधिक सूचना पट्ट",
    "Confirm Ground Reality": "जमीनी हकीकत की पुष्टि करें",
    "Report Discrepancy / Delay": "विसंगति / विलंब दर्ज करें",
    "Record Field Inspection": "क्षेत्र निरीक्षण दर्ज करें",
    "Lodge Citizen Grievance": "नागरिक शिकायत दर्ज करें",
    "Register Grievance": "शिकायत जमा करें",
    "Grievance Category": "शिकायत की श्रेणी",
    "Work quality & material standard": "कार्य की गुणवत्ता एवं निर्माण सामग्री मानक",
    "Work stopped / Inordinate delay": "कार्य रुका हुआ / अत्यधिक विलंब",
    "Site safety & public obstruction": "कार्यस्थल सुरक्षा एवं सार्वजनिक अवरोध",
    "Discrepancy in executed dimensions": "स्वीकृत माप व स्थल माप में विसंगति",
    "Other grievance": "अन्य शिकायत",
    "Complainant Name / Resident Group": "शिकायतकर्ता का नाम / निवासी समूह",
    "Specific Location / Landmark": "विशिष्ट स्थान / निकटतम स्थल",
    "Grievance Details & Evidence Description *": "शिकायत का विवरण एवं साक्ष्य विवरण *",
    "Submit": "जमा करें",
    "Cancel": "रद्द करें",
    "Close": "बंद करें",
    "Save": "सहेजें",

    // Evidence & Inspection
    "Geotagged Photographic Verification": "भू-टैग फोटोग्राफिक सत्यापन",
    "Sequential milestone comparison verified via GPS EXIF hash and structural milestone classifier.": "जीपीएस ईएक्सआईएफ हैश एवं संरचनात्मक वर्गीकरण द्वारा चरणबद्ध सत्यापन।",
    "Computer Vision Analysis Summary:": "कंप्यूटर विज़न विश्लेषण सारांश:",
    "Geotag Authenticated": "भू-टैग प्रमाणित",
    "Baseline / Inspection #1": "प्रारंभिक निरीक्षण #1",
    "Recent Field Inspection": "हालिया क्षेत्र निरीक्षण",
    "GPS Within": "जीपीएस दायरा",
    "CV Consistency": "कंप्यूटर विज़न संगति",
    "PFMS Node Latency": "PFMS नोड विलंबता",
    "e-SAKSHI & GeM APIs Connected": "e-SAKSHI एवं GeM एपीआई जुड़े हैं",
    "Surveillance Feeds": "निगरानी सूचनाएं",
    "Live Telemetry": "लाइव टेलीमेट्री",
    "Open Full Early Warning Console": "पूर्ण पूर्व चेतावनी कंसोल खोलें",

    // Departments
    "Drinking Water": "पेयजल",
    "Education": "शिक्षा",
    "Healthcare": "स्वास्थ्य",
    "Roads & Bridges": "सड़क एवं पुल",
    "Renewable Energy": "नवीकरणीय ऊर्जा",
    "Irrigation & Water Bodies": "सिंचाई एवं जल संचयन",
    "Sanitation & Waste": "स्वच्छता एवं अपशिष्ट",
    "Community Assets": "सामुदायिक संपत्तियां",

    // Department Monitoring & Telemetry Extras
    "Department Intelligence Hub": "विभागीय आसूचना केंद्र",
    "8 Portfolios Mapped": "8 पोर्टफोलियो मैप किए गए",
    "Departmental Monitoring Portals": "विभागीय निगरानी पोर्टल",
    "Sector-specific intelligence dashboards configured with Indian administrative benchmarks, nodal executing agencies, and automated project milestone tracking.": "भारतीय प्रशासनिक मानकों, नोडल कार्यान्वयन एजेंसियों और स्वचालित परियोजना मील का पत्थर ट्रैकिंग के साथ कॉन्फ़िगर किए गए क्षेत्र-विशिष्ट डैशबोर्ड।",
    "Sync All Records": "सभी रिकॉर्ड सिंक करें",
    "Drinking Water & Jal Jeevan": "पेयजल एवं जल जीवन मिशन",
    "School Education & Literacy": "स्कूली शिक्षा एवं साक्षरता",
    "Healthcare & Public Health": "स्वास्थ्य सेवा एवं जन स्वास्थ्य",
    "Roads, Bridges & Connectivity": "सड़कें, पुल एवं संपर्क",
    "Community Infrastructure & Halls": "सामुदायिक अवसंरचना एवं भवन",
    "Solar & Renewable Energy": "सौर एवं नवीकरणीय ऊर्जा",
    "Irrigation & Water Conservation": "सिंचाई एवं जल संरक्षण",
    "Sanitation & Solid Waste Management": "स्वच्छता एवं ठोस अपशिष्ट प्रबंधन",
    "Community Infrastructure": "सामुदायिक अवसंरचना",
    "Solar Energy": "सौर ऊर्जा",
    "Irrigation": "सिंचाई",
    "Sanitation": "स्वच्छता",
    "Roads & PWD": "सड़कें एवं लोक निर्माण",
    "Sanitation (Swachh Bharat)": "स्वच्छता (स्वच्छ भारत)",
    "Drinking Water (JJM)": "पेयजल (जल जीवन मिशन)",
    "Healthcare (NHM)": "स्वास्थ्य सेवा (राष्ट्रीय स्वास्थ्य मिशन)",
    "Jal Jeevan Portfolio": "जल जीवन पोर्टफोलियो",
    "DISBURSED OUTLAY": "संवितरित परिव्यय",
    "Disbursed Outlay": "संवितरित परिव्यय",
    "AVG PHYSICAL VELOCITY": "औसत भौतिक गति",
    "Avg Physical Velocity": "औसत भौतिक गति",
    "COMPLETED & HANDOVER": "पूर्ण एवं हस्तांतरित",
    "Completed & Handover": "पूर्ण एवं हस्तांतरित",
    "UNDER EXECUTION": "प्रगति पर कार्य",
    "Under Execution": "प्रगति पर कार्य",
    "WATCHLIST WARNINGS": "निगरानी सूची चेतावनियां",
    "Watchlist Warnings": "निगरानी सूची चेतावनियां",
    "WATCHLIST": "निगरानी सूची",
    "Watchlist": "निगरानी सूची",
    "Needs verification audit": "सत्यापन ऑडिट आवश्यक",
    "MB Record verified": "माप पुस्तिका रिकॉर्ड सत्यापित",
    "100% UC generated": "100% उपयोगिता प्रमाण पत्र जारी",
    "Under surveillance": "निगरानी के तहत",
    "schemes tracked": "योजनाएं ट्रैक की गईं",
    "fund utilization": "धनराशि उपयोग",
    "LIVE AUDIT": "लाइव ऑडिट",
    "Spotlight: Community Hall (AP)": "विशेष ध्यान: सामुदायिक भवन (आंध्र प्रदेश)",
    "52 Works • 10 States Active": "52 कार्य • 10 सक्रिय राज्य",
    "TIRANGA SURVEILLANCE": "तिरंगा निगरानी",
    "Across 10 States & 28 Districts": "10 राज्यों एवं 28 जिलों में",
    "Search works, MPs, IDs...": "कार्य, सांसद, आईडी खोजें...",
    "Government of India": "भारत सरकार",
    "Ministry of Jal Shakti": "जल शक्ति मंत्रालय",
    "Rural Water Supply & Sanitation (RWSS)": "ग्रामीण जल आपूर्ति एवं स्वच्छता",
    "Ministry of Education": "शिक्षा मंत्रालय",
    "Ministry of Health & Family Welfare": "स्वास्थ्य एवं परिवार कल्याण मंत्रालय",
    "Ministry of Road Transport & Highways": "सड़क परिवहन एवं राजमार्ग मंत्रालय",
    "Ministry of Rural Development": "ग्रामीण विकास मंत्रालय",
    "Ministry of New & Renewable Energy": "नवीन एवं नवीकरणीय ऊर्जा मंत्रालय",
    "Ministry of Housing & Urban Affairs": "आवासन एवं शहरी कार्य मंत्रालय",
    "Standard:": "मानक:",
    "Total Sanctioned": "कुल स्वीकृत धनराशि",
    "Portfolio": "पोर्टफोलियो",
    "Execution Status:": "कार्य स्थिति:",
    "All Execution States": "सभी कार्य स्थितियां",
    "Stalled / Stagnated": "अवरुद्ध / रुका हुआ",
    "Executing Agency:": "कार्यान्वयन एजेंसी:",
    "Designated Nodal Agency": "नामित नोडल एजेंसी",
    "Status": "स्थिति",
    "Physical": "भौतिक प्रगति",
    "Disbursed": "संवितरित",
    "days schedule slippage": "दिन समय सारिणी विलंब",
    "Trace 360°": "ट्रेस 360°",
    "Inspect": "निरीक्षण",
    "Grievance": "शिकायत",
    "Retrieving": "पुनर्प्राप्त किया जा रहा है",
    "project ledgers...": "परियोजना खाते...",
    "works by Title, ID, District, or Contractor...": "शीर्षक, आईडी, जिला या ठेकेदार द्वारा कार्य...",
    "Milestone Photographic Verification:": "माइलस्टोन फोटोग्राफिक सत्यापन:",
    "Open Live Camera & Take Photo": "लाइव कैमरा खोलें एवं फोटो लें",
    "Upload Site Photo File": "साइट फोटो फ़ाइल अपलोड करें",
    "Statutory Field Camera Viewfinder": "आधिकारिक क्षेत्रीय कैमरा व्यूफ़ाइंडर",
    "Snap Photo & Watermark": "फोटो लें एवं वॉटरमार्क लगाएं",
    "Flip Camera": "कैमरा बदलें",
    "Upload File": "फ़ाइल अपलोड करें",
  },
  te: {
    // Navigation & Module Headers
    "Platform Home": "హోమ్ పేజీ",
    "Departmental Portals": "విభాగాల పోర్టల్",
    "Public Works Explorer": "ప్రజా పనుల అన్వేషణ",
    "Interactive India Map": "ఇంటరాక్టివ్ ఇండియా మ్యాప్",
    "Fund Flow Intelligence & PFMS Disbursal Tracker": "నిధుల ప్రవాహ నిఘా & PFMS పంపిణీ ట్రాకర్",
    "Fund Flow Intelligence": "నిధుల ప్రవాహ నిఘా",
    "Contracts Registry & SLA Monitoring": "ఒప్పందాల రిజిస్ట్రీ & SLA పర్యవేక్షణ",
    "Contracts Registry": "ఒప్పందాల రిజిస్ట్రీ",
    "Contractor Intelligence & Performance Matrix": "కాంట్రాక్టర్ పనితీరు సూచిక & విశ్లేషణ",
    "Contractor Intelligence": "కాంట్రాక్టర్ పనితీరు సూచిక",
    "AI Risk & Early Warning Surveillance Center": "ఏఐ రిస్క్ & ముందస్తు హెచ్చరిక నిఘా కేంద్రం",
    "AI Risk & Anomaly Center": "ఏఐ రిస్క్ & లోపాల కేంద్రం",
    "Dispute Management & Settlement Engine": "వివాదాల పరిష్కార వ్యవస్థ",
    "Dispute Management": "వివాదాల పరిష్కారం",
    "Guarantee & Warranty Tracker": "బ్యాంక్ గ్యారెంటీ & వారంటీ ట్రాకర్",
    "Field Inspection & Geotag Verification Console": "ఫీల్డ్ తనిఖీ & జియోట్యాగ్ ధృవీకరణ వేదిక",
    "Field Inspections (Mobile)": "ఫీల్డ్ తనిఖీ (మొబైల్)",
    "Citizen Grievances & Redressal Tracking": "పౌరుల ఫిర్యాదులు & పరిష్కారాల పర్యవేక్షణ",
    "Citizen Grievances": "పౌరుల ఫిర్యాదుల పోర్టల్",
    "Automated Alerts & Escalation Engine": "ఆటోమేటెడ్ హెచ్చరికలు & పరిష్కారాల ఇంజిన్",
    "Alert & Escalation Engine": "హెచ్చరికలు & పరిష్కారాల ఇంజిన్",
    "Executive Dossier & Statutory Report Generator": "అధికారిక నివేదికలు & డాక్యుమెంట్ జనరేటర్",
    "Dossier & Report Generator": "అధికారిక నివేదికలు & డాక్యుమెంట్లు",
    "Document Intelligence": "పత్రాల ఏఐ విశ్లేషణ",
    "Tamper-Evident System Audit Trail": "ట్యాంపర్-రహిత సిస్టమ్ ఆడిట్ చిట్టా",
    "Audit Trail & Logs": "ఆడిట్ చిట్టా & లాగ్‌లు",
    "Administrative Master Ingestion & Data Management": "డేటా & నిబంధనల నిర్వహణ",
    "Admin Data & Rules": "డేటా & నిబంధనల నిర్వహణ",

    // Categories
    "Core Portals": "ప్రధాన పోర్టల్స్",
    "Financials & Contracts": "ఆర్థిక & ఒప్పందాలు",
    "AI & Risk Analytics": "ఏఐ & రిస్క్ విశ్లేషణ",
    "Ground Operations": "క్షేత్రస్థాయి పనులు",
    "Governance & Reports": "పాలన & నివేదికలు",
    "Administration": "నిర్వహణ",

    // Roles & Persona Menu
    "Role: Citizen": "పాత్ర: పౌరుడు",
    "Role: Field Officer / Inspector": "పాత్ర: ఫీల్డ్ అధికారి / ఇన్స్పెక్టర్",
    "Role: District Authority": "పాత్ర: జిల్లా ప్రాధికార అధికారి",
    "Role: Higher Authority / Admin": "పాత్ర: ఉన్నతాధికారి / అడ్మిన్",
    "Citizen": "పౌరుడు",
    "Field Officer / Inspector": "ఫీల్డ్ అధికారి / ఇన్స్పెక్టర్",
    "Field Officer": "ఫీల్డ్ అధికారి",
    "District Authority": "జిల్లా ప్రాధికార అధికారి",
    "Higher Authority / Admin": "ఉన్నతాధికారి / అడ్మిన్",
    "Switch Evaluation Persona": "పరీక్షించే పాత్రను మార్చండి",
    "Simulate different administrative workflows": "వివిధ పరిపాలనా వర్క్‌ఫ్లోలను పరిశీలించండి",
    "Public works search, financials & grievance reporting": "ప్రజా పనుల శోధన, ఆర్థిక వివరాలు & ఫిర్యాదులు",
    "Mobile geotagging, inspection & photo upload": "మొబైల్ జియోట్యాగింగ్, తనిఖీ & ఫోటోల అప్‌లోడ్",
    "Anomaly review, officer assignment & dispute resolution": "లోపాల సమీక్ష, అధికారి నియామకం & వివాద పరిష్కారం",
    "Nationwide analytics, risk rules & data import": "దేశవ్యాప్త విశ్లేషణలు, రిస్క్ నిబంధనలు & డేటా దిగుమతి",
    "ACTIVE": "క్రియాశీలం",

    // Tables
    "Contractor & Reg": "కాంట్రాక్టర్ & రిజిస్ట్రేషన్",
    "Work Agreement": "పని ఒప్పందం",
    "Contract Value (₹)": "ఒప్పందం విలువ (₹)",
    "Contract Value": "ఒప్పందం విలువ",
    "Contract Amount": "ఒప్పందం మొత్తం",
    "Start / Target Date": "ప్రారంభ / ముగింపు తేదీ",
    "Start Date": "ప్రారంభ తేదీ",
    "Target Date": "ముగింపు తేదీ",
    "Defect Liability": "లోపాల బాధ్యత వ్యవధి",
    "Contract Health": "ఒప్పందం ఆరోగ్యం",
    "Contract Health Legend:": "ఒప్పందం ఆరోగ్య సూచికలు:",
    "Active Public Contracts": "క్రియాశీల ప్రజా ఒప్పందాలు",
    "Actions": "చర్యలు",
    "Action": "చర్య",
    "View": "చూడండి",
    "View Details": "వివరాలు చూడండి",
    "Due:": "గడువు:",
    "Due": "గడువు",
    "36 Months": "36 నెలలు",
    "24 Months": "24 నెలలు",
    "12 Months": "12 నెలలు",
    "Assigned PWD Agency": "కేటాయించబడిన PWD ఏజెన్సీ",

    // Badges
    "Normal (On Schedule & Compliant)": "సాధారణం (సమయానికి & నిబంధనల ప్రకారం)",
    "Attention (<45d delay)": "శ్రద్ధ అవసరం (<45 రోజుల ఆలస్యం)",
    "High Risk (Significant lag)": "అధిక రిస్క్ (తీవ్ర ఆలస్యం)",
    "Critical (Default / Abandonment risk)": "తీవ్రమైనది (ఆగిపోయే ప్రమాదం)",
    "Under Progress": "పురోగతిలో ఉంది",
    "Completed": "పూర్తయింది",
    "Stalled Work": "ఆగిపోయిన పని",
    "Stalled": "ఆగిపోయింది",
    "Sanctioned": "మంజూరైంది",
    "Delayed": "ఆలస్యమైంది",
    "Normal": "సాధారణం",
    "Watch": "పరిశీలన",
    "High Risk": "అధిక రిస్క్",
    "Critical": "తీవ్రం",
    "Critical Surveillance": "తీవ్ర నిఘా",

    // Filters
    "Department:": "విభాగం:",
    "All States": "అన్ని రాష్ట్రాలు",
    "All Districts": "అన్ని జిల్లాలు",
    "Select State First": "ముందుగా రాష్ట్రాన్ని ఎంచుకోండి",
    "All Execution Statuses": "అన్ని పనుల స్థితిగతులు",
    "All AI Risk Levels": "అన్ని ఏఐ రిస్క్ స్థాయిలు",
    "Matching Works:": "సరిపోలే పనులు:",
    "Active Filters:": "క్రియాశీల ఫిల్టర్లు:",
    "Filtered Results:": "ఫిల్టర్ ఫలితాలు:",
    "Total": "మొత్తం",
    "Works": "పనులు",
    "Works Mapped": "మ్యాప్ చేయబడిన పనులు",
    "Reset Filters": "ఫిల్టర్లు రీసెట్ చేయండి",
    "Clear Search": "శోధనను తొలగించు",
    "Search": "వెతకండి",
    "Clear": "తొలగించు",
    "None (Showing nationwide works)": "ఏదీ లేదు (దేశవ్యాప్త పనులు చూపిస్తోంది)",

    // Metrics
    "Total Monitored Works": "మొత్తం పర్యవేక్షించబడుతున్న పనులు",
    "Sanctioned Funds": "మంజూరైన నిధులు",
    "Disbursed Funds": "విడుదలైన నిధులు",
    "Active Critical Alerts": "క్రియాశీల తీవ్ర హెచ్చరికలు",
    "Geotagged Verified Works": "జియోట్యాగ్ ధృవీకరించిన పనులు",
    "Sanctioned Amount": "మంజూరైన నిధులు",
    "Funds Released": "విడుదలైన నిధులు",
    "Funds Paid": "చెల్లించిన నిధులు",
    "Actual Expenditure": "వాస్తవ వ్యయం",
    "Unspent Balance": "ఖర్చుకాని నిధులు",
    "Fiscal Pipeline Overview": "ఆర్థిక పైప్‌లైన్ వివరణ",
    "Cumulative Sanctioned": "మొత్తం మంజూరైనవి",
    "Total Released from Ministry": "మంత్రిత్వ శాఖ విడుదల చేసిన మొత్తం",
    "Total Paid to Contractors": "కాంట్రాక్టర్లకు చెల్లించిన మొత్తం",
    "Unspent in District Escrows": "జిల్లా ఎస్క్రో ఖాతాల్లో ఉన్న నిధులు",
    "Physical Progress": "భౌతిక పురోగతి",
    "Progress Velocity": "పురోగతి వేగం",
    "Constituency & MP": "నియోజకవర్గం & ఎంపీ",
    "Work Title & Location": "పని పేరు & ప్రాంతం",
    "Project ID": "ప్రాజెక్ట్ ఐడీ",
    "Delay Days": "ఆలస్యమైన రోజులు",

    // Social Audit & Signboard
    "STATUTORY DIGITAL SIGNBOARD (SOCIAL AUDIT)": "చట్టబద్ధమైన డిజిటల్ సమాచార బోర్డు (సోషల్ ఆడిట్)",
    "As mandated by Section 3.16 of MoSPI MPLADS Guidelines": "MoSPI MPLADS మార్గదర్శకాల సెక్షన్ 3.16 ప్రకారం తప్పనిసరి",
    "Citizen Social Audit & Statutory Signboard": "పౌర సామాజిక ఆడిట్ & చట్టబద్ధమైన సమాచార బోర్డు",
    "Confirm Ground Reality": "క్షేత్ర వాస్తవాన్ని ధృవీకరించండి",
    "Report Discrepancy / Delay": "వ్యత్యాసం / ఆలస్యాన్ని నివేదించండి",
    "Record Field Inspection": "ఫీల్డ్ తనిఖీని నమోదు చేయండి",
    "Lodge Citizen Grievance": "పౌరుల ఫిర్యాదును నమోదు చేయండి",
    "Register Grievance": "ఫిర్యాదు నమోదు చేయండి",
    "Submit": "సమర్పించండి",
    "Cancel": "రద్దు చేయండి",
    "Close": "మూసివేయండి",
    "Save": "సేవ్ చేయండి",

    // Evidence
    "Geotagged Photographic Verification": "జియోట్యాగ్ ఫోటోగ్రాఫిక్ ధృవీకరణ",
    "Geotag Authenticated": "జియోట్యాగ్ ధృవీకరించబడింది",
    "Baseline / Inspection #1": "మొదటి తనిఖీ #1",
    "Recent Field Inspection": "ఇటీవలి ఫీల్డ్ తనిఖీ",
    "GPS Within": "GPS పరిధి",
    "CV Consistency": "కంప్యూటర్ విజన్ పోలిక",
    "PFMS Node Latency": "PFMS నోడ్ స్పందన సమయం",
    "e-SAKSHI & GeM APIs Connected": "e-SAKSHI & GeM APIలు అనుసంధానించబడ్డాయి",

    // Departments
    "Drinking Water": "తాగునీరు",
    "Education": "విద్య",
    "Healthcare": "వైద్యం",
    "Roads & Bridges": "రోడ్లు & వంతెనలు",
    "Renewable Energy": "పునరుత్పాదక శక్తి",
    "Irrigation & Water Bodies": "నీటిపారుదల & జలాశయాలు",
    "Sanitation & Waste": "పారిశుధ్యం & వ్యర్థాలు",
    "Community Assets": "సామాజిక భవనాలు",

    // Department Monitoring & Telemetry Extras
    "Department Intelligence Hub": "విభాగ నిఘా కేంద్రం",
    "8 Portfolios Mapped": "8 విభాగాలు మ్యాప్ చేయబడ్డాయి",
    "Departmental Monitoring Portals": "విభాగ పర్యవేక్షణ పోర్టల్స్",
    "Sector-specific intelligence dashboards configured with Indian administrative benchmarks, nodal executing agencies, and automated project milestone tracking.": "భారతీయ పరిపాలనా ప్రమాణాలు, నోడల్ అమలు ఏజెన్సీలు మరియు స్వయంచాలక ప్రాజెక్ట్ మైలురాయి ట్రాకింగ్‌తో కాన్ఫిగర్ చేయబడిన విభాగ డాష్‌బోర్డులు.",
    "Sync All Records": "అన్ని రికార్డులను సమకాలీకరించండి",
    "Drinking Water & Jal Jeevan": "తాగునీరు & జల్ జీవన్ మిషన్",
    "School Education & Literacy": "పాఠశాల విద్య & అక్షరాస్యత",
    "Healthcare & Public Health": "ఆరోగ్య సంరక్షణ & ప్రజారోగ్యం",
    "Roads, Bridges & Connectivity": "రోడ్లు, వంతెనలు & రవాణా",
    "Community Infrastructure & Halls": "సామాజిక మౌలిక సదుపాయాలు & భవనాలు",
    "Solar & Renewable Energy": "సౌర & పునరుత్పాదక శక్తి",
    "Irrigation & Water Conservation": "నీటిపారుదల & జల సంరక్షణ",
    "Sanitation & Solid Waste Management": "పారిశుధ్యం & ఘన వ్యర్థాల నిర్వహణ",
    "Community Infrastructure": "సామాజిక మౌలిక సదుపాయాలు",
    "Solar Energy": "సౌర శక్తి",
    "Irrigation": "నీటిపారుదల",
    "Sanitation": "పారిశుధ్యం",
    "Roads & PWD": "రోడ్లు & పీడబ్ల్యూడీ",
    "Sanitation (Swachh Bharat)": "పారిశుధ్యం (స్వచ్ఛ భారత్)",
    "Drinking Water (JJM)": "తాగునీరు (జల్ జీవన్)",
    "Healthcare (NHM)": "ఆరోగ్య సంరక్షణ (ఎన్‌హెచ్‌ఎం)",
    "Jal Jeevan Portfolio": "జల్ జీవన్ పోర్ట్‌ఫోలియో",
    "DISBURSED OUTLAY": "విడుదలైన వ్యయం",
    "Disbursed Outlay": "విడుదలైన వ్యయం",
    "AVG PHYSICAL VELOCITY": "సగటు భౌతిక వేగం",
    "Avg Physical Velocity": "సగటు భౌతిక వేగం",
    "COMPLETED & HANDOVER": "పూర్తయింది & అప్పగింత",
    "Completed & Handover": "పూర్తయింది & అప్పగింత",
    "UNDER EXECUTION": "పురోగతిలో ఉంది",
    "Under Execution": "పురోగతిలో ఉంది",
    "WATCHLIST WARNINGS": "పరిశీలన జాబితా హెచ్చరికలు",
    "Watchlist Warnings": "పరిశీలన జాబితా హెచ్చరికలు",
    "WATCHLIST": "పరిశీలన జాబితా",
    "Watchlist": "పరిశీలన జాబితా",
    "Needs verification audit": "ధృవీకరణ ఆడిట్ అవసరం",
    "MB Record verified": "ఎంబీ రికార్డు ధృవీకరించబడింది",
    "100% UC generated": "100% వినియోగ ధృవీకరణ పత్రం జారీ",
    "Under surveillance": "నిఘా పరిధిలో ఉంది",
    "schemes tracked": "పథకాలు పరిశీలించబడ్డాయి",
    "fund utilization": "నిధుల వినియోగం",
    "LIVE AUDIT": "లైవ్ ఆడిట్",
    "Spotlight: Community Hall (AP)": "ప్రత్యేక ప్రాజెక్ట్: కమ్యూనిటీ హాల్ (ఆంధ్రప్రదేశ్)",
    "52 Works • 10 States Active": "52 పనులు • 10 క్రియాశీల రాష్ట్రాలు",
    "TIRANGA SURVEILLANCE": "త్రివర్ణ నిఘా",
    "Across 10 States & 28 Districts": "10 రాష్ట్రాలు & 28 జిల్లాలలో",
    "Search works, MPs, IDs...": "పనులు, ఎంపీలు, ఐడీలు వెతకండి...",
    "Government of India": "భారత ప్రభుత్వం",
    "Ministry of Jal Shakti": "జల్ శక్తి మంత్రిత్వ శాఖ",
    "Rural Water Supply & Sanitation (RWSS)": "గ్రామీణ నీటి సరఫరా & పారిశుధ్యం",
    "Ministry of Education": "విద్యా మంత్రిత్వ శాఖ",
    "Ministry of Health & Family Welfare": "ఆరోగ్య & కుటుంబ సంక్షేమ మంత్రిత్వ శాఖ",
    "Ministry of Road Transport & Highways": "రహదారి రవాణా & రహదారుల మంత్రిత్వ శాఖ",
    "Ministry of Rural Development": "గ్రామీణాభివృద్ధి మంత్రిత్వ శాఖ",
    "Ministry of New & Renewable Energy": "నూతన & పునరుత్పాదక ఇంధన మంత్రిత్వ శాఖ",
    "Ministry of Housing & Urban Affairs": "గృహ & పట్టణ వ్యవహారాల మంత్రిత్వ శాఖ",
    "Standard:": "ప్రమాణం:",
    "Total Sanctioned": "మొత్తం మంజూరైన నిధులు",
    "Portfolio": "పోర్ట్‌ఫోలియో",
    "Execution Status:": "పని స్థితి:",
    "All Execution States": "అన్ని పని స్థితులు",
    "Stalled / Stagnated": "నిలిచిపోయిన పనులు",
    "Executing Agency:": "అమలు ఏజెన్సీ:",
    "Designated Nodal Agency": "నియమించబడిన నోడల్ ఏజెన్సీ",
    "Status": "స్థితి",
    "Physical": "భౌతిక పురోగతి",
    "Disbursed": "విడుదలైన మొత్తం",
    "days schedule slippage": "రోజుల షెడ్యూల్ ఆలస్యం",
    "Trace 360°": "ట్రేస్ 360°",
    "Inspect": "తనిఖీ చేయండి",
    "Grievance": "ఫిర్యాదు",
    "Retrieving": "సేకరిస్తోంది",
    "project ledgers...": "ప్రాజెక్ట్ రికార్డులు...",
    "works by Title, ID, District, or Contractor...": "శీర్షిక, ఐడీ, జిల్లా లేదా కాంట్రాక్టర్ ద్వారా పనులు...",
    "Milestone Photographic Verification:": "మైలురాయి ఫోటోగ్రాఫిక్ ధృవీకరణ:",
    "Open Live Camera & Take Photo": "లైవ్ కెమెరా తెరిచి ఫోటో తీయండి",
    "Upload Site Photo File": "సైట్ ఫోటో ఫైల్ అప్‌లోడ్ చేయండి",
    "Statutory Field Camera Viewfinder": "అధికారిక ఫీల్డ్ కెమెరా వ్యూఫైండర్",
    "Snap Photo & Watermark": "ఫోటో తీసి వాటర్‌మార్క్ చేయండి",
    "Flip Camera": "కెమెరా మార్చండి",
    "Upload File": "ఫైల్ అప్‌లోడ్ చేయండి",
  },
  ta: {
    // Navigation
    "Platform Home": "முகப்பு பக்கம்",
    "Departmental Portals": "துறைசார் இணையதளங்கள்",
    "Public Works Explorer": "பொதுப்பணி ஆய்வு மையம்",
    "Interactive India Map": "ஊடாடும் இந்திய வரைபடம்",
    "Fund Flow Intelligence & PFMS Disbursal Tracker": "நிதி ஓட்ட நுண்ணறிவு & PFMS வழங்கல் கண்காணிப்பாளர்",
    "Fund Flow Intelligence": "நிதி ஓட்ட நுண்ணறிவு",
    "Contracts Registry & SLA Monitoring": "ஒப்பந்தங்கள் பதிவேடு & SLA கண்காணிப்பு",
    "Contracts Registry": "ஒப்பந்தங்கள் பதிவேடு",
    "Contractor Intelligence & Performance Matrix": "ஒப்பந்ததாரர் நுண்ணறிவு & செயல்திறன் அணி",
    "Contractor Intelligence": "ஒப்பந்ததாரர் நுண்ணறிவு",
    "AI Risk & Early Warning Surveillance Center": "AI இடர் & முன்கூட்டிய எச்சரிக்கை கண்காணிப்பு மையம்",
    "AI Risk & Anomaly Center": "AI இடர் & ஒழுங்கின்மை மையம்",
    "Dispute Management & Settlement Engine": "சர்ச்சை மேலாண்மை & தீர்வு அமைப்பு",
    "Dispute Management": "சர்ச்சை மேலாண்மை",
    "Guarantee & Warranty Tracker": "உத்தரவாதம் & காரண்டி கண்காணிப்பாளர்",
    "Field Inspection & Geotag Verification Console": "கள ஆய்வு & ஜியோடேக் சரிபார்ப்பு தளம்",
    "Field Inspections (Mobile)": "கள ஆய்வுகள் (மொபைல்)",
    "Citizen Grievances & Redressal Tracking": "குடிமக்கள் குறைகள் & தீர்வு கண்காணிப்பு",
    "Citizen Grievances": "குடிமக்கள் குறைதீர்ப்பு",
    "Automated Alerts & Escalation Engine": "தானியங்கி எச்சரிக்கை மற்றும் அதிகரிப்பு எஞ்சின்",
    "Alert & Escalation Engine": "எச்சரிக்கை மற்றும் அதிகரிப்பு எஞ்சின்",
    "Executive Dossier & Statutory Report Generator": "கோப்பு மற்றும் அறிக்கை உருவாக்கி",
    "Dossier & Report Generator": "அறிக்கை உருவாக்கி",
    "Document Intelligence": "ஆவண நுண்ணறிவு",
    "Audit Trail & Logs": "தணிக்கை பாதை & பதிவுகள்",
    "Admin Data & Rules": "நிர்வாக தரவு மற்றும் விதிகள்",

    // Categories
    "Core Portals": "முதன்மை தளங்கள்",
    "Financials & Contracts": "நிதி மற்றும் ஒப்பந்தங்கள்",
    "AI & Risk Analytics": "AI மற்றும் இடர் பகுப்பாய்வு",
    "Ground Operations": "கள செயல்பாடுகள்",
    "Governance & Reports": "ஆளுகை மற்றும் அறிக்கைகள்",
    "Administration": "நிர்வாகம்",

    // Roles
    "Role: Citizen": "பங்கு: குடிமகன்",
    "Role: Field Officer / Inspector": "பங்கு: கள அதிகாரி / ஆய்வாளர்",
    "Role: District Authority": "பங்கு: மாவட்ட நிர்வாகம்",
    "Role: Higher Authority / Admin": "பங்கு: உயர் அதிகாரி / நிர்வாகி",
    "Citizen": "குடிமகன்",
    "Field Officer / Inspector": "கள அதிகாரி / ஆய்வாளர்",
    "Field Officer": "கள அதிகாரி",
    "District Authority": "மாவட்ட நிர்வாகம்",
    "Higher Authority / Admin": "உயர் அதிகாரி / நிர்வாகி",

    // Tables
    "Contractor & Reg": "ஒப்பந்ததாரர் & பதிவு",
    "Work Agreement": "பணி ஒப்பந்தம்",
    "Contract Value (₹)": "ஒப்பந்த மதிப்பு (₹)",
    "Contract Value": "ஒப்பந்த மதிப்பு",
    "Contract Amount": "ஒப்பந்த தொகை",
    "Start / Target Date": "தொடக்க / இலக்கு தேதி",
    "Start Date": "தொடக்க தேதி",
    "Target Date": "இலக்கு தேதி",
    "Defect Liability": "குறைபாடு பொறுப்பு",
    "Contract Health": "ஒப்பந்த நிலை",
    "Contract Health Legend:": "ஒப்பந்த நிலை விளக்கம்:",
    "Active Public Contracts": "செயலில் உள்ள பொது ஒப்பந்தங்கள்",
    "Actions": "செயல்கள்",
    "Action": "செயல்",
    "View": "பார்",
    "View Details": "விவரங்களை பார்க்க",
    "Due:": "இறுதி நாள்:",

    // Statuses
    "Normal (On Schedule & Compliant)": "சாதாரணமானது (சரியான நேரத்தில் & விதிகளின்படி)",
    "Attention (<45d delay)": "கவனம் (<45 நாட்கள் தாமதம்)",
    "High Risk (Significant lag)": "அதிக ஆபத்து (குறிப்பிடத்தக்க பின்னடைவு)",
    "Critical (Default / Abandonment risk)": "மிகவும் தீவிரமானது (கைவிடப்படும் அபாயம்)",
    "Under Progress": "முன்னேற்றத்தில் உள்ளது",
    "Completed": "நிறைவடைந்தது",
    "Stalled Work": "முடங்கிய பணி",
    "Stalled": "முடங்கியது",
    "Normal": "சாதாரண",
    "Watch": "கண்காணிப்பு",
    "High Risk": "அதிக ஆபத்து",
    "Critical": "தீவிரமானது",

    // Filters
    "Department:": "துறை:",
    "All States": "அனைத்து மாநிலங்கள்",
    "All Districts": "அனைத்து மாவட்டங்கள்",
    "Select State First": "முதலில் மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
    "All Execution Statuses": "அனைத்து செயல்பாட்டு நிலைகள்",
    "All AI Risk Levels": "அனைத்து AI இடர் நிலைகள்",
    "Matching Works:": "பொருந்திய பணிகள்:",
    "Active Filters:": "செயலில் உள்ள வடிப்பான்கள்:",
    "Reset Filters": "வடிப்பான்களை மீட்டமைக்கவும்",
    "Clear Search": "தேடலை அழி",
    "Search": "தேடு",
    "Clear": "அழி",

    // Metrics
    "Total Monitored Works": "மொத்த கண்காணிக்கப்படும் பணிகள்",
    "Sanctioned Funds": "ஒப்புதல் அளிக்கப்பட்ட நிதி",
    "Disbursed Funds": "வெளியிடப்பட்ட நிதி",
    "Active Critical Alerts": "செயலில் உள்ள தீவிர எச்சரிக்கைகள்",
    "Sanctioned Amount": "ஒப்புதல் அளிக்கப்பட்ட தொகை",
    "Funds Released": "வெளியிடப்பட்ட நிதி",
    "Funds Paid": "செலுத்தப்பட்ட நிதி",
    "Actual Expenditure": "உண்மையான செலவு",

    // Actions
    "Confirm Ground Reality": "கள யதார்த்தத்தை உறுதிப்படுத்தவும்",
    "Report Discrepancy / Delay": "முரண்பாடு / தாமதத்தைப் புகாரளிக்கவும்",
    "Record Field Inspection": "கள ஆய்வை பதிவு செய்யவும்",
    "Lodge Citizen Grievance": "குடிமக்கள் குறையை பதிவு செய்யவும்",
    "Register Grievance": "குறையைப் பதிவு செய்யவும்",
    "Submit": "சமர்ப்பிக்கவும்",
    "Cancel": "ரத்து செய்",
    "Close": "மூடு",

    // Departments
    "Drinking Water": "குடிநீர்",
    "Education": "கல்வி",
    "Healthcare": "சுகாதாரம்",
    "Roads & Bridges": "சாலைகள் மற்றும் பாலங்கள்",
    "Renewable Energy": "புதுப்பிக்கத்தக்க ஆற்றல்",
    "Irrigation & Water Bodies": "நீர்ப்பாசனம் & நீர்நிலைகள்",
    "Sanitation & Waste": "சுகாதாரம் & கழிவு",
    "Community Assets": "சமூக சொத்துக்கள்",

    // Department Monitoring & Telemetry Extras
    "Department Intelligence Hub": "துறைசார் நுண்ணறிவு மையம்",
    "8 Portfolios Mapped": "8 துறைகள் இணைக்கப்பட்டுள்ளன",
    "Departmental Monitoring Portals": "துறைசார் கண்காணிப்பு இணையதளங்கள்",
    "Sector-specific intelligence dashboards configured with Indian administrative benchmarks, nodal executing agencies, and automated project milestone tracking.": "இந்திய நிர்வாக அளவுகோல்கள், நோடல் செயல்படுத்தும் முகமைகள் மற்றும் தானியங்கி திட்ட மைல்கல் கண்காணிப்புடன் கட்டமைக்கப்பட்ட துறைசார் டாஷ்போர்டுகள்.",
    "Sync All Records": "அனைத்து பதிவுகளையும் ஒத்திசை",
    "Drinking Water & Jal Jeevan": "குடிநீர் மற்றும் ஜல் ஜீவன் இயக்கம்",
    "School Education & Literacy": "பள்ளிக் கல்வி மற்றும் எழுத்தறிவு",
    "Healthcare & Public Health": "சுகாதாரம் மற்றும் பொது சுகாதாரம்",
    "Roads, Bridges & Connectivity": "சாலைகள், பாலங்கள் மற்றும் இணைப்பு",
    "Community Infrastructure & Halls": "சமூக உள்கட்டமைப்பு மற்றும் அரங்குகள்",
    "Solar & Renewable Energy": "சூரிய மற்றும் புதுப்பிக்கத்தக்க ஆற்றல்",
    "Irrigation & Water Conservation": "நீர்ப்பாசனம் மற்றும் நீர் பாதுகாப்பு",
    "Sanitation & Solid Waste Management": "சுகாதாரம் மற்றும் திடக் கழிவு மேலாண்மை",
    "Community Infrastructure": "சமூக உள்கட்டமைப்பு",
    "Solar Energy": "சூரிய ஆற்றல்",
    "Irrigation": "நீர்ப்பாசனம்",
    "Sanitation": "சுகாதாரம்",
    "Roads & PWD": "சாலைகள் & பொதுப்பணித்துறை",
    "Sanitation (Swachh Bharat)": "சுகாதாரம் (தூய்மை இந்தியா)",
    "Drinking Water (JJM)": "குடிநீர் (ஜேஜேஎம்)",
    "Healthcare (NHM)": "சுகாதாரம் (என்எச்எம்)",
    "Jal Jeevan Portfolio": "ஜல் ஜீவன் போர்ட்ஃபோலியோ",
    "DISBURSED OUTLAY": "வழங்கப்பட்ட செலவினம்",
    "Disbursed Outlay": "வழங்கப்பட்ட செலவினம்",
    "AVG PHYSICAL VELOCITY": "சராசரி கள முன்னேற்ற வேகம்",
    "Avg Physical Velocity": "சராசரி கள முன்னேற்ற வேகம்",
    "COMPLETED & HANDOVER": "முடிக்கப்பட்டு ஒப்படைக்கப்பட்டது",
    "Completed & Handover": "முடிக்கப்பட்டு ஒப்படைக்கப்பட்டது",
    "UNDER EXECUTION": "செயல்பாட்டில் உள்ள பணிகள்",
    "Under Execution": "செயல்பாட்டில் உள்ள பணிகள்",
    "WATCHLIST WARNINGS": "கண்காணிப்புப் பட்டியல் எச்சரிக்கைகள்",
    "Watchlist Warnings": "கண்காணிப்புப் பட்டியல் எச்சரிக்கைகள்",
    "WATCHLIST": "கண்காணிப்புப் பட்டியல்",
    "Watchlist": "கண்காணிப்புப் பட்டியல்",
    "Needs verification audit": "சரிபார்ப்பு தணிக்கை தேவை",
    "MB Record verified": "அளவீட்டுப் புத்தகப் பதிவு சரிபார்க்கப்பட்டது",
    "100% UC generated": "100% பயன்பாட்டுச் சான்றிதழ் உருவாக்கப்பட்டது",
    "Under surveillance": "கண்காணிப்பில் உள்ளது",
    "schemes tracked": "திட்டங்கள் கண்காணிக்கப்படுகின்றன",
    "fund utilization": "நிதி பயன்பாடு",
    "LIVE AUDIT": "நேரலைத் தணிக்கை",
    "Execution Status:": "செயல்பாட்டு நிலை:",
    "All Execution States": "அனைத்து செயல்பாட்டு நிலைகள்",
    "Stalled / Stagnated": "முடக்கப்பட்ட பணிகள்",
    "Executing Agency:": "செயல்படுத்தும் முகமை:",
    "Designated Nodal Agency": "நியமிக்கப்பட்ட நோடல் முகமை",
    "Sanctioned": "ஒப்புதல் அளிக்கப்பட்டது",
    "Status": "நிலை",
    "Physical": "கள முன்னேற்றம்",
    "Disbursed": "வழங்கப்பட்டது",
    "days schedule slippage": "நாட்கள் கால அட்டவணை தாமதம்",
    "Trace 360°": "டிரேஸ் 360°",
    "Inspect": "ஆய்வு செய்",
    "Grievance": "குறைதீர்ப்பு",
    "Retrieving": "மீட்டெடுக்கிறது",
    "project ledgers...": "திட்டப் பதிவேடுகள்...",
    "works by Title, ID, District, or Contractor...": "தலைப்பு, ஐடி, மாவட்டம் அல்லது ஒப்பந்ததாரர் மூலம் பணிகள்...",
    "Total Sanctioned": "மொத்த அனுமதிக்கப்பட்ட நிதி",
    "Portfolio": "துறைப் பிரிவு",
    "Standard:": "தரநிலை:",
  },
  bn: {
    // Navigation
    "Platform Home": "মূল পাতা",
    "Departmental Portals": "বিভাগীয় পোর্টাল",
    "Public Works Explorer": "পাবলিক ওয়ার্কস এক্সপ্লোরার",
    "Interactive India Map": "ইন্টারেক্টিভ ভারত মানচিত্র",
    "Fund Flow Intelligence & PFMS Disbursal Tracker": "তহবিল প্রবাহ গোয়েন্দা ও পিএফএমএস বিতরণ ট্র্যাকার",
    "Fund Flow Intelligence": "তহবিল প্রবাহ গোয়েন্দা",
    "Contracts Registry & SLA Monitoring": "চুক্তি রেজিস্ট্রি এবং এসএলএ পর্যবেক্ষণ",
    "Contracts Registry": "চুক্তি রেজিস্ট্রি",
    "Contractor Intelligence & Performance Matrix": "ঠিকাদার বুদ্ধিমত্তা ও কর্মক্ষমতা ম্যাট্রিক্স",
    "Contractor Intelligence": "ঠিকাদার বুদ্ধিমত্তা",
    "AI Risk & Early Warning Surveillance Center": "এআই ঝুঁকি ও প্রাথমিক সতর্কতা নজরদারি কেন্দ্র",
    "AI Risk & Anomaly Center": "এআই ঝুঁকি ও অসঙ্গতি কেন্দ্র",
    "Dispute Management & Settlement Engine": "বিরোধ নিষ্পত্তি ইঞ্জিন",
    "Dispute Management": "বিরোধ ব্যবস্থাপনা",
    "Guarantee & Warranty Tracker": "গ্যারান্টি এবং ওয়ারেন্টি ট্র্যাকার",
    "Field Inspection & Geotag Verification Console": "মাঠ পরিদর্শন ও জিওট্যাগ যাচাই কনসোল",
    "Field Inspections (Mobile)": "মাঠ পরিদর্শন (মোবাইল)",
    "Citizen Grievances & Redressal Tracking": "নাগরিক অভিযোগ ও প্রতিকার ট্র্যাকিং",
    "Citizen Grievances": "নাগরিক অভিযোগ",
    "Automated Alerts & Escalation Engine": "স্বয়ংক্রিয় সতর্কতা ও বৃদ্ধি ইঞ্জিন",
    "Alert & Escalation Engine": "সতর্কতা এবং বৃদ্ধি ইঞ্জিন",
    "Executive Dossier & Statutory Report Generator": "ডজিয়ার এবং সংবিধিবদ্ধ রিপোর্ট জেনারেটর",
    "Dossier & Report Generator": "ডজিয়ার এবং রিপোর্ট জেনারেটর",
    "Document Intelligence": "নথিপত্র বুদ্ধিমত্তা",
    "Audit Trail & Logs": "অডিট ট্রেইল এবং লগ",
    "Admin Data & Rules": "প্রশাসনিক ডেটা ও নিয়মাবলী",

    // Categories
    "Core Portals": "প্রধান পোর্টাল",
    "Financials & Contracts": "আর্থিক ও চুক্তি",
    "AI & Risk Analytics": "এআই ও ঝুঁকি বিশ্লেষণ",
    "Ground Operations": "মাঠ পর্যায়ের কার্যক্রম",
    "Governance & Reports": "শাসন ও প্রতিবেদন",
    "Administration": "প্রশাসন",

    // Roles
    "Role: Citizen": "ভূমিকা: নাগরিক",
    "Role: Field Officer / Inspector": "ভূমিকা: মাঠ কর্মকর্তা",
    "Role: District Authority": "ভূমিকা: জেলা কর্তৃপক্ষ",
    "Role: Higher Authority / Admin": "ভূমিকা: উচ্চ কর্তৃপক্ষ / প্রশাসক",
    "Citizen": "নাগরিক",
    "Field Officer": "মাঠ কর্মকর্তা",
    "District Authority": "জেলা কর্তৃপক্ষ",
    "Higher Authority / Admin": "উচ্চ কর্তৃপক্ষ / প্রশাসক",

    // Tables
    "Contractor & Reg": "ঠিকাদার ও নিবন্ধন",
    "Work Agreement": "কাজের চুক্তি",
    "Contract Value (₹)": "চুক্তিমূল্য (₹)",
    "Contract Value": "চুক্তিমূল্য",
    "Contract Amount": "চুক্তির পরিমাণ",
    "Start / Target Date": "শুরু / লক্ষ্য তারিখ",
    "Defect Liability": "ত্রুটি দায়বদ্ধতা",
    "Contract Health": "চুক্তির স্বাস্থ্য",
    "Contract Health Legend:": "চুক্তির স্বাস্থ্য নির্দেশক:",
    "Active Public Contracts": "সক্রিয় পাবলিক চুক্তি",
    "Actions": "পদক্ষেপ",
    "View": "দেখুন",
    "View Details": "বিস্তারিত দেখুন",
    "Due:": "বাকি:",

    // Badges & Statuses
    "Normal (On Schedule & Compliant)": "স্বাভাবিক (সময়ে এবং সঙ্গতিপূর্ণ)",
    "Attention (<45d delay)": "সতর্কতা (<৪৫ দিন বিলম্ব)",
    "High Risk (Significant lag)": "উচ্চ ঝুঁকি (উল্লেখযোগ্য ব্যবধান)",
    "Critical (Default / Abandonment risk)": "সংকটজনক (পরিত্যাগের ঝুঁকি)",
    "Under Progress": "চলমান",
    "Completed": "সম্পন্ন",
    "Stalled Work": "স্থবির কাজ",
    "Normal": "স্বাভাবিক",
    "Watch": "নজরদারি",
    "High Risk": "উচ্চ ঝুঁকি",
    "Critical": "সংকটজনক",

    // Filters
    "Department:": "বিভাগ:",
    "All States": "সকল রাজ্য",
    "All Districts": "সকল জেলা",
    "Select State First": "প্রথমে রাজ্য নির্বাচন করুন",
    "Matching Works:": "মেলে যাওয়া কাজ:",
    "Active Filters:": "সক্রিয় ফিল্টার:",
    "Reset Filters": "ফিল্টার পুনরায় সেট করুন",
    "Clear Search": "অনুসন্ধান মুছুন",
    "Search": "অনুসন্ধান",
    "Clear": "মুছুন",

    // Metrics
    "Total Monitored Works": "মোট পর্যবেক্ষণাধীন কাজ",
    "Sanctioned Funds": "অনুমোদিত তহবিল",
    "Disbursed Funds": "বিতরণকৃত তহবিল",
    "Active Critical Alerts": "সক্রিয় গুরুতর সতর্কতা",
    "Sanctioned Amount": "অনুমোদিত অর্থ",
    "Funds Released": "মুক্ত তহবিল",
    "Funds Paid": "প্রদত্ত অর্থ",
    "Actual Expenditure": "প্রকৃত ব্যয়",

    // Actions
    "Confirm Ground Reality": "মাঠের বাস্তবতা নিশ্চিত করুন",
    "Report Discrepancy / Delay": "অসঙ্গতি / বিলম্ব রিপোর্ট করুন",
    "Record Field Inspection": "মাঠ পরিদর্শন রেকর্ড করুন",
    "Register Grievance": "অভিযোগ দায়ের করুন",
    "Submit": "জমা দিন",
    "Cancel": "বাতিল করুন",
    "Close": "বন্ধ করুন",

    // Departments
    "Drinking Water": "পানীয় জল",
    "Education": "শিক্ষা",
    "Healthcare": "স্বাস্থ্যসেবা",
    "Roads & Bridges": "রাস্তা ও সেতু",
    "Renewable Energy": "নবায়নযোগ্য শক্তি",
    "Irrigation & Water Bodies": "সেচ ও জলাশয়",
    "Sanitation & Waste": "অনাক্রম্যতা ও বর্জ্য",
    "Community Assets": "সম্প্রদায় সম্পদ",

    // Department Monitoring & Telemetry Extras
    "Department Intelligence Hub": "বিভাগীয় গোয়েন্দা হাব",
    "8 Portfolios Mapped": "৮টি পোর্টফোলিও ম্যাপ করা হয়েছে",
    "Departmental Monitoring Portals": "বিভাগীয় পর্যবেক্ষণ পোর্টাল",
    "Sector-specific intelligence dashboards configured with Indian administrative benchmarks, nodal executing agencies, and automated project milestone tracking.": "ভারতীয় প্রশাসনিক মানদণ্ড, নোডাল নির্বাহী সংস্থা এবং স্বয়ংক্রিয় প্রকল্প মাইলফলক ট্র্যাকিং সহ কনফিগার করা ক্ষেত্র-নির্দিষ্ট ড্যাশবোর্ড।",
    "Sync All Records": "সমস্ত রেকর্ড সিঙ্ক করুন",
    "Drinking Water & Jal Jeevan": "পানীয় জল ও জল জীবন মিশন",
    "School Education & Literacy": "বিদ্যালয় শিক্ষা ও সাক্ষরতা",
    "Healthcare & Public Health": "স্বাস্থ্যসেবা ও জনস্বাস্থ্য",
    "Roads, Bridges & Connectivity": "রাস্তা, সেতু ও সংযোগ",
    "Community Infrastructure & Halls": "কমিউনিটি অবকাঠামো ও হল",
    "Solar & Renewable Energy": "সৌর ও নবায়নযোগ্য শক্তি",
    "Irrigation & Water Conservation": "সেচ ও জল সংরক্ষণ",
    "Sanitation & Solid Waste Management": "অনাক্রম্যতা ও কঠিন বর্জ্য ব্যবস্থাপনা",
    "Community Infrastructure": "কমিউনিটি অবকাঠামো",
    "Solar Energy": "সৌর শক্তি",
    "Irrigation": "সেচ",
    "Sanitation": "অনাক্রম্যতা",
    "Roads & PWD": "রাস্তা ও পিডব্লিউডি",
    "Sanitation (Swachh Bharat)": "অনাক্রম্যতা (স্বচ্ছ ভারত)",
    "Drinking Water (JJM)": "পানীয় জল (জেজেএম)",
    "Healthcare (NHM)": "স্বাস্থ্যসেবা (এনএইচএম)",
    "Jal Jeevan Portfolio": "জল জীবন পোর্টফোলিও",
    "DISBURSED OUTLAY": "বিতরণকৃত ব্যয়",
    "Disbursed Outlay": "বিতরণকৃত ব্যয়",
    "AVG PHYSICAL VELOCITY": "গড় বাস্তব অগ্রগতি",
    "Avg Physical Velocity": "গড় বাস্তব অগ্রগতি",
    "COMPLETED & HANDOVER": "সম্পূর্ণ ও হস্তান্তর",
    "Completed & Handover": "সম্পূর্ণ ও হস্তান্তর",
    "UNDER EXECUTION": "চলমান কাজ",
    "Under Execution": "চলমান কাজ",
    "WATCHLIST WARNINGS": "নজরদারি তালিকা সতর্কতা",
    "Watchlist Warnings": "নজরদারি তালিকা সতর্কতা",
    "WATCHLIST": "নজরদারি তালিকা",
    "Watchlist": "নজরদারি তালিকা",
    "Needs verification audit": "যাচাইকরণ অডিট প্রয়োজন",
    "MB Record verified": "এমবি রেকর্ড যাচাইকৃত",
    "100% UC generated": "১০০% ইউসি তৈরি হয়েছে",
    "Under surveillance": "নজরদারির অধীনে",
    "schemes tracked": "প্রকল্প পর্যবেক্ষণ করা হচ্ছে",
    "fund utilization": "তহবিল ব্যবহার",
    "LIVE AUDIT": "লাইভ অডিট",
    "Spotlight: Community Hall (AP)": "বিশেষ নজর: কমিউনিটি হল (অন্ধ্রপ্রদেশ)",
    "52 Works • 10 States Active": "৫২টি কাজ • ১০টি সক্রিয় রাজ্য",
    "TIRANGA SURVEILLANCE": "তেরঙ্গা নজরদারি",
    "Across 10 States & 28 Districts": "১০টি রাজ্য ও ২৮টি জেলা জুড়ে",
    "Search works, MPs, IDs...": "কাজ, এমপি, আইডি অনুসন্ধান করুন...",
    "Government of India": "ভারত সরকার",
    "Ministry of Jal Shakti": "জলশক্তি মন্ত্রক",
    "Rural Water Supply & Sanitation (RWSS)": "গ্রামীণ জল সরবরাহ ও পয়ঃনিষ্কাশন",
    "Ministry of Education": "শিক্ষা মন্ত্রক",
    "Ministry of Health & Family Welfare": "স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রক",
    "Ministry of Road Transport & Highways": "সড়ক পরিবহন ও মহাসড়ক মন্ত্রক",
    "Ministry of Rural Development": "পল্লী উন্নয়ন মন্ত্রক",
    "Ministry of New & Renewable Energy": "নতুন ও নবায়নযোগ্য শক্তি মন্ত্রক",
    "Ministry of Housing & Urban Affairs": "আবাসন ও নগর বিষয়ক মন্ত্রক",
    "Standard:": "মানদণ্ড:",
    "Total Sanctioned": "মোট অনুমোদিত",
    "Portfolio": "পোর্টফোলিও",
    "Execution Status:": "কাজের স্থিতি:",
    "All Execution States": "সমস্ত কাজের স্থিতি",
    "Stalled / Stagnated": "স্থবির / আটকে থাকা কাজ",
    "Executing Agency:": "নির্বাহী সংস্থা:",
    "Designated Nodal Agency": "মনোনীত নোডাল সংস্থা",
    "Sanctioned": "অনুমোদিত",
    "Status": "স্থিতি",
    "Physical": "বাস্তব অগ্রগতি",
    "Disbursed": "বিতরণকৃত",
    "days schedule slippage": "দিন সময়সূচী বিলম্ব",
    "Trace 360°": "ট্রেস ৩৬০°",
    "Inspect": "পরিদর্শন",
    "Grievance": "অভিযোগ",
    "Retrieving": "পুনরুদ্ধার করা হচ্ছে",
    "project ledgers...": "প্রকল্প লেজার...",
    "works by Title, ID, District, or Contractor...": "শিরোনাম, আইডি, জেলা বা ঠিকাদার দ্বারা কাজ...",
  },
  mr: {
    // Navigation
    "Platform Home": "मुख्य पृष्ठ",
    "Departmental Portals": "विभागीय पोर्टल",
    "Public Works Explorer": "सार्वजनिक कामे शोधक",
    "Interactive India Map": "परस्परसंवादी भारत नकाशा",
    "Fund Flow Intelligence & PFMS Disbursal Tracker": "निधी प्रवाह बुद्धिमत्ता आणि PFMS वितरण ट्रॅकर",
    "Fund Flow Intelligence": "निधी प्रवाह बुद्धिमत्ता",
    "Contracts Registry & SLA Monitoring": "कंत्राट नोंदणी आणि SLA देखरेख",
    "Contracts Registry": "कंत्राट नोंदणी",
    "Contractor Intelligence & Performance Matrix": "कंत्राटदार बुद्धिमत्ता आणि कामगिरी मॅट्रिक्स",
    "Contractor Intelligence": "कंत्राटदार बुद्धिमत्ता",
    "AI Risk & Early Warning Surveillance Center": "AI जोखीम आणि पूर्वसूचना पाळत ठेवणे केंद्र",
    "AI Risk & Anomaly Center": "AI जोखीम आणि विसंगती केंद्र",
    "Dispute Management & Settlement Engine": "तंटा निवारण यंत्रणा",
    "Dispute Management": "तंटा निवारण",
    "Guarantee & Warranty Tracker": "हमी आणि वॉरंटी ट्रॅकर",
    "Field Inspection & Geotag Verification Console": "फील्ड तपासणी व जिओटॅग पडताळणी कन्सोल",
    "Field Inspections (Mobile)": "फील्ड तपासणी (मोबाइल)",
    "Citizen Grievances & Redressal Tracking": "नागरिक तक्रारी आणि निवारण ट्रॅकिंग",
    "Citizen Grievances": "नागरिक तक्रारी",
    "Automated Alerts & Escalation Engine": "स्वयंचलित सतर्कता आणि वाढ इंजिन",
    "Alert & Escalation Engine": "सतर्कता आणि वाढ इंजिन",
    "Executive Dossier & Statutory Report Generator": "दस्तऐवज आणि अहवाल जनरेटर",
    "Dossier & Report Generator": "दस्तऐवज आणि अहवाल जनरेटर",
    "Document Intelligence": "दस्तऐवज विश्लेषण",
    "Audit Trail & Logs": "ऑडिट ट्रेल आणि नोंदी",
    "Admin Data & Rules": "प्रशासकीय डेटा आणि नियम",

    // Categories
    "Core Portals": "मुख्य पोर्टल",
    "Financials & Contracts": "आर्थिक आणि कंत्राटे",
    "AI & Risk Analytics": "AI आणि जोखीम विश्लेषण",
    "Ground Operations": "जमिनीवरील कामे",
    "Governance & Reports": "प्रशासन आणि अहवाल",
    "Administration": "प्रशासन",

    // Roles
    "Role: Citizen": "भूमिका: नागरिक",
    "Role: Field Officer / Inspector": "भूमिका: क्षेत्रीय अधिकारी",
    "Role: District Authority": "भूमिका: जिल्हा प्राधिकारी",
    "Role: Higher Authority / Admin": "भूमिका: उच्च अधिकारी / प्रशासक",
    "Citizen": "नागरिक",
    "Field Officer": "क्षेत्रीय अधिकारी",
    "District Authority": "जिल्हा प्राधिकारी",
    "Higher Authority / Admin": "उच्च अधिकारी / प्रशासक",

    // Tables
    "Contractor & Reg": "कंत्राटदार आणि नोंदणी",
    "Work Agreement": "कामाचा करार",
    "Contract Value (₹)": "कंत्राट मूल्य (₹)",
    "Contract Value": "कंत्राट मूल्य",
    "Contract Amount": "कंत्राट रक्कम",
    "Start / Target Date": "सुरुवात / लक्ष्य तारीख",
    "Defect Liability": "दोष दायित्व कालावधी",
    "Contract Health": "कंत्राट आरोग्य",
    "Contract Health Legend:": "कंत्राट आरोग्य सूची:",
    "Active Public Contracts": "सक्रिय सार्वजनिक कंत्राटे",
    "Actions": "कृती",
    "View": "पहा",
    "View Details": "तपशील पहा",
    "Due:": "मुदत:",

    // Badges & Statuses
    "Normal (On Schedule & Compliant)": "सामान्य (वेळेवर आणि सुसंगत)",
    "Attention (<45d delay)": "लक्ष द्या (<४५ दिवस विलंब)",
    "High Risk (Significant lag)": "उच्च जोखीम (मोठा विलंब)",
    "Critical (Default / Abandonment risk)": "गंभीर (कामे सोडण्याचा धोका)",
    "Under Progress": "प्रगतीपथावर",
    "Completed": "पूर्ण झाले",
    "Stalled Work": "रखडलेले काम",
    "Normal": "सामान्य",
    "Watch": "निगरानी",
    "High Risk": "उच्च जोखीम",
    "Critical": "गंभीर",

    // Filters
    "Department:": "विभाग:",
    "All States": "सर्व राज्ये",
    "All Districts": "सर्व जिल्हे",
    "Select State First": "प्रथम राज्य निवडा",
    "Matching Works:": "जुळणारी कामे:",
    "Active Filters:": "सक्रिय फिल्टर्स:",
    "Reset Filters": "फिल्टर रीसेट करा",
    "Clear Search": "शोध हटवा",
    "Search": "शोधा",
    "Clear": "हटवा",

    // Metrics
    "Total Monitored Works": "एकूण देखरेखीखालील कामे",
    "Sanctioned Funds": "मंजूर निधी",
    "Disbursed Funds": "वितरित निधी",
    "Active Critical Alerts": "सक्रिय गंभीर इशारे",
    "Sanctioned Amount": "मंजूर निधी",
    "Funds Released": "वितरित निधी",
    "Funds Paid": "अदा केलेला निधी",
    "Actual Expenditure": "प्रत्यक्ष खर्च",

    // Actions
    "Confirm Ground Reality": "जमिनीवरील वास्तवाची पुष्टी करा",
    "Report Discrepancy / Delay": "विसंगती / विलंब नोंदवा",
    "Record Field Inspection": "फील्ड तपासणी नोंदवा",
    "Register Grievance": "तक्रार नोंदवा",
    "Submit": "सबमिट करा",
    "Cancel": "रद्द करा",
    "Close": "बंद करा",

    // Departments
    "Drinking Water": "पिण्याचे पाणी",
    "Education": "शिक्षण",
    "Healthcare": "आरोग्य",
    "Roads & Bridges": "रस्ते आणि पूल",
    "Renewable Energy": "अक्षय ऊर्जा",
    "Irrigation & Water Bodies": "सिंचन आणि जलस्रोत",
    "Sanitation & Waste": "स्वच्छता आणि कचरा",
    "Community Assets": "सामुदायिक मालमत्ता",

    // Department Monitoring & Telemetry Extras
    "Department Intelligence Hub": "विभागीय गुप्तवार्ता केंद्र",
    "8 Portfolios Mapped": "8 पोर्टफोलिओ जोडले",
    "Departmental Monitoring Portals": "विभागीय देखरेख पोर्टल",
    "Sector-specific intelligence dashboards configured with Indian administrative benchmarks, nodal executing agencies, and automated project milestone tracking.": "भारतीय प्रशासकीय निकष, नोडल अंमलबजावणी यंत्रणा आणि स्वयंचलित प्रकल्प टप्पे ट्रॅकिंगसह तयार केलेले क्षेत्र-विशिष्ट डॅशबोर्ड.",
    "Sync All Records": "सर्व नोंदी सिंक करा",
    "Drinking Water & Jal Jeevan": "पिण्याचे पाणी आणि जल जीवन मिशन",
    "School Education & Literacy": "शालेय शिक्षण आणि साक्षरता",
    "Healthcare & Public Health": "आरोग्य सेवा आणि सार्वजनिक आरोग्य",
    "Roads, Bridges & Connectivity": "रस्ते, पूल आणि संपर्क",
    "Community Infrastructure & Halls": "सामुदायिक पायाभूत सुविधा आणि सभागृह",
    "Solar & Renewable Energy": "सौर आणि अक्षय ऊर्जा",
    "Irrigation & Water Conservation": "सिंचन आणि जलसंधारण",
    "Sanitation & Solid Waste Management": "स्वच्छता आणि घनकचरा व्यवस्थापन",
    "Community Infrastructure": "सामुदायिक पायाभूत सुविधा",
    "Solar Energy": "सौर ऊर्जा",
    "Irrigation": "सिंचन",
    "Sanitation": "स्वच्छता",
    "Roads & PWD": "रस्ते आणि सार्वजनिक बांधकाम",
    "Sanitation (Swachh Bharat)": "स्वच्छता (स्वच्छ भारत)",
    "Drinking Water (JJM)": "पिण्याचे पाणी (जेजेएम)",
    "Healthcare (NHM)": "आरोग्य सेवा (एनएचएम)",
    "Jal Jeevan Portfolio": "जल जीवन पोर्टफोलिओ",
    "DISBURSED OUTLAY": "वितरित खर्च",
    "Disbursed Outlay": "वितरित खर्च",
    "AVG PHYSICAL VELOCITY": "सरासरी भौतिक प्रगती गती",
    "Avg Physical Velocity": "सरासरी भौतिक प्रगती गती",
    "COMPLETED & HANDOVER": "पूर्ण आणि हस्तांतरित",
    "Completed & Handover": "पूर्ण आणि हस्तांतरित",
    "UNDER EXECUTION": "प्रगतीपथावर कामे",
    "Under Execution": "प्रगतीपथावर कामे",
    "WATCHLIST WARNINGS": "निगरानी सूची इशारे",
    "Watchlist Warnings": "निगरानी सूची इशारे",
    "WATCHLIST": "निगरानी सूची",
    "Watchlist": "निगरानी सूची",
    "Needs verification audit": "पडताळणी ऑडिट आवश्यक",
    "MB Record verified": "एमबी नोंद पडताळली",
    "100% UC generated": "100% उपयोगिता प्रमाणपत्र तयार",
    "Under surveillance": "देखरेखीखाली",
    "schemes tracked": "योजनांचा मागोवा घेतला",
    "fund utilization": "निधी वापर",
    "LIVE AUDIT": "थेट ऑडिट",
    "Execution Status:": "कामाची स्थिती:",
    "All Execution States": "सर्व कामांच्या स्थिती",
    "Stalled / Stagnated": "रखडलेली कामे",
    "Executing Agency:": "अंमलबजावणी यंत्रणा:",
    "Designated Nodal Agency": "नियुक्त नोडल एजन्सी",
    "Sanctioned": "मंजूर",
    "Status": "स्थिती",
    "Physical": "भौतिक प्रगती",
    "Disbursed": "वितरित",
    "days schedule slippage": "दिवसांचा वेळापत्रक विलंब",
    "Trace 360°": "ट्रेस 360°",
    "Inspect": "तपासा",
    "Grievance": "तक्रार",
    "Retrieving": "मिळवत आहे",
    "project ledgers...": "प्रकल्प खतावणी...",
    "works by Title, ID, District, or Contractor...": "शीर्षक, आयडी, जिल्हा किंवा कंत्राटदाराद्वारे कामे...",
    "Total Sanctioned": "एकूण मंजूर निधी",
    "Portfolio": "पोर्टफोलिओ",
    "Standard:": "मानक:",
  },
  kn: {
    // Navigation
    "Platform Home": "ಮುಖಪುಟ",
    "Departmental Portals": "ಇಲಾಖಾ ಪೋರ್ಟಲ್‌ಗಳು",
    "Public Works Explorer": "ಸಾರ್ವಜನಿಕ ಕಾಮಗಾರಿಗಳ ಶೋಧಕ",
    "Interactive India Map": "ಸಂವಾದಾತ್ಮಕ ಭಾರತ ನಕ್ಷೆ",
    "Fund Flow Intelligence & PFMS Disbursal Tracker": "ಹಣದ ಹರಿವು ಬುದ್ಧಿವಂತಿಕೆ ಮತ್ತು PFMS ವಿತರಣಾ ಟ್ರ್ಯಾಕರ್",
    "Fund Flow Intelligence": "ಹಣದ ಹರಿವು ಬುದ್ಧಿವಂತಿಕೆ",
    "Contracts Registry & SLA Monitoring": "ಒಪ್ಪಂದಗಳ ನೋಂದಣಿ ಮತ್ತು SLA ಮೇಲ್ವಿಚಾರಣೆ",
    "Contracts Registry": "ಒಪ್ಪಂದಗಳ ನೋಂದಣಿ",
    "Contractor Intelligence & Performance Matrix": "ಗುತ್ತಿಗೆದಾರರ ಬುದ್ಧಿವಂತಿಕೆ ಮತ್ತು ಕಾರ್ಯಕ್ಷಮತೆ ಮ್ಯಾಟ್ರಿಕ್ಸ್",
    "Contractor Intelligence": "ಗುತ್ತಿಗೆದಾರರ ಬುದ್ಧಿವಂತಿಕೆ",
    "AI Risk & Early Warning Surveillance Center": "AI ಅಪಾಯ ಮತ್ತು ಮುಂಚಿನ ಎಚ್ಚರಿಕೆ ಕಣ್ಗಾವಲು ಕೇಂದ್ರ",
    "AI Risk & Anomaly Center": "AI ಅಪಾಯ ಮತ್ತು ಅಸಂಗತತೆ ಕೇಂದ್ರ",
    "Dispute Management & Settlement Engine": "ವಿವಾದ ನಿರ್ವಹಣೆ ಮತ್ತು ಇತ್ಯರ್ಥ ವ್ಯವಸ್ಥೆ",
    "Dispute Management": "ವಿವಾದ ನಿರ್ವಹಣೆ",
    "Guarantee & Warranty Tracker": "ಖಾತರಿ ಮತ್ತು ವಾರಂಟಿ ಟ್ರ್ಯಾಕರ್",
    "Field Inspection & Geotag Verification Console": "ಕ್ಷೇತ್ರ ತಪಾಸಣೆ ಮತ್ತು ಜಿಯೋಟ್ಯಾಗ್ ಪರಿಶೀಲನಾ ಕನ್ಸೋಲ್",
    "Field Inspections (Mobile)": "ಕ್ಷೇತ್ರ ತಪಾಸಣೆ (ಮೊಬೈಲ್)",
    "Citizen Grievances & Redressal Tracking": "ನಾಗರಿಕರ ಕುಂದುಕೊರತೆಗಳು ಮತ್ತು ಪರಿಹಾರ ಟ್ರ್ಯಾಕಿಂಗ್",
    "Citizen Grievances": "ನಾಗರಿಕರ ಕುಂದುಕೊರತೆಗಳು",
    "Automated Alerts & Escalation Engine": "ಸ್ವಯಂಚಾಲಿತ ಎಚ್ಚರಿಕೆ ಮತ್ತು ಉಲ್ಬಣ ಎಂಜಿನ್",
    "Alert & Escalation Engine": "ಎಚ್ಚರಿಕೆ ಮತ್ತು ಉಲ್ಬಣ ಎಂಜಿನ್",
    "Executive Dossier & Statutory Report Generator": "ಡಾಕ್ಯುಮೆಂಟ್ ಮತ್ತು ಶಾಸನಬದ್ಧ ವರದಿ ಜನರೇಟರ್",
    "Dossier & Report Generator": "ವರದಿ ಜನರೇಟರ್",
    "Document Intelligence": "ದಾಖಲೆಗಳ ಬುದ್ಧಿವಂತಿಕೆ",
    "Audit Trail & Logs": "ಆಡಿಟ್ ಹಾದಿ ಮತ್ತು ದಾಖಲೆಗಳು",
    "Admin Data & Rules": "ಆಡಳಿತ ಡೇಟಾ ಮತ್ತು ನಿಯಮಗಳು",

    // Categories
    "Core Portals": "ಮುಖ್ಯ ಪೋರ್ಟಲ್‌ಗಳು",
    "Financials & Contracts": "ಹಣಕಾಸು ಮತ್ತು ಒಪ್ಪಂದಗಳು",
    "AI & Risk Analytics": "AI ಮತ್ತು ಅಪಾಯದ ವಿಶ್ಲೇಷಣೆ",
    "Ground Operations": "ಕ್ಷೇತ್ರ ಕಾರ್ಯಾಚರಣೆಗಳು",
    "Governance & Reports": "ಆಡಳಿತ ಮತ್ತು ವರದಿಗಳು",
    "Administration": "ಆಡಳಿತ",

    // Roles
    "Role: Citizen": "ಪಾತ್ರ: ನಾಗರಿಕ",
    "Role: Field Officer / Inspector": "ಪಾತ್ರ: ಕ್ಷೇತ್ರ ಅಧಿಕಾರಿ",
    "Role: District Authority": "ಪಾತ್ರ: ಜಿಲ್ಲಾ ಪ್ರಾಧಿಕಾರ",
    "Role: Higher Authority / Admin": "ಪಾತ್ರ: ಉನ್ನತ ಪ್ರಾಧಿಕಾರ / ನಿರ್ವಾಹಕ",
    "Citizen": "ನಾಗರಿಕ",
    "Field Officer": "ಕ್ಷೇತ್ರ ಅಧಿಕಾರಿ",
    "District Authority": "ಜಿಲ್ಲಾ ಪ್ರಾಧಿಕಾರ",
    "Higher Authority / Admin": "ಉನ್ನತ ಪ್ರಾಧಿಕಾರ / ನಿರ್ವಾಹಕ",

    // Tables
    "Contractor & Reg": "ಗುತ್ತಿಗೆದಾರ ಮತ್ತು ನೋಂದಣಿ",
    "Work Agreement": "ಕೆಲಸದ ಒಪ್ಪಂದ",
    "Contract Value (₹)": "ಒಪ್ಪಂದದ ಮೌಲ್ಯ (₹)",
    "Contract Value": "ಒಪ್ಪಂದದ ಮೌಲ್ಯ",
    "Contract Amount": "ಒಪ್ಪಂದದ ಮೊತ್ತ",
    "Start / Target Date": "ಪ್ರಾರಂಭ / ಗುರಿ ದಿನಾಂಕ",
    "Defect Liability": "ದೋಷ ಹೊಣೆಗಾರಿಕೆ",
    "Contract Health": "ಒಪ್ಪಂದದ ಸ್ಥಿತಿ",
    "Contract Health Legend:": "ಒಪ್ಪಂದ ಆರೋಗ್ಯ ವಿವರಣೆ:",
    "Active Public Contracts": "ಸಕ್ರಿಯ ಸಾರ್ವಜನಿಕ ಒಪ್ಪಂದಗಳು",
    "Actions": "ಕ್ರಮಗಳು",
    "View": "ವೀಕ್ಷಿಸಿ",
    "View Details": "ವಿವರಗಳನ್ನು ನೋಡಿ",
    "Due:": "ಅಂತಿಮ ದಿನಾಂಕ:",

    // Badges & Statuses
    "Normal (On Schedule & Compliant)": "ಸಾಮಾನ್ಯ (ಸಮಯಕ್ಕೆ ಮತ್ತು ನಿಯಮಬದ್ಧ)",
    "Attention (<45d delay)": "ಗಮನಿಸಿ (<45 ದಿನಗಳ ವಿಳಂಬ)",
    "High Risk (Significant lag)": "ಹೆಚ್ಚಿನ ಅಪಾಯ (ಗಮನಾರ್ಹ ಹಿನ್ನಡೆ)",
    "Critical (Default / Abandonment risk)": "ಕ್ಲಿಷ್ಟಕರ (ಕೆಲಸ ಕೈಬಿಡುವ ಅಪಾಯ)",
    "Under Progress": "ಪ್ರಗತಿಯಲ್ಲಿದೆ",
    "Completed": "ಪೂರ್ಣಗೊಂಡಿದೆ",
    "Stalled Work": "ಸ್ಥಗಿತಗೊಂಡ ಕಾಮಗಾರಿ",
    "Normal": "ಸಾಮಾನ್ಯ",
    "Watch": "ವೀಕ್ಷಣೆ",
    "High Risk": "ಹೆಚ್ಚಿನ ಅಪಾಯ",
    "Critical": "ಕ್ಲಿಷ್ಟಕರ",

    // Filters
    "Department:": "ಇಲಾಖೆ:",
    "All States": "ಎಲ್ಲಾ ರಾಜ್ಯಗಳು",
    "All Districts": "ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು",
    "Select State First": "ಮೊದಲು ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    "Matching Works:": "ಹೊಂದಾಣಿಕೆಯ ಕಾಮಗಾರಿಗಳು:",
    "Active Filters:": "ಸಕ್ರಿಯ ಫಿಲ್ಟರ್‌ಗಳು:",
    "Reset Filters": "ಫಿಲ್ಟರ್ ಮರುಹೊಂದಿಸಿ",
    "Clear Search": "ಹುಡುಕಾಟ ತೆರವುಗೊಳಿಸಿ",
    "Search": "ಹುಡುಕಿ",
    "Clear": "ತೆರವುಗೊಳಿಸಿ",

    // Metrics
    "Total Monitored Works": "ಒಟ್ಟು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಲಾದ ಕಾಮಗಾರಿಗಳು",
    "Sanctioned Funds": "ಮಂಜೂರಾದ ನಿಧಿ",
    "Disbursed Funds": "ಬಿಡುಗಡೆಯಾದ ನಿಧಿ",
    "Active Critical Alerts": "ಸಕ್ರಿಯ ಗಂಭೀರ ಎಚ್ಚರಿಕೆಗಳು",
    "Sanctioned Amount": "ಮಂಜೂರಾದ ಮೊತ್ತ",
    "Funds Released": "ಬಿಡುಗಡೆಯಾದ ನಿಧಿ",
    "Funds Paid": "ಪಾವತಿಸಿದ ಹಣ",
    "Actual Expenditure": "ನಿಜವಾದ ವೆಚ್ಚ",

    // Actions
    "Confirm Ground Reality": "ನೆಲದ ವಾಸ್ತವತೆಯನ್ನು ದೃಢೀಕರಿಸಿ",
    "Report Discrepancy / Delay": "ವ್ಯತ್ಯಾಸ / ವಿಳಂಬವನ್ನು ವರದಿ ಮಾಡಿ",
    "Record Field Inspection": "ಕ್ಷೇತ್ರ ತಪಾಸಣೆಯನ್ನು ದಾಖಲಿಸಿ",
    "Register Grievance": "ದೂರು ದಾಖಲಿಸಿ",
    "Submit": "ಸಲ್ಲಿಸಿ",
    "Cancel": "ರದ್ದುಮಾಡಿ",
    "Close": "ಮುಚ್ಚಿ",

    // Departments
    "Drinking Water": "ಕುಡಿಯುವ ನೀರು",
    "Education": "ಶಿಕ್ಷಣ",
    "Healthcare": "ಆರೋಗ್ಯ ರಕ್ಷಣೆ",
    "Roads & Bridges": "ರಸ್ತೆಗಳು ಮತ್ತು ಸೇತುವೆಗಳು",
    "Renewable Energy": "ನವೀಕರಿಸಬಹುದಾದ ಶಕ್ತಿ",
    "Irrigation & Water Bodies": "ನೀರಾವರಿ ಮತ್ತು ಜಲಮೂಲಗಳು",
    "Sanitation & Waste": "ಸ್ವಚ್ಛತೆ ಮತ್ತು ತ್ಯಾಜ್ಯ",
    "Community Assets": "ಸಮುದಾಯ ಸ್ವತ್ತುಗಳು",

    // Department Monitoring & Telemetry Extras
    "Department Intelligence Hub": "ಇಲಾಖಾ ಗುಪ್ತಚರ ಕೇಂದ್ರ",
    "8 Portfolios Mapped": "8 ಇಲಾಖೆಗಳನ್ನು ಮ್ಯಾಪ್ ಮಾಡಲಾಗಿದೆ",
    "Departmental Monitoring Portals": "ಇಲಾಖಾ ಮೇಲ್ವಿಚಾರಣಾ ಪೋರ್ಟಲ್‌ಗಳು",
    "Sector-specific intelligence dashboards configured with Indian administrative benchmarks, nodal executing agencies, and automated project milestone tracking.": "ಭಾರತೀಯ ಆಡಳಿತಾತ್ಮಕ ಮಾನದಂಡಗಳು, ನೋಡಲ್ ಅನುಷ್ಠಾನ ಸಂಸ್ಥೆಗಳು ಮತ್ತು ಸ್ವಯಂಚಾಲಿತ ಪ್ರಾಜೆಕ್ಟ್ ಮೈಲಿಗಲ್ಲು ಟ್ರ್ಯಾಕಿಂಗ್‌ನೊಂದಿಗೆ ಕಾನ್ಫಿಗರ್ ಮಾಡಲಾದ ಕ್ಷೇತ್ರ-ನಿರ್ದಿಷ್ಟ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗಳು.",
    "Sync All Records": "ಎಲ್ಲಾ ದಾಖಲೆಗಳನ್ನು ಸಿಂಕ್ ಮಾಡಿ",
    "Drinking Water & Jal Jeevan": "ಕುಡಿಯುವ ನೀರು ಮತ್ತು ಜಲ ಜೀವನ್ ಮಿಷನ್",
    "School Education & Literacy": "ಶಾಲಾ ಶಿಕ್ಷಣ ಮತ್ತು ಸಾಕ್ಷರತೆ",
    "Healthcare & Public Health": "ಆರೋಗ್ಯ ರಕ್ಷಣೆ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ",
    "Roads, Bridges & Connectivity": "ರಸ್ತೆಗಳು, ಸೇತುವೆಗಳು ಮತ್ತು ಸಂಪರ್ಕ",
    "Community Infrastructure & Halls": "ಸಮುದಾಯ ಮೂಲಸೌಕರ್ಯ ಮತ್ತು ಸಭಾಂಗಣಗಳು",
    "Solar & Renewable Energy": "ಸೌರ ಮತ್ತು ನವೀಕರಿಸಬಹುದಾದ ಶಕ್ತಿ",
    "Irrigation & Water Conservation": "ನೀರಾವರಿ ಮತ್ತು ಜಲ ಸಂರಕ್ಷಣೆ",
    "Sanitation & Solid Waste Management": "ಸ್ವಚ್ಛತೆ ಮತ್ತು ಘನತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ",
    "Community Infrastructure": "ಸಮುದಾಯ ಮೂಲಸೌಕರ್ಯ",
    "Solar Energy": "ಸೌರ ಶಕ್ತಿ",
    "Irrigation": "ನೀರಾವರಿ",
    "Sanitation": "ಸ್ವಚ್ಛತೆ",
    "Roads & PWD": "ರಸ್ತೆಗಳು ಮತ್ತು ಲೋಕೋಪಯೋಗಿ",
    "Sanitation (Swachh Bharat)": "ಸ್ವಚ್ಛತೆ (ಸ್ವಚ್ಛ ಭಾರತ)",
    "Drinking Water (JJM)": "ಕುಡಿಯುವ ನೀರು (ಜೆಜೆಎಂ)",
    "Healthcare (NHM)": "ಆರೋಗ್ಯ ರಕ್ಷಣೆ (ಎನ್‌ಎಚ್‌ಎಂ)",
    "Jal Jeevan Portfolio": "ಜಲ ಜೀವನ್ ಪೋರ್ಟ್‌ಫೋಲಿಯೊ",
    "DISBURSED OUTLAY": "ವಿತರಿಸಲಾದ ವೆಚ್ಚ",
    "Disbursed Outlay": "ವಿತರಿಸಲಾದ ವೆಚ್ಚ",
    "AVG PHYSICAL VELOCITY": "ಸರಾಸರಿ ಭೌತಿಕ ಪ್ರಗತಿ ವೇಗ",
    "Avg Physical Velocity": "ಸರಾಸರಿ ಭೌತಿಕ ಪ್ರಗತಿ ವೇಗ",
    "COMPLETED & HANDOVER": "ಪೂರ್ಣಗೊಂಡಿದೆ ಮತ್ತು ಹಸ್ತಾಂತರಿಸಲಾಗಿದೆ",
    "Completed & Handover": "ಪೂರ್ಣಗೊಂಡಿದೆ ಮತ್ತು ಹಸ್ತಾಂತರಿಸಲಾಗಿದೆ",
    "UNDER EXECUTION": "ಪ್ರಗತಿಯಲ್ಲಿರುವ ಕಾಮಗಾರಿಗಳು",
    "Under Execution": "ಪ್ರಗತಿಯಲ್ಲಿರುವ ಕಾಮಗಾರಿಗಳು",
    "WATCHLIST WARNINGS": "ವೀಕ್ಷಣಾ ಪಟ್ಟಿ ಎಚ್ಚರಿಕೆಗಳು",
    "Watchlist Warnings": "ವೀಕ್ಷಣಾ ಪಟ್ಟಿ ಎಚ್ಚರಿಕೆಗಳು",
    "WATCHLIST": "ವೀಕ್ಷಣಾ ಪಟ್ಟಿ",
    "Watchlist": "ವೀಕ್ಷಣಾ ಪಟ್ಟಿ",
    "Needs verification audit": "ಪರಿಶೀಲನಾ ಆಡಿಟ್ ಅಗತ್ಯವಿದೆ",
    "MB Record verified": "ಎಂಬಿ ದಾಖಲೆ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    "100% UC generated": "100% ಬಳಕೆಯ ಪ್ರಮಾಣಪತ್ರ ನೀಡಲಾಗಿದೆ",
    "Under surveillance": "ಕಣ್ಗಾವಲಿನಲ್ಲಿದೆ",
    "schemes tracked": "ಯೋಜನೆಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾಗಿದೆ",
    "fund utilization": "ಅನುದಾನ ಬಳಕೆ",
    "LIVE AUDIT": "ಲೈವ್ ಆಡಿಟ್",
    "Execution Status:": "ಕಾಮಗಾರಿ ಸ್ಥಿತಿ:",
    "All Execution States": "ಎಲ್ಲಾ ಕಾಮಗಾರಿ ಸ್ಥಿತಿಗಳು",
    "Stalled / Stagnated": "ಸ್ಥಗಿತಗೊಂಡ ಕಾಮಗಾರಿಗಳು",
    "Executing Agency:": "ಅನುಷ್ಠಾನ ಸಂಸ್ಥೆ:",
    "Designated Nodal Agency": "ಗೊತ್ತುಪಡಿಸಿದ ನೋಡಲ್ ಸಂಸ್ಥೆ",
    "Sanctioned": "ಮಂಜೂರಾದ",
    "Status": "ಸ್ಥಿತಿ",
    "Physical": "ಭೌತಿಕ ಪ್ರಗತಿ",
    "Disbursed": "ವಿತರಿಸಲಾಗಿದೆ",
    "days schedule slippage": "ದಿನಗಳ ವೇಳಾಪಟ್ಟಿ ವಿಳಂಬ",
    "Trace 360°": "ಟ್ರೇಸ್ 360°",
    "Inspect": "ತಪಾಸಣೆ ಮಾಡಿ",
    "Grievance": "ದೂರು",
    "Retrieving": "ಹಿಂಪಡೆಯಲಾಗುತ್ತಿದೆ",
    "project ledgers...": "ಪ್ರಾಜೆಕ್ಟ್ ಲೆಡ್ಜರ್‌ಗಳು...",
    "works by Title, ID, District, or Contractor...": "ಶೀರ್ಷಿಕೆ, ಐಡಿ, ಜಿಲ್ಲೆ ಅಥವಾ ಗುತ್ತಿಗೆದಾರರ ಮೂಲಕ ಕಾಮಗಾರಿಗಳು...",
    "Total Sanctioned": "ಒಟ್ಟು ಮಂಜೂರಾದ ಅನುದಾನ",
    "Portfolio": "ಪೋರ್ಟ್‌ಫೋಲಿಯೊ",
    "Standard:": "ಮಾನದಂಡ:",
  },
};

// Precompute sorted phrase entries (longest phrase first to avoid partial collision)
export const SORTED_PHRASES: Record<Language, [string, string][]> = {
  en: [],
  hi: Object.entries(PHRASE_DICTIONARY.hi).sort((a, b) => b[0].length - a[0].length),
  te: Object.entries(PHRASE_DICTIONARY.te).sort((a, b) => b[0].length - a[0].length),
  ta: Object.entries(PHRASE_DICTIONARY.ta).sort((a, b) => b[0].length - a[0].length),
  bn: Object.entries(PHRASE_DICTIONARY.bn).sort((a, b) => b[0].length - a[0].length),
  mr: Object.entries(PHRASE_DICTIONARY.mr).sort((a, b) => b[0].length - a[0].length),
  kn: Object.entries(PHRASE_DICTIONARY.kn).sort((a, b) => b[0].length - a[0].length),
};

// Global Bidirectional Reverse Lookup: maps ANY foreign phrase in ANY language -> canonical English phrase
export const REVERSE_DICTIONARY: Record<string, string> = {};

(['hi', 'te', 'ta', 'bn', 'mr', 'kn'] as Language[]).forEach(lang => {
  const dict = PHRASE_DICTIONARY[lang];
  if (dict) {
    for (const [enPhrase, localized] of Object.entries(dict)) {
      if (localized && localized.trim() && localized.trim() !== enPhrase.trim()) {
        REVERSE_DICTIONARY[localized.trim()] = enPhrase.trim();
      }
    }
  }
});

// Precompute sorted reverse phrases (longest foreign phrase first)
export const REVERSE_ENTRIES = Object.entries(REVERSE_DICTIONARY).sort(
  (a, b) => b[0].length - a[0].length
);

/**
 * Normalizes ANY string (English, Telugu, Hindi, Tamil, etc.) back to pure original English
 */
export function normalizeToEnglish(text: string): string {
  if (!text) return text;
  const trimmed = text.trim();
  if (REVERSE_DICTIONARY[trimmed]) {
    const leading = text.match(/^\s*/)?.[0] || '';
    const trailing = text.match(/\s*$/)?.[0] || '';
    return leading + REVERSE_DICTIONARY[trimmed] + trailing;
  }

  let result = text;
  for (let i = 0; i < REVERSE_ENTRIES.length; i++) {
    const [foreignPhrase, enPhrase] = REVERSE_ENTRIES[i];
    if (result.includes(foreignPhrase)) {
      result = result.split(foreignPhrase).join(enPhrase);
    }
  }
  return result;
}

/**
 * Translates pure English text to target language using word boundaries.
 * Prevents slicing inside words (e.g. 'Act' will NEVER match inside 'Action' or 'Contract').
 * Case-insensitive regex matching ensures UPPERCASE, Title Case, and lowercase text are translated.
 */
export function translateEnglishToTarget(englishText: string, targetLang: Language): string {
  if (targetLang === 'en' || !englishText) return englishText;

  const exactMap = PHRASE_DICTIONARY[targetLang];
  if (!exactMap) return englishText;

  const trimmed = englishText.trim();
  if (exactMap[trimmed]) {
    const leading = englishText.match(/^\s*/)?.[0] || '';
    const trailing = englishText.match(/\s*$/)?.[0] || '';
    return leading + exactMap[trimmed] + trailing;
  }

  const sortedList = SORTED_PHRASES[targetLang];
  if (!sortedList || sortedList.length === 0) return englishText;

  let workingText = englishText;
  const lowerWorking = workingText.toLowerCase();

  for (let i = 0; i < sortedList.length; i++) {
    const [enPhrase, localized] = sortedList[i];
    if (!localized || enPhrase === localized) continue;

    const lowerPhrase = enPhrase.toLowerCase();
    // Fast case-insensitive check
    if (!lowerWorking.includes(lowerPhrase)) continue;

    // Use boundary matching to prevent cutting inside words, case-insensitive (gi)
    const escaped = enPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<![a-zA-Z0-9])${escaped}(?![a-zA-Z0-9])`, 'gi');
    if (regex.test(workingText)) {
      workingText = workingText.replace(regex, localized);
    }
  }

  return workingText;
}

/**
 * Universal DOM Text Internationalization Engine
 * Automatically traverses rendered text nodes and translates English phrases to target language.
 * EXPLICITLY SKIPS:
 * - Images (<img>, <picture>)
 * - Vectors (<svg>, <path>)
 * - Canvases & Videos (<canvas>, <video>)
 * - User Inputs (<input>, <textarea>, [contenteditable])
 * - Code & numeric identifiers (<pre>, <code>, .font-mono)
 * - Protected containers (.no-translate)
 */
export function translateDOM(targetLang: Language) {
  if (typeof document === 'undefined') return;

  const root = document.getElementById('root') || document.body;
  if (!root) return;

  // Walk text nodes avoiding images, graphics, inputs, and code
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toUpperCase();

        // Strictly ignore images, media, SVGs, inputs, textareas, and code blocks
        if (
          tag === 'IMG' ||
          tag === 'PICTURE' ||
          tag === 'SVG' ||
          tag === 'PATH' ||
          tag === 'CANVAS' ||
          tag === 'VIDEO' ||
          tag === 'AUDIO' ||
          tag === 'SCRIPT' ||
          tag === 'STYLE' ||
          tag === 'INPUT' ||
          tag === 'TEXTAREA' ||
          tag === 'CODE' ||
          tag === 'PRE' ||
          parent.isContentEditable ||
          parent.closest('svg') ||
          parent.closest('.no-translate') ||
          parent.closest('[data-no-translate]')
        ) {
          return NodeFilter.FILTER_REJECT;
        }

        const raw = node.nodeValue?.trim();
        // Skip empty or purely numeric/symbolic nodes (e.g. currency numbers, timestamps, IDs)
        if (!raw || raw.length <= 1 || /^[\d\s,.\-₹%:+/#*@!()]+$/.test(raw)) {
          return NodeFilter.FILTER_SKIP;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  // Snapshot nodes first
  const nodesToTranslate: Node[] = [];
  let current: Node | null;
  while ((current = walker.nextNode())) {
    nodesToTranslate.push(current);
  }

  // Apply translations
  for (const node of nodesToTranslate) {
    const currentVal = node.nodeValue || '';
    if (!currentVal.trim()) continue;

    // Check if we already hold a pristine English canonical snapshot
    const storedCanonical: string = (node as any).__canonicalEn;
    const isStoredValid = storedCanonical && !/[^\u0000-\u007F]/.test(storedCanonical);

    let canonicalEn: string;
    if (isStoredValid) {
      // Pristine English is already captured; NEVER overwrite or corrupt it
      canonicalEn = storedCanonical;
    } else if (!/[^\u0000-\u007F]/.test(currentVal)) {
      // Current DOM value is pure ASCII/English, store it permanently as the ground truth
      canonicalEn = currentVal;
      (node as any).__canonicalEn = canonicalEn;
    } else {
      // Node was created while foreign language was active; normalize back to English
      canonicalEn = normalizeToEnglish(currentVal);
      if (!/[^\u0000-\u007F]/.test(canonicalEn)) {
        (node as any).__canonicalEn = canonicalEn;
      }
    }

    // 2. Compute target text for targetLang
    const targetVal = targetLang === 'en' 
      ? canonicalEn 
      : translateEnglishToTarget(canonicalEn, targetLang);

    // 3. Update DOM text only if changed
    if (node.nodeValue !== targetVal) {
      node.nodeValue = targetVal;
    }
  }
}
