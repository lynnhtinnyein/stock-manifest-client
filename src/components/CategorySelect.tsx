import { useState, useRef, useEffect } from "react";
import { ChevronDown, Plus, Trash2, Check } from "lucide-react";
import { COLOR_PRESETS } from "@/lib/colors";
import { useAppSelector } from "@/store/hooks";

interface CategorySelectProps {
    value: number | null;
    onChange: (id: number) => void;
}

export default function CategorySelect({ value, onChange }: CategorySelectProps) {
    const { items: categories } = useAppSelector((state) => state.categories);

    const [open, setOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [newColor, setNewColor] = useState(COLOR_PRESETS[0]);
    const wrapRef = useRef<HTMLDivElement>(null);

    const selected = categories.find((c) => c.id === value);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
                setOpen(false);
                setIsAdding(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    function submitNewCategory() {
        const trimmed = newName.trim();
        if (!trimmed) return;
        // onAddCategory(trimmed, newColor);
        setNewName("");
        setNewColor(COLOR_PRESETS[0]);
        setIsAdding(false);
    }

    return (
        <div className="relative" ref={wrapRef}>
            <label className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase block mb-1.5">
                Category
            </label>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-2 bg-white border border-paper-line rounded-xs px-3 py-2.5 text-sm font-medium"
            >
                <span className="flex items-center gap-2">
                    {selected ? (
                        <>
                            <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ background: selected?.color || "black" }}
                            />
                            {selected.name}
                        </>
                    ) : (
                        <span className="text-muted">Select category</span>
                    )}
                </span>
                <ChevronDown
                    size={15}
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute z-30 mt-1.5 w-full bg-white border border-paper-line rounded-xs shadow-lg overflow-hidden">
                    <ul className="max-h-56 overflow-y-auto">
                        {categories.map((c) => (
                            <li
                                key={c.id}
                                className="group flex items-center justify-between gap-2 px-3 py-2 hover:bg-paper"
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(c.id);
                                        setOpen(false);
                                    }}
                                    className="flex items-center gap-2 text-sm font-medium flex-1 text-left"
                                >
                                    <span
                                        className="w-3 h-3 rounded-full shrink-0"
                                        style={{ background: c?.color || "black" }}
                                    />
                                    {c.name}
                                    {value === c.id && (
                                        <Check size={13} className="text-ok-green ml-auto" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // onDeleteCategory(c.id);
                                    }}
                                    aria-label={`Delete ${c.name}`}
                                    className="opacity-0 group-hover:opacity-100 text-muted hover:text-alert-red transition"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="border-t border-paper-line p-2.5">
                        {isAdding ? (
                            <div className="space-y-2">
                                <input
                                    autoFocus
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && submitNewCategory()}
                                    placeholder="Category name"
                                    className="w-full text-sm px-2.5 py-1.5 border border-paper-line rounded-xs focus:outline-none focus:border-ink"
                                />
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    {COLOR_PRESETS.map((c) => (
                                        <button
                                            type="button"
                                            key={c}
                                            onClick={() => setNewColor(c)}
                                            aria-label={`Choose color ${c}`}
                                            className={`w-5 h-5 rounded-full border-2 transition ${
                                                newColor === c ? "border-ink" : "border-transparent"
                                            }`}
                                            style={{ background: c }}
                                        />
                                    ))}
                                    <input
                                        type="color"
                                        value={newColor}
                                        onChange={(e) => setNewColor(e.target.value)}
                                        className="w-5 h-5 rounded-full border-2 border-paper-line cursor-pointer p-0 bg-transparent"
                                        aria-label="Custom color"
                                    />
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={submitNewCategory}
                                        className="font-display text-xs font-semibold bg-ink text-paper px-2.5 py-1.5 rounded-xs flex-1"
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="font-display text-xs font-semibold text-muted px-2.5 py-1.5"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsAdding(true)}
                                className="w-full flex items-center justify-center gap-1.5 font-display text-xs font-semibold text-ink px-2.5 py-1.5 rounded-xs border border-dashed border-paper-line hover:bg-paper transition"
                            >
                                <Plus size={13} /> Add new category
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
