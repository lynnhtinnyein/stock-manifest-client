import { useState } from "react";
import Header from "@/components/Header";
import CategoryFilters from "@/components/CategoryFilters";
import ViewModeToggle from "@/components/ViewToggle";
import ItemFormDrawer from "@/components/ItemFormDrawer";

export default function Home() {
    const [activeCategory, setActiveCategory] = useState<number | "all">("all");
    const [viewMode, setViewMode] = useState<ViewMode>("table");
    

    return (
        <>
            <Header />
            <main className="max-w-7xl mx-auto px-5 sm:px-8 pt-6">
                {/* <StatsStrip items={filteredItems} rate={rate} /> */}
                {/* <RateControl rate={rate} onChange={setRate} /> */}
                <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
                    <CategoryFilters
                        selectedCategoryId={activeCategory}
                        onChange={setActiveCategory}
                    />
                    <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
                </div>
                {/* {viewMode === "table" ? (
                    <StockTable
                        items={filteredItems}
                        categories={categories}
                        rate={rate}
                        sortKey={sortKey}
                        sortDir={sortDir}
                        onSort={handleSort}
                    />
                ) : (
                    <StockCardGrid
                        items={filteredItems}
                        categories={categories}
                        rate={rate}
                        sortKey={sortKey}
                        sortDir={sortDir}
                    />
                )} */}
            </main>
            <ItemFormDrawer
                item={null}
                // categories={categories}
                // onAddCategory={handleAddCategory}
                // onDeleteCategory={handleDeleteCategory}
                // onSubmit={handleAddItem}
            />
        </>
    );
}
