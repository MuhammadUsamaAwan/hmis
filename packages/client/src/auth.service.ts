import type { SigninSchema } from "@app/validations";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { getEden } from "./lib/eden";

export const signinMutationOptions = () =>
  mutationOptions({
    mutationFn: async (body: SigninSchema) => {
      const res = await getEden().signin.post(body);
      if (res.error) {
        throw new Error(res.error.value.message);
      }
      return res.data;
    },
  });

export const refreshQueryOptions = () =>
  queryOptions({
    queryKey: ["refresh"],
    queryFn: async () => (await getEden().refresh.get()).data,
  });

export const signoutMutationOptions = () =>
  mutationOptions({
    mutationFn: async () => (await getEden().signout.post()).data,
  });
