import { type PaginatedQueryParams, type PatientRegistrationSchema, queryKeys } from "@app/validations";
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

export const listPatientsQueryOptions = (params: PaginatedQueryParams) =>
  queryOptions({
    queryKey: queryKeys.patients.list({ ...params }),
    queryFn: async () => {
      const res = await getEden().patients.get({
        query: {
          page: params.page,
          pageSize: params.pageSize,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
          q: params.q,
        },
      });
      if (res.error) {
        throwEdenError(res.error);
      }
      return res.data;
    },
  });
