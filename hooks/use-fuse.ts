import Fuse from "fuse.js";
import { useCallback } from "react";

export const useFuse = <T>(data: T[], options: Fuse.IFuseOptions<T>) => {
  return useCallback(
    (search) => {
      const fuse = new Fuse(data, options);
      if (search.length <= 2) {
        return [];
      } else if (search.length > 2) {
        return fuse.search(search).slice(0, 10);
      }
    },
    [data, options]
  );
};
