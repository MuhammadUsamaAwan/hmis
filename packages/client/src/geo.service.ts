import { queryOptions } from "@tanstack/react-query";
import { getEden, throwEdenError } from "./lib/eden";

export const tehsilsQueryOptions = () =>
  queryOptions({
    queryKey: ["geo", "tehsils"],
    queryFn: async () => {
      const res = await getEden().geo.tehsils.get();
      if (res.error) {
        throwEdenError(res.error);
      }
      return res.data;
    },
  });
