type Setting = {
    id: number;
    exchangeRate: string;
    updatedAt: string;
}

type UpdateSettingsPayload = {
    exchangeRate: string;
}