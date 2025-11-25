import { api } from "./api";

const SEARCH_PREFIX = process.env.NEXT_PUBLIC_SEARCH_PREFIX ?? "http://localhost:8000/api/search";

function base(path: string) {
  return `${SEARCH_PREFIX}${path}`;
}

export const searchService = {
  searchDoctors(filters: Record<string, any> = {}) {
    const qs = new URLSearchParams();
    Object.keys(filters).forEach((k) => {
      const v = filters[k];
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
    const q = qs.toString() ? `?${qs.toString()}` : "";
    return api.get(base(`/doctors${q}`));
  },
  getSpecialities() {
    return api.get(base(`/specialities`));
  },
  getLocations() {
    return api.get(base(`/location`));
  },
  getFeatured(limit?: number) {
    const q = limit ? `?limit=${limit}` : "";
    return api.get(base(`/featured${q}`));
  },
};

export default searchService;
