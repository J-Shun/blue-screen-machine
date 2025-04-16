import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocalStorageItem, setLocalStorageItem } from "./utils";
import en from "./locales/en.json";
import zh_tw from "./locales/zh-TW.json";
import ja from "./locales/ja.json";

const supportedLanguages = ["zh-TW", "en", "ja"];

// 嘗試從 localStorage 獲取語言設置
// 如果 localStorage 中沒有語言設置，則根據瀏覽器偏好設置
// navigator.language 如果碰到 zh 開頭的語言, 一律使用 zh-TW
// 其餘語言使用前兩碼 (en-US -> en)
const systemLanguage = navigator.language.startsWith("zh")
  ? "zh-TW"
  : navigator.language.split("-")[0];
const currentLang = getLocalStorageItem("language") || systemLanguage;

// 是否在支援列表中，如果不在則預設使用 'zh-TW'
const defaultLanguage = supportedLanguages.includes(currentLang)
  ? currentLang
  : "zh-TW";

// 將語言設置保存到 localStorage
setLocalStorageItem("language", defaultLanguage);

const resources = {
  en: {
    translation: en,
  },
  "zh-TW": {
    translation: zh_tw,
  },
  ja: {
    translation: ja,
  },
};

/**
 * i18n 初始化
 * note: 將語言設為 "cimode" 可以只顯示 key
 * reference: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
 */
export const setupI18n = () => {
  i18n.use(initReactI18next).init({
    resources,
    // https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    supportedLngs: supportedLanguages,
    nonExplicitSupportedLngs: false,
    load: "currentOnly",
    lng: defaultLanguage,
    fallbackLng: defaultLanguage,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });
};
