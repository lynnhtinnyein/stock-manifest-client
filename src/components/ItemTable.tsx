import { getComputed } from "@/lib/computed";
import { fmt } from "@/lib/format";
import Avatar from "./Avatar";
import StatusStamp from "./StatusStamp";

interface Props {
    items: Item[];
    exchangeRate: string;
    sorting: Sorting;
    onSort: (key: Sorting) => void;
}

const COLUMNS: { key: ItemSortBy | null; label: string; align: "left" | "right" | "center" }[] = [
    { key: "id", label: "ID", align: "left" },
    { key: null, label: "Item", align: "left" },
    { key: "category", label: "Category", align: "left" },
    { key: "price", label: "Org. Price", align: "right" },
    { key: "weight", label: "Weight", align: "right" },
    { key: "cargoPrice", label: "Cargo", align: "right" },
    { key: "sellingPrice", label: "Sell Price", align: "right" },
    { key: null, label: "Profit", align: "right" },
    { key: null, label: "In / Out", align: "center" },
    { key: "stockStatus", label: "Status", align: "center" }
];

const ItemTable = ({ items, exchangeRate, sorting, onSort }: Props) => {
    return (
        <div className="bg-white border border-paper-line rounded-xs overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
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
                                    className={`${align} ${padding} font-medium ${isSortable ? "sort-th" : ""} ${isActive ? "sort-active" : ""} ${
                                        isActive && sorting.sortOrder === "DESC" ? "sort-desc" : ""
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
                        <th className="text-left py-3 px-4 font-medium">Remark</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => {
                        const { profit, stockCount, isInStock, isLow } = getComputed(
                            item,
                            exchangeRate
                        );
                        return (
                            <tr key={item.id} className="ledger-row">
                                <td className="py-3 pl-4 pr-3 font-mono text-xs text-muted">
                                    {item.id}
                                </td>
                                <td className="py-3 px-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar
                                            name={item.name}
                                            color={item.category.color ?? "#8A93A0"}
                                        />
                                        <span className="font-medium">{item.name}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-3">
                                    <span
                                        className="text-xs font-medium"
                                        style={{ color: item.category.color ?? undefined }}
                                    >
                                        {item.category.name}
                                    </span>
                                </td>
                                <td className="py-3 px-3 text-right font-mono text-xs">
                                    ฿{fmt(Number(item.priceInThb))}
                                </td>
                                <td className="py-3 px-3 text-right font-mono text-xs text-muted">
                                    {(Number(item.weightInGrams) / 1000).toFixed(1)}kg
                                </td>
                                <td className="py-3 px-3 text-right font-mono text-xs">
                                    K{fmt(Number(item.cargoPriceInMmk))}
                                </td>
                                <td className="py-3 px-3 text-right font-mono text-xs">
                                    K{fmt(Number(item.sellingPriceInMmk))}
                                </td>
                                <td className="py-3 px-3 text-right font-mono text-xs font-semibold text-ok-green">
                                    K{fmt(profit)}
                                </td>
                                <td className="py-3 px-3 text-center font-mono text-xs text-muted">
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
                                    className="py-3 px-4 text-xs text-muted max-w-[160px] truncate"
                                    title={item.remark ?? ""}
                                >
                                    {item.remark || "—"}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ItemTable;
