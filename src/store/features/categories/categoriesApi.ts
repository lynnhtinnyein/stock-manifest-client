import httpClient from "@/lib/api-clients/httpClient";

export const categoriesApi = {
    fetchAll: async (): Promise<Category[]> => {
        const res = await httpClient.get("categories");
        return res.data;
    }
};
