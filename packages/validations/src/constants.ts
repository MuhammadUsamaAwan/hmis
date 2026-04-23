export const PERMISSIONS = {} as const;
export const permissions = Object.values(PERMISSIONS) as [Permission, ...Permission[]];
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
