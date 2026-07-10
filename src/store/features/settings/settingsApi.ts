import httpClient from "@/lib/api-clients/httpClient";

export const settingsApi = {
    fetch: async (): Promise<Setting[]> => {
        const res = await httpClient.get("settings");
        return res.data;
    },

    updateSettings: async (
        payload: UpdateSettingsPayload
    ): Promise<Setting[]> => {
        const res = await httpClient.patch(`settings`, payload);
        return res.data;
    }
};
