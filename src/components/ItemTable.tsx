import { useState } from "react";
import { getComputed } from "@/lib/computed";
import { fmt } from "@/lib/format";
import StatusStamp from "./StatusStamp";
import { Pencil, Trash2 } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { deleteItem } from "@/store/features/items/itemsThunk";
import ProtectedImage from "./ui/ProtectedImage";

interface Props {
    items: Item[];
    exchangeRate: string;
    sorting: Sorting;
    onSort: (key: Sorting) => void;
    onEdit: (item: Item) => void;
}

interface PreviewState {
    src: string;
    x: number;
    y: number;
}

const COLUMNS: { key: ItemSortBy | null; label: string; align: "left" | "right" | "center" }[] = [
    { key: "id", label: "ID", align: "left" },
    { key: null, label: "Image", align: "center" },
    { key: null, label: "Name", align: "left" },
    { key: "category", label: "Category", align: "left" },
    { key: "price", label: "Org. Price (THB)", align: "right" },
    { key: "price", label: "Org. Price (MMK)", align: "right" },
    { key: "weight", label: "Weight", align: "right" },
    { key: "cargoPrice", label: "Cargo Price (THB)", align: "right" },
    { key: "cargoPrice", label: "Cargo Price (MMK)", align: "right" },
    { key: "sellingPrice", label: "Selling Price (MMK)", align: "right" },
    { key: null, label: "Profit (MMK)", align: "right" },
    { key: null, label: "In / Out", align: "center" },
    { key: "stockStatus", label: "Status", align: "center" }
];

const PREVIEW_SIZE = 256;
const PREVIEW_OFFSET = 20;

