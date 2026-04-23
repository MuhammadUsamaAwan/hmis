import { treaty } from "@elysiajs/eden";
import type { App } from "@/api/app";

interface EdenOptions {
  getBaseUrl: () => string;
  getLanguage: () => string;
  getToken: () => string | null;
  onTokenRefreshed: (token: string) => void;
  onUnauthenticated: () => void;
}
export type EdenInstance = ReturnType<typeof treaty<App>>;
export class EdenClient {
  private instance: EdenInstance | null = null;
  private refreshPromise: Promise<string | null> | null = null;
  private getToken: (() => string | null) | null = null;
  private baseUrl: string | null = null;

  private refreshAccessToken(baseUrl: string): Promise<string | null> {
    if (this.refreshPromise !== null) {
      return this.refreshPromise;
    }

    this.refreshPromise = fetch(`${baseUrl}/refresh`, { credentials: "include" })
      .then(async res => {
        if (!res.ok) {
          return null;
        }
        const { accessToken } = (await res.json()) as { accessToken: string };
        return accessToken;
      })
      .finally(() => {
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  configure(options: EdenOptions): void {
    this.getToken = options.getToken;
    const baseUrl = options.getBaseUrl();
    this.baseUrl = baseUrl;
    this.instance = treaty<App>(baseUrl, {
      fetcher: (async (input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) => {
        const token = options.getToken();
        const headers = new Headers(init?.headers);

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }

        headers.set("Accept-Language", options.getLanguage());

        const res = await fetch(input, { ...init, headers, credentials: "include" });

        if (res.status === 401) {
          const newToken = await this.refreshAccessToken(baseUrl);

          if (newToken) {
            options.onTokenRefreshed(newToken);
            headers.set("Authorization", `Bearer ${newToken}`);
            return fetch(input, { ...init, headers, credentials: "include" });
          }

          options.onUnauthenticated();
        }

        return res;
      }) as typeof fetch,
    });
  }

  getEden(): EdenInstance {
    if (!this.instance) {
      throw new Error("@app/client: call configure() before using the client");
    }
    return this.instance;
  }

  getWsUrl(): string {
    if (!this.baseUrl) {
      throw new Error("@app/client: call configure() before using the client");
    }
    const token = this.getToken?.();
    const url = new URL("/ws", this.baseUrl.replace(/^http/, "ws"));
    if (token) {
      url.searchParams.set("authorization", `Bearer ${token}`);
    }
    return url.toString();
  }
}

export const edenClient = new EdenClient();

export const configure = edenClient.configure.bind(edenClient);
export const getEden = edenClient.getEden.bind(edenClient);
export const getWsUrl = edenClient.getWsUrl.bind(edenClient);
