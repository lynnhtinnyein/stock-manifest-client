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
    onEdit: (item: Item) => void;
}

interface PreviewState {
    src: string;
    x: number;
    y: number;
}

const PREVIEW_SIZE = 256;
const PREVIEW_OFFSET = 20;

const ItemCardGrid = ({ items, exchangeRate, onEdit }: Props) => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => {
                const { profit, stockCount, isInStock, isLow } = getComputed(item, exchangeRate);
                const imageSrc = item?.image?.url || "/assets/images/placeholder.png";
                return (
                    <div key={item.id} className="parcel-card p-4 pt-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <ProtectedImage
                                    src={imageSrc}
                                    alt={item.name}
                                    className="w-10 h-10 object-cover rounded-xs cursor-zoom-in shrink-0"
                                    onMouseEnter={(e: React.MouseEvent<HTMLImageElement>) =>
                                        showPreview(e, imageSrc)
                                    }
                                    onMouseMove={movePreview}
                                    onMouseLeave={hidePreview}
                                />
                                <div>
                                    <p className="font-display font-semibold text-sm leading-tight">
                                        {item.name}
                                    </p>
                                    <p
                                        className="text-xs font-medium mt-0.5"
                                        style={{ color: item?.category?.color ?? undefined }}
                                    >
                                        {item?.category?.name ?? "N/A"}
                                    </p>
                                </div>
                            </div>
                            <StatusStamp
                                stockCount={stockCount}
                                isInStock={isInStock}
                                isLow={isLow}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs border-t border-dashed border-paper-line pt-3 mb-3">
                            <div>
                                <p className="font-mono text-[9px] tracking-[0.1em] text-muted uppercase">
                                    Org. Price (THB)
                                </p>
                                <p className="font-mono font-medium">
                                    {fmt(Number(item.priceInThb))}
                                </p>
                            </div>
                            <div>
                                <p className="font-mono text-[9px] tracking-[0.1em] text-muted uppercase">
                                    Weight
                                </p>
                                <p className="font-mono font-medium">
                                    {(Number(item.weightInGrams) / 1000).toFixed(1)}kg
                                </p>
                            </div>
                            <div>
                                <p className="font-mono text-[9px] tracking-[0.1em] text-muted uppercase">
                                    Cargo Price (THB)
                                </p>
                                <p className="font-mono font-medium">
                                    {fmt(Number(item.cargoPriceInThb))}
                                </p>
                            </div>
                            <div>
                                <p className="font-mono text-[9px] tracking-[0.1em] text-muted uppercase">
                                    Cargo Price (MMK)
                                </p>
                                <p className="font-mono font-medium">
                                    {fmt(Number(item.cargoPriceInMmk))}
                                </p>
                            </div>
                            <div>
                                <p className="font-mono text-[9px] tracking-[0.1em] text-muted uppercase">
                                    Selling Price (MMK)
                                </p>
                                <p className="font-mono font-medium">
                                    {fmt(Number(item.sellingPriceInMmk))}
                                </p>
                            </div>
                            <div>
                                <p className="font-mono text-[9px] tracking-[0.1em] text-muted uppercase">
                                    In / Out
                                </p>
                                <p className="font-mono font-medium">
                                    {item.stockIn} / {item.stockOut}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-dashed border-paper-line pt-3">
                            <div>
                                <p className="font-mono text-[9px] tracking-[0.1em] text-muted uppercase">
                                    Profit (MMK)
                                </p>
                                <p
                                    className={`font-mono font-bold text-sm ${
                                        profit < 0 ? "text-alert-red" : "text-ok-green"
                                    }`}
                                >
                                    {fmt(profit)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-mono text-[9px] tracking-[0.1em] text-muted uppercase">
                                    Stock
                                </p>
                                <p className="font-mono font-semibold text-sm">{stockCount}</p>
                            </div>
                        </div>

                        {item.remark && (
                            <p className="text-xs text-muted mt-3 pt-3 border-t border-dashed border-paper-line">
                                📝 {item.remark}
                            </p>
                        )}

                        <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-dashed border-paper-line">
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
                    </div>
                );
            })}

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

export default ItemCardGrid;
