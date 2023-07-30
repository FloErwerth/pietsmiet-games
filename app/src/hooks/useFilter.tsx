import { useMemo, useState } from "react";

export function useFilter<T extends Array<unknown>>(values: T) {
  const [filter, setFilter] = useState<string>("");

  const filtered = useMemo(
    () =>
      values.filter(
        (value) =>
          value?.toString().toLowerCase().includes(filter.toLowerCase()),
      ) as T,
    [values, filter],
  );

  return [filter, setFilter, filtered] as const;
}
