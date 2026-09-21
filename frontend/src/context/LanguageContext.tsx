import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translateDOM, PHRASE_DICTIONARY, REVERSE_DICTIONARY, REVERSE_ENTRIES } from './phraseTranslations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

import { LANGUAGE_LABELS } from '../constants/languages';

const DICTIONARY: Record<Language, Record<string, string>> = {
  en: {
    platform_name: "MPLAD-TRACE 360",
    tagline: "Track every rupee. Verify every work. Detect every warning.",
    satyameva_jayate: "सत्यमेव जयते",
    govt_of_india: "भारत सरकार • Government of India",
    mospi_active: "MoSPI e-SAKSHI & PFMS Active",

    nav_landing: "Platform Home",
    nav_departments: "Departmental Portals",
    nav_projects: "Public Works Explorer",
    nav_map: "Interactive India Map",
    nav_funds: "Fund Flow Intelligence",
    nav_contracts: "Contracts Registry",
    nav_contractors: "Contractor Intelligence",
    nav_ai_risk: "AI Risk & Anomaly Center",
    nav_disputes: "Dispute Management",
    nav_guarantees: "Guarantee & Warranty Tracker",
    nav_inspections: "Field Inspections (Mobile)",
    nav_complaints: "Citizen Grievances",
    nav_alerts: "Alert & Escalation Engine",
    nav_reports: "Dossier & Report Generator",
    nav_documents: "Document Intelligence",
    nav_audit: "Audit Trail & Logs",
    nav_admin: "Admin Data & Rules",

    cat_core: "Core Portals",
    cat_financials: "Financials & Contracts",
    cat_intelligence: "AI & Risk Analytics",
    cat_ground_ops: "Ground Operations",
    cat_governance: "Governance & Reports",
    cat_administration: "Administration",

    role_citizen: "Citizen",
    role_officer: "Field Officer / Inspector",
    role_district: "District Authority",
    role_admin: "Higher Authority / Admin",

    hero_title_1: "Every Public Rupee.",
    hero_title_2: "Tracked, Verified & Predicted.",
    hero_desc: "Autonomous contract intelligence and early-warning platform for MPLADS works. Real-time Planned vs. Actual surveillance detecting fund diversion, geospatial duplicates, and milestone delays across Indian parliamentary constituencies.",
    hero_search_cta: "Explore {count} Public Works",
    hero_map_cta: "Open India Surveillance Map",
    hero_missions_label: "Implementing National Missions & Portfolios",
    hero_radar_title: "All-India Geospatial Radar",
    hero_radar_desc: "24/7 Autonomous Geofence Surveillance",
    hero_radar_stats: "{count} Works • {states} States Active",
    hero_national_case_study: "Flagship National Case Study",

    mission_water: "Drinking Water (JJM)",
    mission_edu: "Education",
    mission_health: "Healthcare (NHM)",
    mission_roads: "Roads & PWD",
    mission_solar: "Solar Energy",
    mission_irrigation: "Irrigation & Water Bodies",
    mission_sanitation: "Sanitation (Swachh Bharat)",
    mission_community: "Community Infrastructure",

    nav_search_placeholder: "Search works, MPs, IDs...",
    search_placeholder: "Search by Project ID, Title, Village, District, Contractor or MP...",
    search_button: "Search",
    clear_button: "Clear",
    all_states: "All States",
    all_districts: "All Districts",
    all_categories: "All Departments",
    all_statuses: "All Statuses",
    all_risks: "All Risk Levels",
    reset_filters: "Reset Filters",
    works_mapped: "Works Mapped",
    explore_works: "Explore Public Infrastructure Works",

    col_project_id: "Project ID",
    col_title: "Work Title & Location",
    col_category: "Department",
    col_constituency: "Constituency & MP",
    col_financials: "Sanctioned / Spent",
    col_progress: "Progress Velocity",
    col_contractor: "Contractor",
    col_risk: "AI Risk Level",
    col_actions: "Action",
    trace_work: "Trace 360°",
    view_evidence: "Evidence",
    view_map: "On Map",
    close: "Close",
    save: "Save",
    submit: "Submit",

    risk_normal: "Normal",
    risk_watch: "Watch",
    risk_high: "High Risk",
    risk_critical: "Critical Surveillance",

    status_completed: "Completed",
    status_in_progress: "In Progress",
    status_delayed: "Delayed",
    status_stalled: "Stalled",
    status_sanctioned: "Sanctioned",

    stat_total_projects: "Total Monitored Works",
    stat_sanctioned_funds: "Sanctioned Funds",
    stat_disbursed_funds: "Disbursed Funds",
    stat_critical_anomalies: "Active Critical Alerts",
    stat_verified_works: "Geotagged Verified Works",
    lang_switched: "Language changed to English",
  },
  hi: {
    platform_name: "सांसद निधि-ट्रैक 360",
    tagline: "हर रुपये पर नज़र। हर कार्य का सत्यापन। हर चेतावनी की पहचान।",
    satyameva_jayate: "सत्यमेव जयते",
    govt_of_india: "भारत सरकार • Government of India",
    mospi_active: "सांख्यिकी मंत्रालय e-SAKSHI एवं PFMS सक्रिय",

    nav_landing: "मुख्य पृष्ठ",
    nav_departments: "विभागीय पोर्टल",
    nav_projects: "सार्वजनिक कार्य अन्वेषक",
    nav_map: "भारत का लाइव मानचित्र",
    nav_funds: "धन प्रवाह विश्लेषण",
    nav_contracts: "अनुबंध पंजिका",
    nav_contractors: "ठेकेदार कार्यकुशलता",
    nav_ai_risk: "एआई जोखिम एवं विसंगति केंद्र",
    nav_disputes: "विवाद प्रबंधन",
    nav_guarantees: "बैंक गारंटी एवं वारंटी ट्रैकर",
    nav_inspections: "क्षेत्र निरीक्षण (मोबाइल)",
    nav_complaints: "नागरिक शिकायत पोर्टल",
    nav_alerts: "चेतावनी एवं निवारण प्रणाली",
    nav_reports: "आधिकारिक रिपोर्ट व डॉजियर",
    nav_documents: "दस्तावेज़ विश्लेषण",
    nav_audit: "ऑडिट रिकॉर्ड एवं लॉग्स",
    nav_admin: "डेटा एवं नियम प्रबंधन",

    cat_core: "मुख्य पोर्टल",
    cat_financials: "वित्तीय एवं अनुबंध",
    cat_intelligence: "एआई एवं जोखिम विश्लेषण",
    cat_ground_ops: "जमीनी निरीक्षण",
    cat_governance: "प्रशासन एवं रिपोर्ट",
    cat_administration: "प्रबंधन",

    role_citizen: "नागरिक",
    role_officer: "क्षेत्रीय अधिकारी / निरीक्षक",
    role_district: "ज़िला प्राधिकारी",
    role_admin: "उच्च प्राधिकारी / व्यवस्थापक",

    hero_title_1: "जनता का एक-एक रुपया।",
    hero_title_2: "निगरानी, सत्यापन एवं पूर्व चेतावनी।",
    hero_desc: "सांसद स्थानीय क्षेत्र विकास योजना (MPLADS) कार्यों की स्वायत्त अनुबंध निगरानी। निधि विपथन, डुप्लिकेट निर्माण और समय सीमा में देरी की वास्तविक समय में पहचान।",
    hero_search_cta: "{count} विकास कार्यों का अन्वेषण करें",
    hero_map_cta: "भारत का लाइव मानचित्र खोलें",
    hero_missions_label: "राष्ट्रीय मिशन एवं प्रमुख विभाग",
    hero_radar_title: "अखिल भारतीय भू-स्थानिक रडार",
    hero_radar_desc: "24/7 स्वायत्त उपग्रह एवं भू-निगरानी",
    hero_radar_stats: "{count} कार्य • {states} सक्रिय राज्य",
    hero_national_case_study: "राष्ट्रीय प्रमुख कार्य अध्ययन",

    mission_water: "जल जीवन मिशन (पेयजल)",
    mission_edu: "समग्र शिक्षा (शिक्षा)",
    mission_health: "राष्ट्रीय स्वास्थ्य मिशन (स्वास्थ्य)",
    mission_roads: "प्रधानमंत्री ग्राम सड़क योजना (सड़क)",
    mission_solar: "नवीन एवं नवीकरणीय ऊर्जा (सौर ऊर्जा)",
    mission_irrigation: "अमृत सरोवर (सिंचाई व जल संचयन)",
    mission_sanitation: "स्वच्छ भारत अभियान (स्वच्छता)",
    mission_community: "सामुदायिक अवसंरचना",

    search_placeholder: "परियोजना संख्या, शीर्षक, गाँव, ज़िला, ठेकेदार या सांसद खोजें...",
    search_button: "खोजें",
    clear_button: "हटाएं",
    all_states: "सभी राज्य",
    all_districts: "सभी ज़िले",
    all_categories: "सभी विभाग",
    all_statuses: "सभी स्थितियां",
    all_risks: "सभी जोखिम स्तर",
    reset_filters: "फ़िल्टर रीसेट करें",
    works_mapped: "मानचित्रित कार्य",
    explore_works: "सार्वजनिक बुनियादी ढांचा कार्य देखें",

    col_project_id: "कार्य क्रमांक",
    col_title: "कार्य का नाम व स्थान",
    col_category: "विभाग",
    col_constituency: "संसदीय क्षेत्र व सांसद",
    col_financials: "स्वीकृत / व्यय",
    col_progress: "भौतिक प्रगति",
    col_contractor: "ठेकेदार",
    col_risk: "एआई जोखिम स्तर",
    col_actions: "कार्रवाई",
    trace_work: "360° विवरण",
    view_evidence: "साक्ष्य देखें",
    view_map: "मानचित्र पर",
    close: "बंद करें",
    save: "सहेजें",
    submit: "जमा करें",

    risk_normal: "सामान्य",
    risk_watch: "निगरानी योग्य",
    risk_high: "उच्च जोखिम",
    risk_critical: "गंभीर निगरानी",

    status_completed: "पूर्ण",
    status_in_progress: "प्रगति पर",
    status_delayed: "विलंबित",
    status_stalled: "अवरुद्ध",
    status_sanctioned: "स्वीकृत",

    stat_total_projects: "कुल निगरानी अधीन कार्य",
    stat_sanctioned_funds: "कुल स्वीकृत धनराशि",
    stat_disbursed_funds: "कुल जारी धनराशि",
    stat_critical_anomalies: "सक्रिय गंभीर चेतावनियां",
    stat_verified_works: "भू-टैग सत्यापित कार्य",
    lang_switched: "भाषा बदलकर हिंदी कर दी गई है",
  },
  te: {
    platform_name: "ఎంపీల్యాడ్-ట్రేస్ 360",
    tagline: "ప్రతి రూపాయిని గుర్తించండి. ప్రతి పనిని ధృవీకరించండి. ప్రతి హెచ్చరికను పసిగట్టండి.",
    satyameva_jayate: "సత్యమేవ జయతే",
    govt_of_india: "భారత ప్రభుత్వం • Government of India",
    mospi_active: "MoSPI e-SAKSHI మరియు PFMS క్రియాశీలం",

    nav_landing: "హోమ్ పేజీ",
    nav_departments: "విభాగాల పోర్టల్",
    nav_projects: "ప్రజా పనుల అన్వేషణ",
    nav_map: "ఇంటరాక్టివ్ ఇండియా మ్యాప్",
    nav_funds: "నిధుల ప్రవాహ నిఘా",
    nav_contracts: "ఒప్పందాల రిజిస్ట్రీ",
    nav_contractors: "కాంట్రాక్టర్ పనితీరు సూచిక",
    nav_ai_risk: "ఏఐ రిస్క్ & లోపాల కేంద్రం",
    nav_disputes: "వివాదాల పరిష్కారం",
    nav_guarantees: "బ్యాంక్ గ్యారెంటీ & వారంటీ ట్రాకర్",
    nav_inspections: "ఫీల్డ్ తనిఖీ (మొబైల్)",
    nav_complaints: "పౌరుల ఫిర్యాదుల పోర్టల్",
    nav_alerts: "హెచ్చరికలు & పరిష్కారాలు",
    nav_reports: "అధికారిక డాక్యుమెంట్లు & నివేదికలు",
    nav_documents: "పత్రాల ఏఐ విశ్లేషణ",
    nav_audit: "ఆడిట్ చిట్టా & లాగ్‌లు",
    nav_admin: "డేటా & నిబంధనల నిర్వహణ",

    cat_core: "ప్రధాన పోర్టల్స్",
    cat_financials: "ఆర్థిక & ఒప్పందాలు",
    cat_intelligence: "ఏఐ & రిస్క్ విశ్లేషణ",
    cat_ground_ops: "క్షేత్రస్థాయి పనులు",
    cat_governance: "పాలన & నివేదికలు",
    cat_administration: "నిర్వహణ",

    role_citizen: "పౌరుడు",
    role_officer: "ఫీల్డ్ అధికారి / ఇన్స్పెక్టర్",
    role_district: "జిల్లా ప్రాధికార అధికారి",
    role_admin: "ఉన్నతాధికారి / అడ్మిన్",

    hero_title_1: "ప్రజల ప్రతి రూపాయి.",
    hero_title_2: "నిఘా, ధృవీకరణ మరియు ముందస్తు హెచ్చరిక.",
    hero_desc: "ఎంపీ నిధుల పనులపై అటానమస్ కాంట్రాక్ట్ ఇంటెలిజెన్స్ వేదిక. నిధుల దుర్వినియోగం, డూప్లికేట్ పనులు మరియు పురోగతి ఆలస్యాలను రియల్-టైమ్‌లో గుర్తించండి.",
    hero_search_cta: "{count} ప్రజా పనులను అన్వేషించండి",
    hero_map_cta: "ఇండియా లైవ్ మ్యాప్ చూడండి",
    hero_missions_label: "జాతీయ మిషన్లు & ప్రధాన రంగాలు",
    hero_radar_title: "అఖిల భారత జియోస్పేషియల్ రాడార్",
    hero_radar_desc: "24/7 శాటిలైట్ & భౌగోళిక నిఘా",
    hero_radar_stats: "{count} పనులు • {states} క్రియాశీల రాష్ట్రాలు",
    hero_national_case_study: "జాతీయ విశిష్ట ప్రాజెక్ట్ అధ్యయనం",

    mission_water: "జల్ జీవన్ మిషన్ (తాగునీరు)",
    mission_edu: "సమగ్ర శిక్ష (విద్య)",
    mission_health: "ఆరోగ్య మిషన్ (వైద్యం)",
    mission_roads: "గ్రామీణ సడక్ & PWD (రోడ్లు)",
    mission_solar: "సౌర శక్తి (పునరుత్పాదక శక్తి)",
    mission_irrigation: "అమృత్ సరోవర్ (నీటిపారుదల)",
    mission_sanitation: "స్వచ్ఛ భారత్ (పారిశుధ్యం)",
    mission_community: "సామాజిక భవనాలు",

    search_placeholder: "ప్రాజెక్ట్ ఐడీ, పని పేరు, గ్రామం, జిల్లా, కాంట్రాక్టర్ లేదా ఎంపీ పేరు...",
    search_button: "వెతకండి",
    clear_button: "తొలగించు",
    all_states: "అన్ని రాష్ట్రాలు",
    all_districts: "అన్ని జిల్లాలు",
    all_categories: "అన్ని విభాగాలు",
    all_statuses: "అన్ని స్థితిగతులు",
    all_risks: "అన్ని రిస్క్ స్థాయిలు",
    reset_filters: "ఫిల్టర్లు రీసెట్ చేయండి",
    works_mapped: "మ్యాప్ చేయబడిన పనులు",
    explore_works: "ప్రజా మౌలిక సదుపాయాల పనులను పరిశీలించండి",

    col_project_id: "ప్రాజెక్ట్ ఐడీ",
    col_title: "పని పేరు & ప్రాంతం",
    col_category: "శాఖ / విభాగం",
    col_constituency: "నియోజకవర్గం & ఎంపీ",
    col_financials: "మంజూరు / వ్యయం",
    col_progress: "పని పురోగతి",
    col_contractor: "కాంట్రాక్టర్",
    col_risk: "ఏఐ రిస్క్ స్థాయి",
    col_actions: "చర్య",
    trace_work: "360° పరిశీలన",
    view_evidence: "సాక్ష్యాలు",
    view_map: "మ్యాప్‌లో",
    close: "మూసివేయి",
    save: "భద్రపరచు",
    submit: "సమర్పించు",

    risk_normal: "సాధారణం",
    risk_watch: "పరిశీలనలో ఉంది",
    risk_high: "అధిక రిస్క్",
    risk_critical: "తీవ్రమైన నిఘా",

    status_completed: "పూర్తయింది",
    status_in_progress: "పురోగతిలో ఉంది",
    status_delayed: "ఆలస్యమైంది",
    status_stalled: "నిలిచిపోయింది",
    status_sanctioned: "మంజూరైంది",

    stat_total_projects: "మొత్తం పర్యవేక్షించబడుతున్న పనులు",
    stat_sanctioned_funds: "మొత్తం మంజూరైన నిధులు",
    stat_disbursed_funds: "విడుదల చేసిన నిధులు",
    stat_critical_anomalies: "క్రియాశీల తీవ్ర హెచ్చరికలు",
    stat_verified_works: "జియోట్యాగ్ ధృవీకరించిన పనులు",
    lang_switched: "భాష తెలుగులోకి మార్చబడింది",
  },
  ta: {
    platform_name: "எம்பிஎல்ஏடி-டிரேஸ் 360",
    tagline: "ஒவ்வொரு ரூபாயையும் கண்காணியுங்கள். பணிகளை உறுதிசெய்யுங்கள். எச்சரிக்கைகளைக் கண்டறியுங்கள்.",
    satyameva_jayate: "சத்யமேவ ஜெயதே",
    govt_of_india: "இந்திய அரசு • Government of India",
    mospi_active: "MoSPI e-SAKSHI & PFMS நேரலை",

    nav_landing: "முகப்பு",
    nav_departments: "துறை இணையதளங்கள்",
    nav_projects: "மக்கள் பணிகள் உலாவல்",
    nav_map: "இந்திய வரைபடம்",
    nav_funds: "நிதிப் பாய்ச்சல் பகுப்பாய்வு",
    nav_contracts: "ஒப்பந்தப் பதிவேடு",
    nav_contractors: "ஒப்பந்தக்காரர் மதிப்பீடு",
    nav_ai_risk: "AI இடர் மையம்",
    nav_disputes: "சர்ச்சை மேலாண்மை",
    nav_guarantees: "வங்கி உத்தரவாதம்",
    nav_inspections: "கள ஆய்வு (மொபைல்)",
    nav_complaints: "மக்கள் குறைகேட்பு மையம்",
    nav_alerts: "எச்சரிக்கை மற்றும் தீர்வு",
    nav_reports: "அதிகாரப்பூர்வ ஆவணங்கள்",
    nav_documents: "ஆவண பகுப்பாய்வு",
    nav_audit: "தணிக்கை பதிவேடு",
    nav_admin: "தரவு மேலாண்மை",

    cat_core: "முக்கிய தளங்கள்",
    cat_financials: "நிதி & ஒப்பந்தங்கள்",
    cat_intelligence: "AI பகுப்பாய்வு",
    cat_ground_ops: "களப் பணிகள்",
    cat_governance: "ஆளுகை & அறிக்கைகள்",
    cat_administration: "நிர்வாகம்",

    role_citizen: "குடிமகன்",
    role_officer: "கள அலுவலர்",
    role_district: "மாவட்ட அதிகாரி",
    role_admin: "உயர் அதிகாரி",

    hero_title_1: "மக்களின் ஒவ்வொரு ரூபாயும்.",
    hero_title_2: "கண்காணிப்பு, சரிபார்ப்பு மற்றும் எச்சரிக்கை.",
    hero_desc: "எம்பி தொகுதி வளர்ச்சித் திட்டப் பணிகளின் வெளிப்படையான AI கண்காணிப்பு தளம்.",
    hero_search_cta: "{count} வளர்ச்சிப் பணிகளைப் பார்க்கவும்",
    hero_map_cta: "நேரலை வரைபடத்தைத் திறக்கவும்",
    hero_missions_label: "தேசிய திட்டங்கள் & துறைகள்",
    hero_radar_title: "அகில இந்திய ரேடார் கண்காணிப்பு",
    hero_radar_desc: "24/7 செயற்கைக்கோள் எல்லை கண்காணிப்பு",
    hero_radar_stats: "{count} பணிகள் • {states} மாநிலங்கள் செயலில்",
    hero_national_case_study: "முக்கிய தேசிய திட்ட ஆய்வு",

    mission_water: "ஜல் ஜீவன் இயக்கம் (குடிநீர்)",
    mission_edu: "சமக்ர சிக்ஷா (கல்வி)",
    mission_health: "தேசிய சுகாதார இயக்கம்",
    mission_roads: "கிராம சாலை திட்டம் (நெடுஞ்சாலை)",
    mission_solar: "சூரிய ஆற்றல் துறை",
    mission_irrigation: "அமிர்த குளம் (பாசனம்)",
    mission_sanitation: "தூய்மை இந்தியா இயக்கம்",
    mission_community: "சமுதாயக் கூடங்கள்",

    search_placeholder: "திட்ட எண், ஊர், மாவட்டம், ஒப்பந்தக்காரர் அல்லது எம்பி பெயர்...",
    search_button: "தேடுக",
    clear_button: "நீக்கு",
    all_states: "அனைத்து மாநிலங்கள்",
    all_districts: "அனைத்து மாவட்டங்கள்",
    all_categories: "அனைத்து துறைகள்",
    all_statuses: "அனைத்து நிலைகள்",
    all_risks: "அனைத்து இடர் நிலைகள்",
    reset_filters: "வடிப்பான்களை மீட்டமைக்கவும்",
    works_mapped: "வரைபடப் பணிகள்",
    explore_works: "பொது உள்கட்டமைப்பு பணிகளை ஆராயுங்கள்",

    col_project_id: "திட்ட எண்",
    col_title: "பணிப் பெயர் & இடம்",
    col_category: "துறை",
    col_constituency: "தொகுதி & எம்பி",
    col_financials: "ஒதுக்கீடு / செலவு",
    col_progress: "முன்னேற்றம்",
    col_contractor: "ஒப்பந்தக்காரர்",
    col_risk: "இடர் நிலை",
    col_actions: "நடவடிக்கை",
    trace_work: "360° பார்வை",
    view_evidence: "சான்றுகள்",
    view_map: "வரைபடத்தில்",
    close: "மூடுக",
    save: "சேமி",
    submit: "சமர்ப்பி",

    risk_normal: "சாதாரணமானது",
    risk_watch: "கண்காணிப்பில்",
    risk_high: "அதிக இடர்",
    risk_critical: "தீவிர கண்காணிப்பு",

    status_completed: "முடிந்தது",
    status_in_progress: "நடைபெறுகிறது",
    status_delayed: "தாமதம்",
    status_stalled: "நிறுத்தப்பட்டது",
    status_sanctioned: "அனுமதிக்கப்பட்டது",

    stat_total_projects: "மொத்த பணிகள்",
    stat_sanctioned_funds: "ஒதுக்கப்பட்ட நிதி",
    stat_disbursed_funds: "வழங்கப்பட்ட நிதி",
    stat_critical_anomalies: "தீவிர எச்சரிக்கைகள்",
    stat_verified_works: "சரிபார்க்கப்பட்ட பணிகள்",
    lang_switched: "மொழி தமிழுக்கு மாற்றப்பட்டது",
  },
  bn: {
    platform_name: "এমপিলাড-ট্রেস ৩৬০",
    tagline: "প্রতিটি টাকার হিসাব। প্রতিটি কাজের যাচাই। প্রতিটি সতর্কতার পূর্বাভাস।",
    satyameva_jayate: "সত্যমেব জয়তে",
    govt_of_india: "ভারত সরকার • Government of India",
    mospi_active: "MoSPI e-SAKSHI এবং PFMS সক্রিয়",

    nav_landing: "মূল পাতা",
    nav_departments: "বিভাগীয় পোর্টাল",
    nav_projects: "জনকল্যাণমূলক কাজ অন্বেষণ",
    nav_map: "ভারতের লাইভ মানচিত্র",
    nav_funds: "তহবিল প্রবাহ বিশ্লেষণ",
    nav_contracts: "চুক্তি রেজিস্ট্রি",
    nav_contractors: "ঠিকাদার মূল্যায়ন",
    nav_ai_risk: "এআই ঝুঁকি কেন্দ্র",
    nav_disputes: "বিরোধ নিষ্পত্তি",
    nav_guarantees: "ব্যাংক গ্যারান্টি ট্র্যাকার",
    nav_inspections: "মাঠ পরিদর্শন (মোবাইল)",
    nav_complaints: "নাগরিক অভিযোগ পোর্টাল",
    nav_alerts: "সতর্কতা ও সমাধান",
    nav_reports: "অফিসিয়াল রিপোর্ট",
    nav_documents: "নথি বুদ্ধিমত্তা",
    nav_audit: "অডিট রেকর্ড ও লগ",
    nav_admin: "তথ্য ব্যবস্থাপনা",

    cat_core: "মূল পোর্টাল",
    cat_financials: "আর্থিক ও চুক্তি",
    cat_intelligence: "এআই বুদ্ধিমত্তা",
    cat_ground_ops: "মাঠ পর্যায়ের কাজ",
    cat_governance: "প্রশাসন ও রিপোর্ট",
    cat_administration: "ব্যবস্থাপনা",

    role_citizen: "নাগরিক",
    role_officer: "মাঠ কর্মকর্তা",
    role_district: "জেলা কর্তৃপক্ষ",
    role_admin: "উচ্চপদস্থ কর্তৃপক্ষ",

    hero_title_1: "জনগণের প্রতিটি টাকা।",
    hero_title_2: "নজরদারি, সত্যতা যাচাই ও পূর্বাভাস।",
    hero_desc: "এমপিএলএডিএস কাজের জন্য স্বায়ত্তশাসিত এআই নজরদারি প্ল্যাটফর্ম।",
    hero_search_cta: "{count}টি জনকল্যাণমূলক কাজ দেখুন",
    hero_map_cta: "ভারতের লাইভ ম্যাপ খুলুন",
    hero_missions_label: "জাতীয় মিশন ও প্রধান বিভাগসমূহ",
    hero_radar_title: "সর্বভারতীয় ভূ-স্থানিক রাডার",
    hero_radar_desc: "২৪/৭ স্বায়ত্তশাসিত নজরদারি",
    hero_radar_stats: "{count}টি কাজ • {states}টি সক্রিয় রাজ্য",
    hero_national_case_study: "জাতীয় ফ্ল্যাগশিপ কেস স্টাডি",

    mission_water: "জল জীবন মিশন (পানীয় জল)",
    mission_edu: "সমগ্র শিক্ষা (শিক্ষা)",
    mission_health: "জাতীয় স্বাস্থ্য মিশন",
    mission_roads: "গ্রাম সড়ক যোজনা (রাস্তা)",
    mission_solar: "সৌর শক্তি",
    mission_irrigation: "অমৃত সরোবর (সেচ)",
    mission_sanitation: "স্বচ্ছ ভারত মিশন",
    mission_community: "কমিউনিটি অবকাঠামো",

    search_placeholder: "প্রকল্প আইডি, শিরোনাম, গ্রাম, জেলা, ঠিকাদার বা এমপির নাম...",
    search_button: "অনুসন্ধান",
    clear_button: "মুছুন",
    all_states: "সকল রাজ্য",
    all_districts: "সকল জেলা",
    all_categories: "সকল বিভাগ",
    all_statuses: "সকল অবস্থা",
    all_risks: "সকল ঝুঁকির স্তর",
    reset_filters: "ফিল্টার রিসেট করুন",
    works_mapped: "ম্যাপ করা কাজসমূহ",
    explore_works: "পাবলিক ইনফ্রাস্ট্রাকচার কাজ অন্বেষণ করুন",

    col_project_id: "প্রকল্প আইডি",
    col_title: "কাজের নাম ও অবস্থান",
    col_category: "বিভাগ",
    col_constituency: "নির্বাচনী এলাকা ও এমপি",
    col_financials: "বরাদ্দ / ব্যয়",
    col_progress: "কাজের অগ্রগতি",
    col_contractor: "ঠিকাদার",
    col_risk: "ঝুঁকির মাত্রা",
    col_actions: "পদক্ষেপ",
    trace_work: "৩৬০° বিবরণ",
    view_evidence: "প্রমাণ দেখুন",
    view_map: "মানচিত্রে দেখুন",
    close: "বন্ধ করুন",
    save: "সংরক্ষণ করুন",
    submit: "জমা দিন",

    risk_normal: "স্বাভাবিক",
    risk_watch: "নজরদারিতে",
    risk_high: "উচ্চ ঝুঁকি",
    risk_critical: "জরুরি নজরদারি",

    status_completed: "সম্পূর্ণ",
    status_in_progress: "চলমান",
    status_delayed: "বিলম্বিত",
    status_stalled: "স্থগিত",
    status_sanctioned: "অনুমোদিত",

    stat_total_projects: "মোট প্রকল্প",
    stat_sanctioned_funds: "অনুমোদিত তহবিল",
    stat_disbursed_funds: "প্রদত্ত তহবিল",
    stat_critical_anomalies: "জরুরি সতর্কতা",
    stat_verified_works: "যাচাইকৃত কাজ",
    lang_switched: "ভাষা পরিবর্তন করে বাংলা করা হয়েছে",
  },
  mr: {
    platform_name: "खासदार निधी-ट्रेस ३६०",
    tagline: "प्रत्येक रुपयाचा हिशोब. प्रत्येक कामाची खात्री. प्रत्येक धोक्याचा इशारा.",
    satyameva_jayate: "सत्यमेव जयते",
    govt_of_india: "भारत सरकार • Government of India",
    mospi_active: "MoSPI e-SAKSHI आणि PFMS सक्रिय",

    nav_landing: "मुख्य पृष्ठ",
    nav_departments: "विभागीय दालन",
    nav_projects: "सार्वजनिक कामे शोधा",
    nav_map: "भारताचा थेट नकाशा",
    nav_funds: "निधी प्रवाह विश्लेषण",
    nav_contracts: "कंत्राट नोंदवही",
    nav_contractors: "कंत्राटदार कार्यक्षमता",
    nav_ai_risk: "एआय जोखीम केंद्र",
    nav_disputes: "वाद निवारण कक्ष",
    nav_guarantees: "बँक हमी ट्रॅकर",
    nav_inspections: "क्षेत्रीय तपासणी (मोबाइल)",
    nav_complaints: "नागरिक तक्रार निवारण",
    nav_alerts: "धोका इशारा प्रणाली",
    nav_reports: "अधिकृत अहवाल",
    nav_documents: "कागदपत्र विश्लेषण",
    nav_audit: "ऑडिट नोंदी",
    nav_admin: "डेटा व्यवस्थापन",

    cat_core: "मुख्य विभाग",
    cat_financials: "आर्थिक व कंत्राट",
    cat_intelligence: "एआय बुद्धिमत्ता",
    cat_ground_ops: "जमिनीवरील कामे",
    cat_governance: "प्रशासन व अहवाल",
    cat_administration: "व्यवस्थापन",

    role_citizen: "नागरिक",
    role_officer: "क्षेत्रीय अधिकारी",
    role_district: "जिल्हाधिकारी",
    role_admin: "वरिष्ठ प्रशासक",

    hero_title_1: "जनतेचा प्रत्येक रुपया.",
    hero_title_2: "पारदर्शकता, खात्री आणि वेळेआधी इशारा.",
    hero_desc: "खासदार निधी कामांची स्वायत्त एआय देखरेख यंत्रणा.",
    hero_search_cta: "{count} विकास कामे तपासा",
    hero_map_cta: "भारताचा थेट नकाशा उघडा",
    hero_missions_label: "राष्ट्रीय मोहिमा व महत्त्वाची खाती",
    hero_radar_title: "अखिल भारतीय भू-स्थानिक रडार",
    hero_radar_desc: "२४/७ स्वायत्त उपग्रह देखरेख",
    hero_radar_stats: "{count} कामे • {states} सक्रिय राज्ये",
    hero_national_case_study: "राष्ट्रीय प्रमुख प्रकल्प अभ्यास",

    mission_water: "जल जीवन मिशन (पिण्याचे पाणी)",
    mission_edu: "समग्र शिक्षा",
    mission_health: "आरोग्य मिशन",
    mission_roads: "ग्राम सडक योजना (रस्ते)",
    mission_solar: "सौर ऊर्जा",
    mission_irrigation: "अमृत सरोवर (जलसंधारण)",
    mission_sanitation: "स्वच्छ भारत अभियान",
    mission_community: "सामाजिक सभागृह",

    search_placeholder: "प्रकल्प क्रमांक, कामाचे नाव, गाव, जिल्हा, कंत्राटदार किंवा खासदार...",
    search_button: "शोधा",
    clear_button: "साफ करा",
    all_states: "सर्व राज्ये",
    all_districts: "सर्व जिल्हे",
    all_categories: "सर्व विभाग",
    all_statuses: "सर्व स्थिती",
    all_risks: "सर्व जोखीम स्तर",
    reset_filters: "फिल्टर पूर्ववत करा",
    works_mapped: "नकाशावरील कामे",
    explore_works: "सार्वजनिक कामे एक्सप्लोर करा",

    col_project_id: "प्रकल्प क्र.",
    col_title: "कामाचे नाव व ठिकाण",
    col_category: "विभाग",
    col_constituency: "मतदारसंघ व खासदार",
    col_financials: "मंजूर / खर्च",
    col_progress: "कामाची प्रगती",
    col_contractor: "कंत्राटदार",
    col_risk: "जोखीम पातळी",
    col_actions: "कृती",
    trace_work: "३६०° माहिती",
    view_evidence: "पुरावे पहा",
    view_map: "नकाशावर",
    close: "बंद करा",
    save: "जतन करा",
    submit: "सादर करा",

    risk_normal: "सामान्य",
    risk_watch: "निगराणीखाली",
    risk_high: "उच्च जोखीम",
    risk_critical: "तातडीची दक्षता",

    status_completed: "पूर्ण",
    status_in_progress: "प्रगतीपथावर",
    status_delayed: "विलंबित",
    status_stalled: "थांबलेले",
    status_sanctioned: "मंजूर",

    stat_total_projects: "एकूण कामे",
    stat_sanctioned_funds: "मंजूर निधी",
    stat_disbursed_funds: "वितरित निधी",
    stat_critical_anomalies: "गंभीर इशारे",
    stat_verified_works: "पडताळणी कामे",
    lang_switched: "भाषा बदलून मराठी करण्यात आली आहे",
  },
  kn: {
    platform_name: "ಎಂಪಿಲ್ಯಾಡ್-ಟ್ರೇಸ್ 360",
    tagline: "ಪ್ರತಿ ರೂಪಾಯಿಯ ಮೇಲ್ವಿಚಾರಣೆ. ಪ್ರತಿ ಕಾಮಗಾರಿಯ ದೃಢೀಕರಣ. ಮುನ್ಸೂಚನೆ ಎಚ್ಚರಿಕೆ.",
    satyameva_jayate: "ಸತ್ಯಮೇವ ಜಯತೇ",
    govt_of_india: "ಭಾರತ ಸರ್ಕಾರ • Government of India",
    mospi_active: "MoSPI e-SAKSHI & PFMS ಸಕ್ರಿಯ",

    nav_landing: "ಮುಖಪುಟ",
    nav_departments: "ಇಲಾಖಾ ಪೋರ್ಟಲ್‌ಗಳು",
    nav_projects: "ಸಾರ್ವಜನಿಕ ಕಾಮಗಾರಿಗಳ ಅನ್ವೇಷಣೆ",
    nav_map: "ಲೈವ್ ಭಾರತ ನಕ್ಷೆ",
    nav_funds: "ಹಣಕಾಸು ಹರಿವಿನ ವಿಶ್ಲೇಷಣೆ",
    nav_contracts: "ಗುತ್ತಿಗೆಗಳ ನೋಂದಣಿ",
    nav_contractors: "ಗುತ್ತಿಗೆದಾರರ ಕಾರ್ಯಕ್ಷಮತೆ",
    nav_ai_risk: "ಎಐ ರಿಸ್ಕ್ ಕೇಂದ್ರ",
    nav_disputes: "ವಿವಾದಗಳ ನಿರ್ವಹಣೆ",
    nav_guarantees: "ಬ್ಯಾಂಕ್ ಗ್ಯಾರಂಟಿ ಟ್ರ್ಯಾಕರ್",
    nav_inspections: "ಸ್ಥಳ ಪರಿಶೀಲನೆ (ಮೊಬೈಲ್)",
    nav_complaints: "ಸಾರ್ವಜನಿಕ ದೂರುಗಳ ಪೋರ್ಟಲ್",
    nav_alerts: "ಎಚ್ಚರಿಕೆ ಇಂಜಿನ್",
    nav_reports: "ಅಧಿಕೃತ ವರದಿಗಳು",
    nav_documents: "ದಾಖಲೆಗಳ ವಿಶ್ಲೇಷಣೆ",
    nav_audit: "ಆಡಿಟ್ ದಾಖಲೆಗಳು",
    nav_admin: "ಡೇಟಾ ನಿರ್ವಹಣೆ",

    cat_core: "ಮುಖ್ಯ ಪೋರ್ಟಲ್ಸ್",
    cat_financials: "ಹಣಕಾಸು & ಗುತ್ತಿಗೆ",
    cat_intelligence: "ಎಐ ವಿಶ್ಲೇಷಣೆ",
    cat_ground_ops: "ಕ್ಷೇತ್ರ ಮಟ್ಟದ ಕಾಮಗಾರಿ",
    cat_governance: "ಆಡಳಿತ & ವರದಿಗಳು",
    cat_administration: "ಆಡಳಿತ",

    role_citizen: "ನಾಗರಿಕ",
    role_officer: "ಕ್ಷೇತ್ರಾಧಿಕಾರಿ",
    role_district: "ಜಿಲ್ಲಾಧಿಕಾರಿ",
    role_admin: "ಉನ್ನತಾಧಿಕಾರಿ",

    hero_title_1: "ಜನತೆಯ ಪ್ರತಿಯೊಂದು ರೂಪಾಯಿ.",
    hero_title_2: "ನಿಗಾ, ದೃಢೀಕರಣ ಮತ್ತು ಮುನ್ಸೂಚನೆ ಎಚ್ಚರಿಕೆ.",
    hero_desc: "ಸಂಸದರ ಪ್ರದೇಶಾಭಿವೃದ್ಧಿ ಯೋಜನೆ ಕಾಮಗಾರಿಗಳ ಸ್ವಾಯತ್ತ ಎಐ ಮೇಲ್ವಿಚಾರಣಾ ವ್ಯವಸ್ಥೆ.",
    hero_search_cta: "{count} ಸಾರ್ವಜನಿಕ ಕಾಮಗಾರಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    hero_map_cta: "ಲೈವ್ ಭಾರತ ನಕ್ಷೆ ತೆರೆಯಿರಿ",
    hero_missions_label: "ರಾಷ್ಟ್ರೀಯ ಮಿಷನ್‌ಗಳು ಮತ್ತು ಇಲಾಖೆಗಳು",
    hero_radar_title: "ಅಖಿಲ ಭಾರತ ರೇಡಾರ್ ಕಣ್ಗಾವಲು",
    hero_radar_desc: "24/7 ಸ್ಯಾಟಲೈಟ್ ಭದ್ರತೆ",
    hero_radar_stats: "{count} ಕಾಮಗಾರಿಗಳು • {states} ರಾಜ್ಯಗಳು ಸಕ್ರಿಯ",
    hero_national_case_study: "ರಾಷ್ಟ್ರೀಯ ಪ್ರಮುಖ ಅಧ್ಯಯನ",

    mission_water: "ಜಲ ಜೀವನ್ ಮಿಷನ್ (ಕುಡಿಯುವ ನೀರು)",
    mission_edu: "ಸಮಗ್ರ ಶಿಕ್ಷಣ",
    mission_health: "ಆರೋಗ್ಯ ಮಿಷನ್",
    mission_roads: "ಗ್ರಾಮ ಸಡಕ್ ಯೋಜನೆ (ರಸ್ತೆಗಳು)",
    mission_solar: "ಸೌರ ಶಕ್ತಿ",
    mission_irrigation: "ಅಮೃತ ಸರೋವರ (ನೀರಾವರಿ)",
    mission_sanitation: "ಸ್ವಚ್ಛ ಭಾರತ ಅಭಿಯಾನ",
    mission_community: "ಸಮುದಾಯ ಭವನಗಳು",

    search_placeholder: "ಯೋಜನೆ ಸಂಖ್ಯೆ, ಶೀರ್ಷಿಕೆ, ಗ್ರಾಮ, ಜಿಲ್ಲೆ, ಗುತ್ತಿಗೆದಾರ ಅಥವಾ ಸಂಸದರ ಹೆಸರು...",
    search_button: "ಹುಡುಕಿ",
    clear_button: "ಅಳಿಸಿ",
    all_states: "ಎಲ್ಲಾ ರಾಜ್ಯಗಳು",
    all_districts: "ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು",
    all_categories: "ಎಲ್ಲಾ ಇಲಾಖೆಗಳು",
    all_statuses: "ಎಲ್ಲಾ ಸ್ಥಿತಿಗಳು",
    all_risks: "ಎಲ್ಲಾ ರಿಸ್ಕ್ ಹಂತಗಳು",
    reset_filters: "ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ",
    works_mapped: "ಮ್ಯಾಪ್ ಮಾಡಲಾದ ಕಾಮಗಾರಿಗಳು",
    explore_works: "ಸಾರ್ವಜನಿಕ ಮೂಲಸೌಕರ್ಯ ಕಾಮಗಾರಿಗಳು",

    col_project_id: "ಯೋಜನಾ ಐಡಿ",
    col_title: "ಕಾಮಗಾರಿ ಹೆಸರು & ಸ್ಥಳ",
    col_category: "ಇಲಾಖೆ",
    col_constituency: "ಕ್ಷೇತ್ರ & ಸಂಸದರು",
    col_financials: "ಮಂಜೂರಾದ / ವೆಚ್ಚವಾದ ಮೊತ್ತ",
    col_progress: "ಕಾಮಗಾರಿ ಪ್ರಗತಿ",
    col_contractor: "ಗುತ್ತಿಗೆದಾರರು",
    col_risk: "ರಿಸ್ಕ್ ಮಟ್ಟ",
    col_actions: "ಕ್ರಮ",
    trace_work: "360° ವಿವರ",
    view_evidence: "ಸಾಕ್ಷ್ಯಗಳು",
    view_map: "ನಕ್ಷೆಯಲ್ಲಿ",
    close: "ಮುಚ್ಚಿ",
    save: "ಉಳಿಸಿ",
    submit: "ಸಲ್ಲಿಸಿ",

    risk_normal: "ಸಾಮಾನ್ಯ",
    risk_watch: "ಮೇಲ್ವಿಚಾರಣೆಯಲ್ಲಿ",
    risk_high: "ಹೆಚ್ಚಿನ ರಿಸ್ಕ್",
    risk_critical: "ತೀವ್ರ ಕಣ್ಗಾವಲು",

    status_completed: "ಪೂರ್ಣಗೊಂಡಿದೆ",
    status_in_progress: "ಪ್ರಗತಿಯಲ್ಲಿದೆ",
    status_delayed: "ವಿಳಂಬವಾಗಿದೆ",
    status_stalled: "ಸ್ಥಗಿತಗೊಂಡಿದೆ",
    status_sanctioned: "ಮಂಜೂರಾಗಿದೆ",

    stat_total_projects: "ಒಟ್ಟು ಕಾಮಗಾರಿಗಳು",
    stat_sanctioned_funds: "ಮಂಜೂರಾದ ಅನುದಾನ",
    stat_disbursed_funds: "ಬಿಡುಗಡೆಯಾದ ಅನುದಾನ",
    stat_critical_anomalies: "ಗಂಭೀರ ಎಚ್ಚರಿಕೆಗಳು",
    stat_verified_works: "ದೃಢೀಕೃತ ಕಾಮಗಾರಿಗಳು",
    lang_switched: "ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ",
  }
};

