// import { fmt } from "@/lib/format";
// import { getComputed } from "@/lib/computed";

// interface StatsStripProps {
//   items: Item[];
//   rate: number;
// }

// export default function StatsStrip({ items, rate }: StatsStripProps) {
//   const totalStock = items.reduce((a, i) => a + (i.stock_in - i.stock_out), 0);
//   const totalCost = items.reduce((a, i) => {
//     const { costMMK, stockCount } = getComputed(i, rate);
//     return a + costMMK * stockCount;
//   }, 0);
//   const totalProfit = items.reduce((a, i) => {
//     const { profit, stockCount } = getComputed(i, rate);
//     return a + profit * stockCount;
//   }, 0);

//   const stats: { label: string; value: string; mono?: boolean; color?: string }[] = [
//     { label: "Items Tracked", value: items.length.toString() },
//     { label: "Units in Stock", value: fmt(totalStock) },
//     { label: "Cost Tied Up", value: `K${fmt(totalCost)}`, mono: true },
//     { label: "Projected Profit", value: `K${fmt(totalProfit)}`, mono: true, color: "text-ok-green" },
//   ];

//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-paper-line border border-paper-line mb-6 rounded-xs overflow-hidden">
//       {stats.map((s) => (
//         <div key={s.label} className="bg-paper px-4 py-3.5">
//           <p className="font-mono text-[10px] tracking-[0.15em] text-muted uppercase mb-1">{s.label}</p>
//           <p className={`font-display text-xl font-bold ${s.mono ? "font-mono" : ""} ${s.color ?? ""}`}>
//             {s.value}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }

const StatsStrip = () => {
    return <div>StatsStrip</div>;
};

export default StatsStrip;
