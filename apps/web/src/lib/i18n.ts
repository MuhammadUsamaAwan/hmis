import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { z } from "zod";
import type { $ZodErrorMap } from "zod/v4/core";
import en from "../locales/en/translation.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof en;
    };
  }
}

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
    },
    fallbackLng: "en",
    load: "languageOnly",
    detection: {
      order: ["navigator", "querystring", "cookie", "localStorage", "htmlTag", "path", "subdomain"],
      caches: ["localStorage", "cookie"],
      lookupQuerystring: "lng",
      lookupCookie: "i18next",
      lookupLocalStorage: "i18nextLng",
    },
    interpolation: {
      escapeValue: false,
    },
  });

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: no cleaner way
export const zodErrorMap: $ZodErrorMap = issue => {
  switch (issue.code) {
    case "invalid_type": {
      if (issue.input === undefined || issue.input === null) {
        return i18next.t("validation.required");
      }
      return i18next.t("validation.invalidInput");
    }
    case "too_small": {
      if (issue.origin === "string" && issue.minimum === 1) {
        return i18next.t("validation.required");
      }
      return i18next.t("validation.tooSmall", { count: Number(issue.minimum) });
    }
    case "too_big": {
      return i18next.t("validation.tooBig", { count: Number(issue.maximum) });
    }
    case "invalid_value": {
      return i18next.t("validation.invalidValue");
    }
    case "invalid_format": {
      if (issue.format === "email") {
        if (issue.input === "") {
          return i18next.t("validation.required");
        }
        return i18next.t("validation.invalidEmail");
      }
      if (issue.format === "date" || issue.format === "datetime") {
        return i18next.t("validation.invalidDate");
      }
      return i18next.t("validation.invalidInput");
    }
    case "custom": {
      if (issue.params?.["i18nKey"]) {
        return i18next.t(issue.params["i18nKey"]);
      }
      return i18next.t("validation.invalidInput");
    }
    default: {
      return i18next.t("validation.invalidInput");
    }
  }
};

z.config({ customError: zodErrorMap });
