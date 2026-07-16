import { useQuery } from "@tanstack/react-query";
import { get } from "../Api";

export const useGetStates = () => {
  return useQuery({
    queryKey: ["states"],
    queryFn: async () => {
      const response = await get("/location/states");
      return response.success ? response.states : [];
    },
  });
};

export const useGetDistricts = (state: string) => {
  return useQuery({
    queryKey: ["districts", state],
    queryFn: async () => {
      if (!state) return [];
      const response = await get(`/location/districts/${state}`);
      return response.success ? response.districts : [];
    },
    enabled: !!state,
  });
};

export const useGetCitiesAndTaluks = (state: string, district: string) => {
  return useQuery({
    queryKey: ["citiesTaluks", state, district],
    queryFn: async () => {
      if (!state || !district) return { cities: [], taluks: [] };
      const response = await get(`/location/cities-taluks/${state}/${district}`);
      return response.success ? { cities: response.cities, taluks: response.taluks } : { cities: [], taluks: [] };
    },
    enabled: !!state && !!district,
  });
};
