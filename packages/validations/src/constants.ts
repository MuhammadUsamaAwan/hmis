export const PERMISSIONS = {
  VIEW_USERS: "View Users",
} as const;
export const permissions = Object.values(PERMISSIONS) as [Permission, ...Permission[]];
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
