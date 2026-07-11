import httpClient from "@/lib/api-clients/httpClient";

export const categoriesApi = {
    fetchAll: async (): Promise<Category[]> => {
        const res = await httpClient.get("categories");
        return res.data;
    },

    create: async (name: string, color: string): Promise<Category> => {
        const res = await httpClient.post("categories", { name, color });
        return res.data;
    },

    delete: async (id: number): Promise<void> => {
        await httpClient.delete(`categories/${id}`);
    }
};
