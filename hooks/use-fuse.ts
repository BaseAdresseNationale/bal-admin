import Fuse from "fuse.js";
import { useCallback } from "react";

export const useFuse = (
  data: any[],
  keys: string[],
  setter: (values: { label: string; value: string }[]) => void
) => {
  return useCallback(
    (search) => {
      const fuse = new Fuse(data, {
        keys,
        threshold: 0.4,
      });
      if (search.length <= 2) {
        setter([]);
      } else if (search.length > 2) {
        const results = fuse.search(search).slice(0, 10);
        setter(
          results.map(({ item }) => ({
            label: `${item.nom} (${item.code})`,
            value: item.code,
          }))
        );
      }
    },
    [data, keys, setter]
  );
};
