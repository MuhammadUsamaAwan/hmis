import { configure } from "@app/client/eden";
import i18next from "i18next";
import { BASE_URL } from "../config/constants";
import { authStore } from "./auth-store";

configure({
  getBaseUrl: () => BASE_URL,
  getLanguage: () => i18next.language,
  getToken: () => authStore.getAccessToken(),
  onTokenRefreshed: token => authStore.setAccessToken(token),
  onUnauthenticated: () => authStore.clearAccessToken(),
});
