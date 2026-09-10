import { Language } from '../types';

export const LANGUAGE_LABELS: Record<Language, { native: string; english: string; code: string }> = {
  en: { native: "English", english: "English", code: "EN" },
  hi: { native: "हिंदी", english: "Hindi", code: "HI" },
  te: { native: "తెలుగు", english: "Telugu", code: "TE" },
  ta: { native: "தமிழ்", english: "Tamil", code: "TA" },
  bn: { native: "বাংলা", english: "Bengali", code: "BN" },
  mr: { native: "मराठी", english: "Marathi", code: "MR" },
  kn: { native: "ಕನ್ನಡ", english: "Kannada", code: "KN" },
};
