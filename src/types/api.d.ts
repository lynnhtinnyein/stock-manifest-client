type Pagination = {
    page?: number;
    perPage?: number;
};

type Sorting<T = string> = {
    sortBy: T;
    sortOrder: "ASC" | "DESC";
};

type PaginatedPayload<T> = {
    pagination?: Pagination;
    sorting?: Sorting;
    filters?: T;
};

type PaginatedResponse<T> = {
    content: T[];
    page: number;
    perPage: number;
    totalPages: number;
    totalElements: number;
    hasMore: boolean;
};

type ResponseError = {
    status: boolean;
    message: string;
    errors: string[];
};

interface PaginatedReduxState<T> {
    items: T[];
    loading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
    totalElements: number;
    hasMore: boolean;
}
