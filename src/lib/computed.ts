export function getComputed(item: Item, exchangeRate: string): ItemComputed {
    const costMMK =
        parseFloat(item.priceInThb) * parseFloat(exchangeRate) + parseFloat(item.cargoPriceInMmk);
    const profit = parseFloat(item.sellingPriceInMmk) - costMMK;
    const stockCount = Number(item.stockIn) - Number(item.stockOut);
    const isInStock = stockCount > 0;
    const isLow = isInStock && stockCount <= 5;
    return { costMMK, profit, stockCount, isInStock, isLow };
}
