import { setShowItemFormDrawer } from "@/store/features/ui/uiSlice";
import { useAppDispatch } from "@/store/hooks";
import { Plus } from "lucide-react";

const Header = () => {
    const dispatch = useAppDispatch();
    const handleAdd = () => {
        dispatch(setShowItemFormDrawer(true));
    };

    return (
        <header className="border-b border-paper-line bg-paper sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <p className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase mb-1">
                            ONLINE SALE · BANGKOK DEPOT
                        </p>
                        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                            <span className="brand-mark">I want it, I got it</span>
                        </h1>
                        <p className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase mt-1.5">
                            STOCK MANIFEST
                        </p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="cursor-pointer font-display text-sm font-semibold bg-ink text-paper px-4 py-2.5 rounded-xs hover:opacity-90 transition flex items-center gap-1.5"
                    >
                        <Plus size={9} strokeWidth={4} />
                        Log New Item
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
