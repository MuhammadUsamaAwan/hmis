import { type Permission, queryKeys } from "@app/validations";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { getEden } from "./lib/eden";

export const userPermissionsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.permissions.all,
    queryFn: async () => (await getEden().users.me.permissions.get()).data ?? [],
    staleTime: Number.POSITIVE_INFINITY,
  });

export const useHasPermission = (...required: Permission[]) => {
  const { data: permissions = [] } = useQuery(userPermissionsQueryOptions());
  return required.every(p => (permissions as string[]).includes(p));
};
