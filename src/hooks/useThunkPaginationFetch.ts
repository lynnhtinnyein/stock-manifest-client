import { useAppDispatch } from "@/store/hooks";
import { useEffect, useRef } from "react";

interface FetchParams<T> {
    filters: T;
    sorting: Sorting;
    pagination: Pagination;
}

interface Props<T> {
    fetchThunk: (params: FetchParams<T>) => any;
    filters: T;
    sorting: Sorting;
    pagination: Pagination;
    fetchOnMounted?: boolean;
    isEnabled?: boolean;
    isCancellable?: boolean;
}

const useThunkPaginationFetch = <T>({
    fetchThunk,
    filters,
    sorting,
    pagination,
    fetchOnMounted = false,
    isEnabled = true,
    isCancellable = true
}: Props<T>): void => {
    const dispatch = useAppDispatch();

    const hasRunOnMountRef = useRef(false);
    const pendingRequest = useRef<{ abort: () => void } | null>(null);

    const filtersKey = JSON.stringify(filters);
    const sortingKey = JSON.stringify(sorting);
    const paginationKey = JSON.stringify(pagination);

    const prevFiltersRef = useRef(filtersKey);
    const prevPerPageRef = useRef(pagination.perPage);

    useEffect(() => {
        if (!isEnabled) return;

        if (!hasRunOnMountRef.current && !fetchOnMounted) {
            hasRunOnMountRef.current = true;
            return;
        }

        const filtersChanged = prevFiltersRef.current !== filtersKey;
        const perPageChanged = prevPerPageRef.current !== pagination.perPage;

        const page = filtersChanged || perPageChanged ? 1 : pagination.page;

        if (isCancellable) {
            pendingRequest.current?.abort();
        }

        pendingRequest.current = dispatch(
            fetchThunk({
                filters,
                sorting,
                pagination: { page, perPage: pagination.perPage }
            })
        );

        hasRunOnMountRef.current = true;
        prevFiltersRef.current = filtersKey;
        prevPerPageRef.current = pagination.perPage;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        filtersKey,
        sortingKey,
        paginationKey,
        dispatch,
        fetchThunk,
        fetchOnMounted,
        isEnabled,
        isCancellable
    ]);
};

export default useThunkPaginationFetch;
