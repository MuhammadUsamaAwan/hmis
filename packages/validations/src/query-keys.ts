export const queryKeys = {
  permissions: {
    all: ["permissions"] as const,
  },
};

export type Resource = keyof typeof queryKeys;
