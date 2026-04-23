let accessToken: string | null = null;

export const authStore = {
  setAccessToken: (token: string) => {
    accessToken = token;
  },

  getAccessToken: (): string | null => accessToken,

  clearAccessToken: () => {
    accessToken = null;
  },

  isAuthenticated: () => Boolean(accessToken),
};
