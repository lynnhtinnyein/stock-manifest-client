
import { getComputed } from "./computed";

function sortValue(item: Item, categories: Category[], key: SortKey, rate: number): number | string {
  switch (key) {
    case "name":
      return item.name.toLowerCase();
    case "category": {
      const cat = categories.find((c) => c.id === item.category_id);
      return (cat?.name ?? "").toLowerCase();
    }
    case "profit":
      return getComputed(item, rate).profit;
    case "in_out":
    case "stock":
      return item.stock_in - item.stock_out;
    default:
      return item[key] as number;
  }
}

export function getSortedItems(
  items: Item[],
  categories: Category[],
  sortKey: SortKey | null,
  sortDir: SortDir,
  rate: number
): Item[] {
  if (!sortKey) return items;
  const copy = [...items];
  copy.sort((a, b) => {
    const av = sortValue(a, categories, sortKey, rate);
    const bv = sortValue(b, categories, sortKey, rate);
    let diff: number;
    if (typeof av === "string" && typeof bv === "string") {
      diff = av.localeCompare(bv);
    } else {
      diff = (av as number) - (bv as number);
    }
    return sortDir === "asc" ? diff : -diff;
  });
  return copy;
}
