import { useState } from "react";
import { fetchItems } from "@/store/features/items/itemsThunk";
import { useAppSelector } from "@/store/hooks";
import Header from "@/components/Header";
import CategoryFilters from "@/components/CategoryFilters";
import ViewModeToggle from "@/components/ViewToggle";
import ItemFormDrawer from "@/components/ItemFormDrawer";
import useThunkPaginationFetch from "@/hooks/useThunkPaginationFetch";
import ItemCardGrid from "@/components/ItemCardGrid";
import ItemTable from "@/components/ItemTable";

const HomePage = () => {
    const { items, page } = useAppSelector((state) => state.items);
    const { exchangeRate } = useAppSelector((state) => state.settings);

    const [viewMode, setViewMode] = useState<ViewMode>("table");
    const [perPage, setPerPage] = useState(50);
    const [sorting, setSorting] = useState<Sorting>({ sortBy: "createdAt", sortOrder: "DESC" });
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    useThunkPaginationFetch<ItemListFilters>({
        fetchOnMounted: true,
        fetchThunk: fetchItems,
        filters: { name: "", categoryId: selectedCategoryId },
        sorting,
        pagination: { page, perPage },
        isCancellable: true
    });

    const handleSort = (newSorting: Sorting) => {
        setSorting((prev) => {
            if (prev.sortBy === newSorting.sortBy) {
                return {
                    ...newSorting,
                    sortOrder: prev.sortOrder === "ASC" ? "DESC" : "ASC"
                };
            }
            return newSorting;
        });
    };

    return (
        <>
            <Header />
            <main className="max-w-7xl mx-auto px-5 sm:px-8 pt-6">
                {/* <StatsStrip items={filteredItems} rate={rate} /> */}
                {/* <RateControl rate={rate} onChange={setRate} /> */}
                <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
                    <CategoryFilters
                        selectedCategoryId={selectedCategoryId}
                        onChange={setSelectedCategoryId}
                    />
                    <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
                </div>
                {viewMode === "table" ? (
                    <ItemTable
                        items={items}
                        exchangeRate={exchangeRate}
                        sorting={sorting}
                        onSort={handleSort}
                    />
                ) : (
                    <ItemCardGrid items={items} exchangeRate={exchangeRate} />
                )}
            </main>
            <ItemFormDrawer item={null} />
        </>
    );
};

export default HomePage;
