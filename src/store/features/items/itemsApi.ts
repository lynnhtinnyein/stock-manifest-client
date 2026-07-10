import httpClient from "@/lib/api-clients/httpClient";

export const itemsApi = {
    fetchAll: async (
        { pagination, sorting, filters }: PaginatedPayload<ItemFilters>,
        signal?: AbortSignal
    ): Promise<PaginatedResponse<Item>> => {
        const { page = 1, perPage = 10 } = pagination || {};
        const { sortBy = "createdAt", sortOrder = "DESC" } = sorting || {};

        const cleanFilters = (obj: Record<string, any>) => {
            return Object.entries(obj).reduce(
                (acc, [key, value]) => {
                    const isAll = typeof value === "string" && value.toLowerCase() === "all";

                    if (
                        value !== null &&
                        value !== undefined &&
                        value !== "" &&
                        value !== 0 &&
                        !isAll
                    ) {
                        acc[key] = value;
                    }

                    return acc;
                },
                {} as Record<string, any>
            );
        };

        const cleanedFilters = cleanFilters(filters || {});

        const res = await httpClient.get<PaginatedResponse<Item>>("/items/stocks", {
            params: {
                page,
                perPage,
                sortBy,
                sortOrder,
                ...cleanedFilters
            },
            signal
        });

        return res.data;
    },

    create: async (payload: CreateItemPayload): Promise<Item> => {
        const res = await httpClient.post("/items", payload);
        return res.data;
    }
};
