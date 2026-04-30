export const queryKeys = {
  me: ["me"] as const,
  permissions: {
    all: ["permissions"] as const,
  },
};

export type Resource = keyof typeof queryKeys;
