type Item = {
    id: number;
    name: string;
    category: Category;
    priceInThb: string;
    weightInGrams: string;
    cargoPriceInThb: string;
    cargoPriceInMmk: string;
    sellingPriceInMmk: string;
    stockIn: number;
    stockOut: number;
    remark: string | null;
    image: string | null;
    createdAt: string;
    createdBy: MiniUser | null;
    updatedAt: string;
    updatedBy: MiniUser | null;
};

type ItemComputed = {
    costMMK: number;
    profit: number;
    stockCount: number;
    isInStock: boolean;
    isLow: boolean;
};
