import { NumberFormatter } from "@/utils/numberFormatter";

export function getComputed(item: Item, exchangeRate: string): ItemComputed {
    const num = new NumberFormatter();

    const rate = parseFloat(exchangeRate) || 0;
    const priceInThb = parseFloat(item.priceInThb) || 0;
    const cargoPriceInMmk = parseFloat(item.cargoPriceInMmk) || 0;
    const sellingPriceInMmk = parseFloat(item.sellingPriceInMmk) || 0;
    const stockIn = Number(item.stockIn) || 0;
    const stockOut = Number(item.stockOut) || 0;
    const priceInMmk = priceInThb * rate;

    const costMMK = priceInThb * rate + cargoPriceInMmk;
    const profit = sellingPriceInMmk - costMMK;
    const stockCount = stockIn - stockOut;
    const isInStock = stockCount > 0;
    const isLow = isInStock && stockCount <= 5;

    return {
        priceInMmk: num.roundMmk(priceInMmk),
        costMMK: num.roundMmk(costMMK),
        profit: num.roundMmk(profit),
        stockCount: stockCount,
        isInStock,
        isLow
    };
}
