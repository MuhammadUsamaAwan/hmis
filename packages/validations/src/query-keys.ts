export const queryKeys = {
  me: {
    all: ["me"] as const,
  },
  permissions: {
    all: ["permissions"] as const,
  },
  patients: {
    all: ["patients"] as const,
    list: (params?: Record<string, unknown>) => ["patients", "list", params] as const,
    detail: (id: string) => ["patients", "detail", id] as const,
  },
};

export type Resource = keyof typeof queryKeys;
