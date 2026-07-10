import httpClient from "@/lib/api-clients/httpClient";

export const usersApi = {
    fetchAll: async ({
        pagination,
        sorting,
        filters
    }: PaginatedPayload<UserListFilters>): Promise<PaginatedResponse<User>> => {
        const { page = 1, perPage = 10 } = pagination || {};
        const { sortBy = "createdAt", sortOrder = "DESC" } = sorting || {};

        const res = await httpClient.get<PaginatedResponse<User>>("/users", {
            params: {
                page,
                perPage,
                sortBy,
                sortOrder,
                ...filters
            }
        });

        return res.data;
    },

    fetch: async (id: number): Promise<User> => {
        const res = await httpClient.get(`/users/${id}`);
        return res.data;
    },

    create: async (payload: CreateUserPayload): Promise<User> => {
        const res = await httpClient.post("/users", payload);
        return res.data;
    },

    update: async (id: number, payload: UpdateUserPayload): Promise<User> => {
        const res = await httpClient.put(`/users/${id}`, payload);
        return res.data;
    },

    updatePassword: async (id: number, data: UpdatePasswordPayload): Promise<number> => {
        const res = await httpClient.patch(`/users/${id}/update-password`, data);
        return res.data;
    },

    delete: async (id: number): Promise<void> => {
        await httpClient.delete(`/users/${id}`);
    },

    suspend: async (id: number): Promise<User> => {
        const res = await httpClient.patch(`/users/${id}/suspend`);
        return res.data;
    },

    restore: async (id: number): Promise<User> => {
        const res = await httpClient.patch(`/users/${id}/restore`);
        return res.data;
    }
};
