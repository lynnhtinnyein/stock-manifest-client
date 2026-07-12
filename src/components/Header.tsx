import { Plus, LogOut, Search, X } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import Input from "./ui/Input";
import { useState } from "react";
import CategoryFilters from "./CategoryFilters";

interface Props {
    selectedCategoryId: number | null | undefined;
    onCategoryChange: (categoryId: number | null) => void;
    onSearch: (keyword: string) => void;
    onAdd?: () => void;
}

const Header = ({ selectedCategoryId, onCategoryChange, onSearch, onAdd }: Props) => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const dispatch = useAppDispatch();

    const handleClear = () => {
        setSearchKeyword("");
        onSearch("");
    };

    return (
        <header className="border-b border-paper-line bg-paper sticky top-0 z-20">
            <div className="max-w-7xl mx-auto space-y-3 pt-5 pb-3">
                {/* title */}
                <div className="flex items-center justify-between gap-4 flex-wrap px-3 sm:px-8 xl:px-0">
                    <div>
                        <p className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase mb-1">
                            STOCK MANIFEST
                        </p>
                        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                            <span className="brand-mark">I want it, I got it</span>
                        </h1>
                        <p className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase mt-1.5">
                            ONLINE SALE · BANGKOK DEPOT
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => dispatch({ type: "auth/logout" })}
                            className="cursor-pointer font-display text-sm font-semibold border border-paper-line text-muted px-3 py-2.5 rounded-xs hover:text-ink hover:border-ink/30 transition flex items-center gap-1.5"
                        >
                            <LogOut size={14} />
                        </button>
                    </div>
                </div>

                {/* search */}
                <div className="flex flex-row space-x-2 px-3 sm:px-8 xl:px-0">
                    <Input
                        name="search"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="Search by name or price"
                        startContent={<Search size={14} className="text-muted" />}
                        onEnter={() => onSearch(searchKeyword)}
                        endContent={
                            searchKeyword && (
                                <button
                                    type="button"
                                    className="text-muted hover:text-ink"
                                    onClick={handleClear}
                                >
                                    <X size={14} />
                                </button>
                            )
                        }
                    />
                    <button
                        onClick={onAdd}
                        className="whitespace-nowrap cursor-pointer font-display text-sm font-semibold bg-ink text-paper px-4 py-2.5 rounded-xs hover:opacity-90 transition flex items-center gap-1.5"
                    >
                        <Plus size={9} strokeWidth={4} />
                        Add New
                    </button>
                </div>

                {/* categories */}
                <div className="overflow-x-auto overflow-y-hidden scrollbar scrollbar-h-[1px] scrollbar-thumb-transparent">
                    <CategoryFilters
                        selectedCategoryId={selectedCategoryId}
                        onChange={onCategoryChange}
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
