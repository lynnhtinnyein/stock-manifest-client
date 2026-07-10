type ItemListFilters = {
    name?: string;
    categoryId?: number | null;
};

type CreateItemPayload = {
    name: string;
    categoryId: number | null;
    priceInThb: string;
    weightInGrams: string;
    cargoPriceInThb: string;
    cargoPriceInMmk: string;
    sellingPriceInMmk: string;
    stockIn: string;
    stockOut: string;
    remark: string;
};

type UpdateItemPayload = {
    name?: string;
    categoryId?: number | null;
    priceInThb?: string;
    weightInGrams?: string;
    cargoPriceInThb?: string;
    cargoPriceInMmk?: string;
    sellingPriceInMmk?: string;
    stockIn?: string;
    stockOut?: string;
    remark?: string;
};
