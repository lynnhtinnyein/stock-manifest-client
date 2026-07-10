import httpClient from "@/lib/api-clients/httpClient";
import delay from "@/utils/delay";

export const categoriesApi = {
    fetchAll: async (): Promise<Category[]> => {
        const res = await httpClient.get("categories");
        await delay(2000);
        return res.data;
    }
};
