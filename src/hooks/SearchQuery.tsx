import { useState, useMemo } from "react";

const useSearch = <T extends Record<string, any>>(data: T[]) => {
  const [searchQuery, setSearchQuery] = useState("");

  const searchKeys = useMemo(() => 
    data?.length > 0 ? (Object.keys(data[0]) as (keyof T)[]) : [], 
    [data]
  );

  const filteredData = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    return data?.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        return value && String(value).toLowerCase().includes(normalizedQuery);
      })
    );
  }, [data, searchKeys, searchQuery]);

  return { searchQuery, setSearchQuery, filteredData };
};

export default useSearch;
