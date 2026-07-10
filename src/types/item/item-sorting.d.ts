type ItemSortBy =
    | "id"
    | "price"
    | "category"
    | "weight"
    | "sellingPrice"
    | "cargoPrice"
    | "stockStatus"
    | "createdAt";

type ItemSortingOption<T extends string> = {
    label: string;
    value: T;
};