const ItemTable = ({ items, exchangeRate, sorting, onSort, onEdit }: Props) => {
    const dispatch = useAppDispatch();
    const [preview, setPreview] = useState<PreviewState | null>(null);

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this item?")) {
            dispatch(deleteItem(id));
        }
    };

    const clampPosition = (clientX: number, clientY: number) => {
        const maxX = window.innerWidth - PREVIEW_SIZE - PREVIEW_OFFSET;
        const maxY = window.innerHeight - PREVIEW_SIZE - PREVIEW_OFFSET;
        return {
            x: Math.min(clientX + PREVIEW_OFFSET, maxX),
            y: Math.min(clientY + PREVIEW_OFFSET, maxY)
        };
    };

    const showPreview = (e: React.MouseEvent, src: string) => {
        const { x, y } = clampPosition(e.clientX, e.clientY);
        setPreview({ src, x, y });
    };

    const movePreview = (e: React.MouseEvent) => {
        setPreview((prev) => {
            if (!prev) return prev;
            const { x, y } = clampPosition(e.clientX, e.clientY);
            return { ...prev, x, y };
        });
    };

    const hidePreview = () => setPreview(null);

    return (
        <div className="bg-white border border-paper-line rounded-xs overflow-x-auto">
            <div className="min-w-[1200px] min-h-[1200px]">
                <table className="text-sm">
                    <thead>
                        <tr className="border-b border-paper-line font-mono text-[10px] tracking-[0.12em] uppercase text-muted">
                            {COLUMNS.map((col) => {
                                const isActive = col.key !== null && sorting.sortBy === col.key;
                                const isSortable = col.key !== null;
                                const justify =
                                    col.align === "right"
                                        ? "justify-end"
                                        : col.align === "center"
                                          ? "justify-center"
                                          : "justify-start";
                                const align =
                                    col.align === "right"
                                        ? "text-right"
                                        : col.align === "center"
                                          ? "text-center"
                                          : "text-left";
                                const padding = col.label === "ID" ? "py-3 pl-4 pr-3" : "py-3 px-3";
                                const width =
                                    col.label === "Image"
                                        ? "min-w-[100px]"
                                        : col.label === "Name"
                                          ? "min-w-[150px]"
                                          : "";
                                return (
                                    <th
                                        key={col.label}
                                        onClick={
                                            isSortable
                                                ? () =>
                                                      onSort({
                                                          sortBy: col.key as ItemSortBy,
                                                          sortOrder: "DESC"
                                                      })
                                                : undefined
                                        }
                                        className={`${align} ${padding} ${width} font-medium whitespace-nowrap ${isSortable ? "sort-th" : ""} ${isActive ? "sort-active" : ""} ${
                                            isActive && sorting.sortOrder === "DESC"
                                                ? "sort-desc"
                                                : ""
                                        }`}
                                    >
                                        <span
                                            className={`inline-flex items-center gap-1 w-full ${justify}`}
                                        >
                                            {col.label}
                                            {isSortable && <span className="sort-arrow">▲</span>}
                                        </span>
                                    </th>
                                );
                            })}
                            <th className="text-left py-3 px-3 font-medium whitespace-nowrap">
                                Remark
                            </th>
                            <th className="text-center py-3 pl-3 pr-4 font-medium whitespace-nowrap">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => {
                            const { priceInMmk, profit, stockCount, isInStock, isLow } =
                                getComputed(item, exchangeRate);
                            const imageSrc = item?.image?.url || "/assets/images/placeholder.png";
                            return (
                                <tr key={item.id} className="ledger-row">
                                    <td className="py-3 pl-4 pr-3 font-mono text-xs text-muted">
                                        {item.id}
                                    </td>
                                    <td className="py-3 px-3 w-[320px]">
                                        <div className="flex items-center gap-3">
                                            <ProtectedImage
                                                src={imageSrc}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-xs cursor-zoom-in"
                                                onMouseEnter={(
                                                    e: React.MouseEvent<HTMLImageElement>
                                                ) => showPreview(e, imageSrc)}
                                                onMouseMove={movePreview}
                                                onMouseLeave={hidePreview}
                                            />
                                        </div>
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className="font-medium">{item.name}</span>
                                    </td>
                                    <td className="py-3 px-3">
                                        <span
                                            className="text-xs font-medium"
                                            style={{ color: item?.category?.color ?? "#8a93a0" }}
                                        >
                                            {item?.category?.name || "N/A"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 text-right font-mono text-xs">
                                        {fmt(Number(item.priceInThb))} THB
                                    </td>
                                    <td className="py-3 px-3 text-right font-mono text-xs">
                                        {fmt(priceInMmk)} MMK
                                    </td>
                                    <td className="py-3 px-3 text-right font-mono text-xs text-muted">
                                        {(Number(item.weightInGrams) / 1000).toFixed(1)} kg
                                    </td>
                                    <td className="py-3 px-3 text-right font-mono text-xs">
                                        {fmt(Number(item.cargoPriceInThb))} THB
                                    </td>
                                    <td className="py-3 px-3 text-right font-mono text-xs">
                                        {fmt(Number(item.cargoPriceInMmk))} MMK
                                    </td>
                                    <td className="py-3 px-3 text-right font-mono text-xs">
                                        {fmt(Number(item.sellingPriceInMmk))} MMK
                                    </td>
                                    <td
                                        className={`py-3 px-3 text-right font-mono text-xs font-semibold ${
                                            profit < 0 ? "text-alert-red" : "text-ok-green"
                                        }`}
                                    >
                                        {fmt(profit)} MMK
                                    </td>
                                    <td className="py-3 px-3 text-center font-mono text-xs text-muted whitespace-nowrap">
                                        {item.stockIn} / {item.stockOut}
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                        <StatusStamp
                                            stockCount={stockCount}
                                            isInStock={isInStock}
                                            isLow={isLow}
                                        />
                                    </td>
                                    <td
                                        className="py-3 px-3 text-xs text-muted max-w-[160px] truncate"
                                        title={item.remark ?? ""}
                                    >
                                        {item.remark || "—"}
                                    </td>
                                    <td className="py-3 pl-3 pr-4 text-center">
                                        <div className="inline-flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(item)}
                                                className="p-1.5 rounded-xs border border-paper-line hover:bg-paper-line/40 transition-colors"
                                                aria-label="Edit"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(item.id)}
                                                className="p-1.5 rounded-xs border border-paper-line hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                                                aria-label="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {preview && (
                <div
                    className="fixed z-50 pointer-events-none"
                    style={{ left: preview.x, top: preview.y }}
                >
                    <ProtectedImage
                        src={preview.src}
                        alt="Preview"
                        className="w-64 h-64 object-cover rounded-md border border-paper-line shadow-xl bg-white"
                    />
                </div>
            )}
        </div>
    );
};

export default ItemTable;
