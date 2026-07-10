import { getComputed } from "@/lib/computed";
import { fmt } from "@/lib/format";
import Avatar from "./Avatar";
import StatusStamp from "./StatusStamp";

interface Props {
    items: Item[];
    exchangeRate: string;
}

const ItemCardGrid = ({ items, exchangeRate }: Props) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => {
                const { profit, stockCount, isInStock, isLow } = getComputed(item, exchangeRate);
                return (
                    <div key={item.id} className="parcel-card p-4 pt-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <Avatar name={item.name} color={item.category.color ?? "#8A93A0"} />
                                <div>
                                    <p className="font-display font-semibold text-sm leading-tight">
                                        {item.name}
                                    </p>
                                    <p
                                        className="text-xs font-medium mt-0.5"
                                        style={{ color: item.category.color ?? undefined }}
                                    >
                                        {item.category.name}
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
                                    Org. Price
                                </p>
                                <p className="font-mono font-medium">
                                    ฿{fmt(Number(item.priceInThb))}
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
                                    Cargo Fee
                                </p>
                                <p className="font-mono font-medium">
                                    K{fmt(Number(item.cargoPriceInMmk))}
                                </p>
                            </div>
                            <div>
                                <p className="font-mono text-[9px] tracking-[0.1em] text-muted uppercase">
                                    Sell Price
                                </p>
                                <p className="font-mono font-medium">
                                    K{fmt(Number(item.sellingPriceInMmk))}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-dashed border-paper-line pt-3">
                            <div>
                                <p className="font-mono text-[9px] tracking-[0.1em] text-muted uppercase">
                                    Profit / unit
                                </p>
                                <p className="font-mono font-bold text-sm text-ok-green">
                                    K{fmt(profit)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-mono text-[9px] tracking-[0.1em] text-muted uppercase">
                                    Stock
                                </p>
                                <p className="font-mono font-semibold text-sm">
                                    {stockCount}{" "}
                                    <span className="text-muted text-xs font-normal">
                                        ({item.stockIn}↓ {item.stockOut}↑)
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
};

export default ItemCardGrid;
