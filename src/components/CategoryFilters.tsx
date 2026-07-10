import { useAppSelector } from "@/store/hooks";

interface Props {
    selectedCategoryId: number | "all";
    onChange: (value: number | "all") => void;
}

const CategoryFilters = ({ selectedCategoryId, onChange }: Props) => {
    const { items: categories, loading } = useAppSelector((state) => state.categories);

    const base =
        "font-display text-xs font-semibold px-3 py-1.5 rounded-full border border-paper-line transition";

    if (loading) {
        return (
            <div className="flex items-center gap-2 flex-wrap">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-[30px] rounded-full bg-paper-line/60 animate-pulse"
                        style={{ width: 60 + (i % 3) * 20 }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <button
                onClick={() => onChange("all")}
                className={`${base} ${selectedCategoryId === "all" ? "bg-ink text-paper" : "bg-white"}`}
            >
                All Items
            </button>
            {categories.map((c) => (
                <button
                    key={c.id}
                    onClick={() => onChange(c.id)}
                    className={`${base} ${selectedCategoryId === c.id ? "bg-ink text-paper" : "bg-white"}`}
                >
                    {c.name}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilters;
