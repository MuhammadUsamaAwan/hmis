import { type ChangePasswordSchema, type Permission, queryKeys, type UpdateProfileSchema } from "@app/validations";
import { mutationOptions, queryOptions, useQuery } from "@tanstack/react-query";
import { getEden } from "./lib/eden";

export const meQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.me,
    queryFn: async () => {
      const res = await getEden().users.me.get();
      if (res.error) {
        throw new Error("Failed to fetch user");
      }
      return res.data;
    },
    staleTime: Number.POSITIVE_INFINITY,
  });

export const userPermissionsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.permissions.all,
    queryFn: async () => (await getEden().users.me.permissions.get()).data ?? [],
    staleTime: Number.POSITIVE_INFINITY,
  });

export const updateProfileMutationOptions = () =>
  mutationOptions({
    mutationFn: async (body: UpdateProfileSchema) => {
      const res = await getEden().users.me.patch(body);
      if (res.error) {
        throw new Error(res.error.value.message);
      }
      return res.data;
    },
  });

export const changePasswordMutationOptions = () =>
  mutationOptions({
    mutationFn: async (body: ChangePasswordSchema) => {
      const res = await getEden().users.me["change-password"].post(body);
      if (res.error) {
        throw new Error(res.error.value.message);
      }
      return res.data;
    },
  });

export const useHasPermission = (...required: Permission[]) => {
  const { data: permissions = [] } = useQuery(userPermissionsQueryOptions());
  return required.every(p => (permissions as string[]).includes(p));
};
