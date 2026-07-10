export interface ItemComputed {
  costMMK: number;
  profit: number;
  stockCount: number;
  isInStock: boolean;
  isLow: boolean;
}

// Cost is assembled in MMK: the Thailand purchase price (price_in_thb) converted
// at today's rate, plus the cargo/shipping fee which is already quoted in MMK.
export function getComputed(item: Item, rate: number): ItemComputed {
  const costMMK = item.price_in_thb * rate + item.cargo_price_in_mmk;
  const profit = item.selling_price_in_mmk - costMMK;
  const stockCount = item.stock_in - item.stock_out;
  const isInStock = stockCount > 0;
  const isLow = isInStock && stockCount <= 5;
  return { costMMK, profit, stockCount, isInStock, isLow };
}
