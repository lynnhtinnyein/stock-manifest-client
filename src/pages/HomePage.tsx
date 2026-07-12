import { useState } from "react";
import { fetchItems } from "@/store/features/items/itemsThunk";
import { useAppSelector } from "@/store/hooks";
import Header from "@/components/Header";
import ViewModeToggle from "@/components/ViewToggle";
import ItemFormDrawer from "@/components/ItemFormDrawer";
import useThunkPaginationFetch from "@/hooks/useThunkPaginationFetch";
import ItemCardGrid from "@/components/ItemCardGrid";
import ItemTable from "@/components/ItemTable";
import RateControl from "@/components/RateControl";

const perPage = 99;

const HomePage = () => {
    const { items, page, loading } = useAppSelector((state) => state.items);
    const { exchangeRate } = useAppSelector((state) => state.settings);

    const [filters, setFilters] = useState<ItemListFilters>({
        search: "",
        categoryId: null
    });
    const [showItemFormDrawer, setShowItemFormDrawer] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("table");
    const [sorting, setSorting] = useState<Sorting>({ sortBy: "createdAt", sortOrder: "DESC" });
    const [editingItem, setEditingItem] = useState<Item | null>(null);

    useThunkPaginationFetch<ItemListFilters>({
        fetchOnMounted: true,
        fetchThunk: fetchItems,
        filters,
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

    const handleEdit = (item: Item) => {
        setEditingItem(item);
        setShowItemFormDrawer(true);
    };

    const handleAdd = () => {
        setEditingItem(null);
        setShowItemFormDrawer(true);
    };

    const handleSearch = (keyword: string) => {
        setFilters({
            search: keyword,
            categoryId: null
        });
    };

    const handleCategoryChange = (categoryId: number | null) => {
        setFilters((prev) => ({
            ...prev,
            categoryId: categoryId ? Number(categoryId) : null
        }));
    };

    const hasNoResults = !loading && items.length === 0;
    const isFiltered = Boolean(filters.search) || filters.categoryId !== null;

    return (
        <div className="flex flex-col fixed top-0 bottom-0 left-0 right-0 h-screen min-h-screen max-h-screen w-screen min-w-screen max-w-screen overflow-hidden">
            <Header
                selectedCategoryId={filters.categoryId}
                onCategoryChange={handleCategoryChange}
                onSearch={handleSearch}
                onAdd={handleAdd}
            />
            <main className="flex-1 px-3 sm:px-8 pt-4 sm:pt-6 pb-14 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    {/* <StatsStrip items={filteredItems} rate={rate} /> */}
                    <div className="flex items-center justify-between gap-3 sm:gap-4 flex-wrap mb-3 sm:mb-5">
                        <RateControl exchangeRate={exchangeRate} />
                        <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
                    </div>
                    {hasNoResults ? (
                        <div className="flex flex-col items-center justify-center text-center py-20 sm:py-28 border border-dashed border-neutral-300 rounded-lg">
                            <p className="font-serif text-lg sm:text-xl text-neutral-600 mb-1">
                                No entries found
                            </p>
                            <p className="text-sm text-neutral-400 max-w-xs">
                                {isFiltered
                                    ? "Nothing matches your current search or category. Try adjusting your filters."
                                    : "The ledger is empty. Add your first item to get started."}
                            </p>
                        </div>
                    ) : viewMode === "table" ? (
                        <ItemTable
                            items={items}
                            exchangeRate={exchangeRate}
                            sorting={sorting}
                            onSort={handleSort}
                            onEdit={handleEdit}
                        />
                    ) : (
                        <ItemCardGrid
                            items={items}
                            exchangeRate={exchangeRate}
                            onEdit={handleEdit}
                        />
                    )}
                </div>
            </main>
            <ItemFormDrawer
                show={showItemFormDrawer}
                exchangeRate={exchangeRate}
                onClose={() => setShowItemFormDrawer(false)}
                item={editingItem}
            />
        </div>
    );
};

export default HomePage;
