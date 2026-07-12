import { useAppSelector } from "@/store/hooks";

interface Props {
    selectedCategoryId: number | null | undefined;
    onChange: (value: number | null) => void;
}

const CategoryFilters = ({ selectedCategoryId, onChange }: Props) => {
    const { items: categories, loading } = useAppSelector((state) => state.categories);

    const base =
        "whitespace-nowrap font-display text-xs font-semibold px-3 py-1.5 rounded-full border border-paper-line transition";

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
        <div className="flex flex-row items-center gap-2 px-3 sm:px-8 xl:px-0">
            <button
                onClick={() => onChange(null)}
                className={`${base} ${selectedCategoryId === null ? "bg-ink text-paper" : "bg-white"}`}
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
