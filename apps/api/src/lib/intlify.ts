import { detectLocaleFromAcceptLanguageHeader, intlify as elysiaIntlify } from "@intlify/elysia";
import en from "@/api/locales/en/translation.json";

type ResourceSchema = typeof en;

declare module "@intlify/elysia" {
  export interface DefineLocaleMessage extends ResourceSchema {}
}

export const intlify = elysiaIntlify({
  locale: detectLocaleFromAcceptLanguageHeader,
  messages: {
    en,
  },
});
