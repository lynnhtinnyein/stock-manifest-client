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
    image: UploadedAttachment | null;
    createdAt: string;
    createdBy: MiniUser | null;
    updatedAt: string;
    updatedBy: MiniUser | null;
};

type ItemComputed = {
    priceInMmk: number;
    costMMK: number;
    profit: number;
    stockCount: number;
    isInStock: boolean;
    isLow: boolean;
};
