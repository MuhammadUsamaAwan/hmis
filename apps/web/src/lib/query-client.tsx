import { toast } from "@app/ui/toast";
import { MutationCache, QueryClient, type QueryKey } from "@tanstack/react-query";
import i18next from "i18next";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      successMessage?: string;
      showErrorMessage?: true;
      invalidateQueries?: QueryKey[];
    };
  }
}

export interface MutationMeta {
  successMessage?: string;
  showErrorMessage?: true;
  invalidateQueries?: QueryKey | QueryKey[];
}

export function onMutationSuccess(
  _data: unknown,
  _variables: unknown,
  _context: unknown,
  mutation: { meta?: MutationMeta | undefined }
): void {
  if (mutation.meta?.successMessage) {
    toast.success(i18next.t("common.success"), { description: mutation.meta.successMessage });
  }
  if (mutation.meta?.invalidateQueries) {
    const keys = mutation.meta.invalidateQueries;
    queryClient.invalidateQueries({ queryKey: keys });
  }
}

export function onMutationError(
  error: unknown,
  _variables: unknown,
  _context: unknown,
  mutation: { meta?: MutationMeta | undefined }
): void {
  if (mutation.meta?.showErrorMessage) {
    toast.error(i18next.t("common.error"), {
      description: error instanceof Error ? error.message : i18next.t("common.errorFallbackMessage"),
    });
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
  mutationCache: new MutationCache({
    onSuccess: onMutationSuccess,
    onError: onMutationError,
  }),
});
