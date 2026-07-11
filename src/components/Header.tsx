import { Plus, LogOut } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";

interface Props {
    onAdd?: () => void;
}

const Header = ({ onAdd }: Props) => {
    const dispatch = useAppDispatch();

    return (
        <header className="border-b border-paper-line bg-paper sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <p className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase mb-1">
                            ONLINE SALES · BANGKOK DEPOT
                        </p>
                        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                            <span className="brand-mark">I want it, I got it</span>
                        </h1>
                        <p className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase mt-1.5">
                            STOCK MANIFEST
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onAdd}
                            className="cursor-pointer font-display text-sm font-semibold bg-ink text-paper px-4 py-2.5 rounded-xs hover:opacity-90 transition flex items-center gap-1.5"
                        >
                            <Plus size={9} strokeWidth={4} />
                            Add New Item
                        </button>
                        <button
                            onClick={() => dispatch({ type: "auth/logout" })}
                            className="cursor-pointer font-display text-sm font-semibold border border-paper-line text-muted px-3 py-2.5 rounded-xs hover:text-ink hover:border-ink/30 transition flex items-center gap-1.5"
                        >
                            <LogOut size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
