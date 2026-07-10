

import { getComputed } from "@/lib/computed";
import { getSortedItems } from "@/lib/sort";
import { fmt } from "@/lib/format";
import Avatar from "./Avatar";
import StatusStamp from "./StatusStamp";

interface StockCardGridProps {
  items: Item[];
  categories: Category[];
  rate: number;
  sortKey: SortKey | null;
  sortDir: SortDir;
}

export default function StockCardGrid({ items, categories, rate, sortKey, sortDir }: StockCardGridProps) {
  const sorted = getSortedItems(items, categories, sortKey, sortDir, rate);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sorted.map((item) => {
        const cat = categories.find((c) => c.id === item.category_id);
        const { profit, stockCount, isInStock, isLow } = getComputed(item, rate);
        return (
          <div key={item.id} className="parcel-card p-4 pt-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar name={item.name} color={cat?.color ?? "#8A93A0"} />
                <div>
                  <p className="font-display font-semibold text-sm leading-tight">{item.name}</p>
                  <p className="text-xs font-medium mt-0.5" style={{ color: cat?.color }}>
                    {cat?.name ?? "—"}
                  </p>
                </div>
              </div>
              <StatusStamp stockCount={stockCount} isInStock={isInStock} isLow={isLow} />
            </div>

            <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs border-t border-dashed border-paper-line pt-3 mb-3">
              <div>
                <p className="font-mono text-[9px] tracking-[0.1em] text-muted uppercase">Org. Price</p>
                <p className="font-mono font-medium">฿{fmt(item.price_in_thb)}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] tracking-[0.1em] text-muted uppercase">Weight</p>
                <p className="font-mono font-medium">{(item.weight_in_grams / 1000).toFixed(1)}kg</p>
              </div>
              <div>
                <p className="font-mono text-[9px] tracking-[0.1em] text-muted uppercase">Cargo Fee</p>
                <p className="font-mono font-medium">K{fmt(item.cargo_price_in_mmk)}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] tracking-[0.1em] text-muted uppercase">Sell Price</p>
                <p className="font-mono font-medium">K{fmt(item.selling_price_in_mmk)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-dashed border-paper-line pt-3">
              <div>
                <p className="font-mono text-[9px] tracking-[0.1em] text-muted uppercase">Profit / unit</p>
                <p className="font-mono font-bold text-sm text-ok-green">K{fmt(profit)}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[9px] tracking-[0.1em] text-muted uppercase">Stock</p>
                <p className="font-mono font-semibold text-sm">
                  {stockCount}{" "}
                  <span className="text-muted text-xs font-normal">
                    ({item.stock_in}↓ {item.stock_out}↑)
                  </span>
                </p>
              </div>
            </div>

            {item.remark && (
              <p className="text-xs text-muted mt-3 pt-3 border-t border-dashed border-paper-line">
                📝 {item.remark}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
