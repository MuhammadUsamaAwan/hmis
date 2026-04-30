import { type PatientRegistrationSchema, queryKeys } from "@app/validations";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { getEden, throwEdenError } from "./lib/eden";

export const registerPatientMutationOptions = () =>
  mutationOptions({
    mutationFn: async (body: PatientRegistrationSchema) => {
      const res = await getEden().patients.register.post(body);
      if (res.error) {
        throwEdenError(res.error);
      }
      return res.data;
    },
  });

export const searchPatientsQueryOptions = (q: string) =>
  queryOptions({
    queryKey: queryKeys.patients.list({ q }),
    queryFn: async () => {
      const res = await getEden().patients.search.get({ query: { q } });
      if (res.error) {
        throwEdenError(res.error);
      }
      return res.data;
    },
    enabled: q.length > 0,
  });
