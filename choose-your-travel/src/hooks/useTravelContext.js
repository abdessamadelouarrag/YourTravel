import { useSearchParams } from "react-router-dom";

export function useTravelContext() {
  const [params] = useSearchParams();
  const context = new URLSearchParams();
  for (const key of ["date", "travelers"]) {
    if (params.get(key)) context.set(key, params.get(key));
  }
  return {
    destinationUrl(id) {
      return `/destination/${id}${context.size ? `?${context}` : ""}`;
    },
    plannerUrl(id, activity) {
      const query = new URLSearchParams(context);
      if (id) query.set("destination", id);
      if (activity !== undefined) query.set("activity", activity);
      return `/planner${query.size ? `?${query}` : ""}`;
    },
  };
}
