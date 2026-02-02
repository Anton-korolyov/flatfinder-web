import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import he from "./he.json";
import ru from "./ru.json";
import en from "./en.json";

i18n.use(initReactI18next).init({
  resources: {
    he: { translation: he },
    ru: { translation: ru },
    en: { translation: en }
  },
  lng: "he",          // 👈 старт всегда иврит
  fallbackLng: "he",
  interpolation: { escapeValue: false }
});

export default i18n;
