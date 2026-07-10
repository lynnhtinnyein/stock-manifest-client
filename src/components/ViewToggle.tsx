import { Rows3, LayoutGrid } from "lucide-react";

interface Props {
    viewMode: ViewMode;
    onChange: (e: ViewMode) => void;
}

const ViewModeToggle = ({ viewMode, onChange }: Props) => {
    const base =
        "font-display text-xs font-semibold px-3 py-1.5 rounded-xs transition flex items-center gap-1.5";

    return (
        <div
            className="flex items-center bg-white border border-paper-line rounded-xs p-0.5"
            role="group"
            aria-label="View switcher"
        >
            <button
                onClick={() => onChange("table")}
                aria-pressed={viewMode === "table"}
                className={`${base} ${viewMode === "table" ? "bg-ink text-paper" : ""}`}
            >
                <Rows3 size={13} strokeWidth={1.8} />
                Table
            </button>
            <button
                onClick={() => onChange("card")}
                aria-pressed={viewMode === "card"}
                className={`${base} ${viewMode === "card" ? "bg-ink text-paper" : ""}`}
            >
                <LayoutGrid size={13} strokeWidth={1.8} />
                Card
            </button>
        </div>
    );
};

export default ViewModeToggle;
