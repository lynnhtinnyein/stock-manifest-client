

import { getComputed } from "@/lib/computed";
import { getSortedItems } from "@/lib/sort";
import { fmt } from "@/lib/format";
import Avatar from "./Avatar";
import StatusStamp from "./StatusStamp";

interface StockTableProps {
  items: Item[];
  categories: Category[];
  rate: number;
  sortKey: SortKey | null;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}

const COLUMNS: { key: SortKey; label: string; align: "left" | "right" | "center" }[] = [
  { key: "name", label: "Item", align: "left" },
  { key: "category", label: "Category", align: "left" },
  { key: "price_in_thb", label: "Org. Price", align: "right" },
  { key: "weight_in_grams", label: "Weight", align: "right" },
  { key: "cargo_price_in_mmk", label: "Cargo", align: "right" },
  { key: "selling_price_in_mmk", label: "Sell Price", align: "right" },
  { key: "profit", label: "Profit", align: "right" },
  { key: "in_out", label: "In / Out", align: "center" },
  { key: "stock", label: "Status", align: "center" },
];

export default function StockTable({ items, categories, rate, sortKey, sortDir, onSort }: StockTableProps) {
  const sorted = getSortedItems(items, categories, sortKey, sortDir, rate);

  return (
    <div className="bg-white border border-paper-line rounded-xs overflow-x-auto">
      <table className="w-full text-sm min-w-[900px]">
        <thead>
          <tr className="border-b border-paper-line font-mono text-[10px] tracking-[0.12em] uppercase text-muted">
            {COLUMNS.map((col) => {
              const isActive = sortKey === col.key;
              const justify =
                col.align === "right" ? "justify-end" : col.align === "center" ? "justify-center" : "justify-start";
              const align =
                col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left";
              const padding = col.key === "name" ? "py-3 pl-4 pr-3" : "py-3 px-3";
              return (
                <th
                  key={col.key}
                  onClick={() => onSort(col.key)}
                  className={`sort-th ${align} ${padding} font-medium ${isActive ? "sort-active" : ""} ${
                    isActive && sortDir === "desc" ? "sort-desc" : ""
                  }`}
                >
                  <span className={`inline-flex items-center gap-1 w-full ${justify}`}>
                    {col.label}
                    <span className="sort-arrow">▲</span>
                  </span>
                </th>
              );
            })}
            <th className="text-left py-3 px-4 font-medium">Remark</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((item) => {
            const cat = categories.find((c) => c.id === item.category_id);
            const { profit, stockCount, isInStock, isLow } = getComputed(item, rate);
            return (
              <tr key={item.id} className="ledger-row">
                <td className="py-3 pl-4 pr-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={item.name} color={cat?.color ?? "#8A93A0"} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="text-xs font-medium" style={{ color: cat?.color }}>
                    {cat?.name ?? "—"}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-mono text-xs">฿{fmt(item.price_in_thb)}</td>
                <td className="py-3 px-3 text-right font-mono text-xs text-muted">
                  {(item.weight_in_grams / 1000).toFixed(1)}kg
                </td>
                <td className="py-3 px-3 text-right font-mono text-xs">K{fmt(item.cargo_price_in_mmk)}</td>
                <td className="py-3 px-3 text-right font-mono text-xs">K{fmt(item.selling_price_in_mmk)}</td>
                <td className="py-3 px-3 text-right font-mono text-xs font-semibold text-ok-green">
                  K{fmt(profit)}
                </td>
                <td className="py-3 px-3 text-center font-mono text-xs text-muted">
                  {item.stock_in} / {item.stock_out}
                </td>
                <td className="py-3 px-3 text-center">
                  <StatusStamp stockCount={stockCount} isInStock={isInStock} isLow={isLow} />
                </td>
                <td className="py-3 px-4 text-xs text-muted max-w-[160px] truncate" title={item.remark ?? ""}>
                  {item.remark || "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
