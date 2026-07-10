interface PaginatedState<T> {
    items: T[];
    loading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
    totalElements: number;
    hasMore: boolean;
}

interface FlatState<T> {
    items: T[],
    loading: boolean,
    error: string | null
}
