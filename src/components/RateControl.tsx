

import { useState } from "react";

interface RateControlProps {
  rate: number;
  onChange: (rate: number) => void;
}

export default function RateControl({ rate, onChange }: RateControlProps) {
  const [value, setValue] = useState(rate.toString());
  const [confirmed, setConfirmed] = useState(false);

  function apply() {
    const val = parseFloat(value);
    if (!isNaN(val) && val > 0) {
      onChange(val);
      setConfirmed(true);
      setTimeout(() => setConfirmed(false), 1400);
    }
  }

  return (
    <div className="rate-box flex items-center gap-2.5 bg-white border border-paper-line rounded-xs px-3.5 py-2.5 mb-5 w-fit">
      <span className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">Today&apos;s Rate</span>
      <span className="font-mono text-xs text-muted">฿1 =</span>
      <input
        type="number"
        step="0.01"
        min="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && apply()}
        aria-label="MMK exchange rate per 1 THB"
        className="w-16 font-mono text-sm font-semibold bg-transparent border-b border-paper-line focus:outline-none focus:border-ink text-right py-0.5"
      />
      <span className="font-mono text-xs text-muted">MMK</span>
      <button
        onClick={apply}
        className="font-display text-xs font-semibold bg-ink text-paper px-3 py-1.5 rounded-xs hover:opacity-90 transition ml-1"
      >
        Change
      </button>
      <span
        className={`font-mono text-[10px] tracking-[0.1em] uppercase text-ok-green transition-opacity duration-300 ${
          confirmed ? "opacity-100" : "opacity-0"
        }`}
      >
        Applied
      </span>
    </div>
  );
}