// Synchronize key-based DICTIONARY into PHRASE_DICTIONARY and REVERSE_DICTIONARY
try {
  (['hi', 'te', 'ta', 'bn', 'mr', 'kn'] as Language[]).forEach(lang => {
    const dict = DICTIONARY[lang];
    const enDict = DICTIONARY.en;
    if (dict && enDict && PHRASE_DICTIONARY[lang]) {
      for (const [key, localized] of Object.entries(dict)) {
        const enPhrase = enDict[key];
        if (enPhrase && localized && localized.trim() !== enPhrase.trim()) {
          const trimmedEn = enPhrase.trim();
          const trimmedLoc = localized.trim();
          PHRASE_DICTIONARY[lang][trimmedEn] = trimmedLoc;
          REVERSE_DICTIONARY[trimmedLoc] = trimmedEn;
        }
      }
    }
  });

  const newEntries = Object.entries(REVERSE_DICTIONARY).sort((a, b) => b[0].length - a[0].length);
  REVERSE_ENTRIES.length = 0;
  REVERSE_ENTRIES.push(...newEntries);
} catch {
  // safe fallback
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('mplad_language');
    if (saved && (['en', 'hi', 'te', 'ta', 'bn', 'mr', 'kn'] as string[]).includes(saved)) {
      return saved as Language;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mplad_language', lang);
  };

  const t = (key: string, fallback?: string): string => {
    const trimmed = key ? key.trim() : '';
    if (PHRASE_DICTIONARY[language] && PHRASE_DICTIONARY[language][trimmed]) {
      return PHRASE_DICTIONARY[language][trimmed];
    }
    if (DICTIONARY[language] && DICTIONARY[language][key]) {
      return DICTIONARY[language][key];
    }
    if (DICTIONARY['en'] && DICTIONARY['en'][key]) {
      return DICTIONARY['en'][key];
    }
    return fallback || key;
  };

  // Run DOM internationalization whenever language changes or DOM updates
  useEffect(() => {
    let timeoutId: any;
    let isTranslating = false;

    const runTranslation = () => {
      if (isTranslating) return;
      isTranslating = true;
      try {
        translateDOM(language);
      } finally {
        isTranslating = false;
      }
    };

    // Run immediately on render or language change, and subsequent passes for deferred subcomponents
    runTranslation();
    const t1 = setTimeout(runTranslation, 50);
    const t2 = setTimeout(runTranslation, 200);

    // Observe DOM mutations to dynamically translate new elements (navigation, modals, tables)
    const observer = new MutationObserver((mutations) => {
      if (isTranslating) return;
      let shouldTranslate = false;
      for (const m of mutations) {
        if (m.type === 'childList' && m.addedNodes.length > 0) {
          shouldTranslate = true;
          break;
        }
      }
      if (shouldTranslate) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(runTranslation, 40);
      }
    });

    const root = document.getElementById('root') || document.body;
    if (root) {
      observer.observe(root, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

