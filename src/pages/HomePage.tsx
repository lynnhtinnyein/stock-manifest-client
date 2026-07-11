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
import RateControl from "@/components/RateControl";

const perPage = 99;

const HomePage = () => {
    const { items, page } = useAppSelector((state) => state.items);
    const { exchangeRate } = useAppSelector((state) => state.settings);

    const [showItemFormDrawer, setShowItemFormDrawer] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("table");
    const [sorting, setSorting] = useState<Sorting>({ sortBy: "createdAt", sortOrder: "DESC" });
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [editingItem, setEditingItem] = useState<Item | null>(null);

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

    const handleEdit = (item: Item) => {
        setEditingItem(item);
        setShowItemFormDrawer(true);
    };

    const handleAdd = () => {
        setEditingItem(null);
        setShowItemFormDrawer(true);
    };

    return (
        <div className="flex flex-col fixed top-0 bottom-0 left-0 right-0 h-screen min-h-screen max-h-screen w-screen min-w-screen max-w-screen overflow-hidden">
            <Header onAdd={handleAdd} />
            <main className="flex-1 px-5 sm:px-8 pt-6 pb-20 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    {/* <StatsStrip items={filteredItems} rate={rate} /> */}
                    <RateControl exchangeRate={exchangeRate} />
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
