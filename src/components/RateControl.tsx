import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateSettings } from "@/store/features/settings/settingsThunk";

interface RateControlProps {
    exchangeRate: string;
}

const RateControl = ({ exchangeRate }: RateControlProps) => {
    const dispatch = useAppDispatch();
    const [value, setValue] = useState(exchangeRate || "0");
    const [confirmed, setConfirmed] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!confirmed) return;
        const timer = setTimeout(() => setConfirmed(false), 2000);
        return () => clearTimeout(timer);
    }, [confirmed]);

    useEffect(() => {
        const timer = setTimeout(() => setValue(exchangeRate || "0"), 0);
        return () => clearTimeout(timer);
    }, [exchangeRate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.currentTarget.value;

        const acceptCharRegex = /^[0-9.]*$/;
        const twoDecimalRegex = /^(\d+(\.\d{0,2})?)?$/;

        if (!acceptCharRegex.test(raw)) return;
        if (Number(raw) < 0) return;
        if (!twoDecimalRegex.test(raw)) return;

        setValue(raw);
        setConfirmed(false);
    };

    const isUnchanged = value === exchangeRate;
    const isInvalid = !value || Number(value) <= 0;

    const handleSubmit = async () => {
        if (isInvalid || isUnchanged || submitting) return;

        setSubmitting(true);
        try {
            await dispatch(updateSettings({ exchangeRate: value })).unwrap();
            setConfirmed(true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="rate-box flex items-center gap-2.5 bg-white border border-paper-line rounded-xs px-3.5 py-2.5 mb-5 w-fit">
            <span className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
                Today&apos;s Rate
            </span>
            <span className="font-mono text-xs text-muted">฿1 =</span>
            <input
                type="text"
                inputMode="decimal"
                value={value}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                disabled={submitting}
                aria-label="MMK exchange rate per 1 THB"
                className="w-16 font-mono text-sm font-semibold bg-transparent border-b border-paper-line focus:outline-none focus:border-ink text-right py-0.5 disabled:opacity-50"
            />
            <span className="font-mono text-xs text-muted">MMK</span>
            <button
                onClick={handleSubmit}
                disabled={submitting || isInvalid || isUnchanged}
                className="font-display text-xs font-semibold bg-ink text-paper px-3 py-1.5 rounded-xs hover:opacity-90 transition ml-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {submitting ? "..." : "Change"}
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
};

export default RateControl;
