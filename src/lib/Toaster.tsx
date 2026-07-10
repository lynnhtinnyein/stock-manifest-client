import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastStatus = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    message: string;
    status: ToastStatus;
}

let globalDispatch: React.Dispatch<
    { type: "ADD"; toast: Toast } | { type: "REMOVE"; id: string }
> | null = null;

// eslint-disable-next-line react-refresh/only-export-components
export function addToast(input: string | { message: string; status?: ToastStatus }): string {
    const toast: Omit<Toast, "id"> =
        typeof input === "string"
            ? { message: input, status: "info" }
            : { status: "info", ...input };
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    globalDispatch?.({ type: "ADD", toast: { id, ...toast } });
    return id;
}

const STATUS_CONFIG: Record<
    ToastStatus,
    { icon: typeof Info; color: string; bg: string; border: string }
> = {
    success: {
        icon: CheckCircle2,
        color: "text-ok-green",
        bg: "bg-ok-green/5",
        border: "border-ok-green/25",
    },
    error: {
        icon: XCircle,
        color: "text-alert-red",
        bg: "bg-alert-red/5",
        border: "border-alert-red/25",
    },
    warning: {
        icon: AlertTriangle,
        color: "text-stamp-amber",
        bg: "bg-stamp-amber/5",
        border: "border-stamp-amber/25",
    },
    info: {
        icon: Info,
        color: "text-manifest-blue",
        bg: "bg-manifest-blue/5",
        border: "border-manifest-blue/25",
    },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
    const config = STATUS_CONFIG[toast.status];
    const Icon = config.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`group pointer-events-auto flex items-start gap-2.5
                rounded-sm border px-3.5 py-2.5
                font-body text-sm text-ink shadow-sm backdrop-blur-sm
                ${config.bg} ${config.border}`}
        >
            <Icon size={15} className={`mt-0.5 shrink-0 ${config.color}`} />
            <span className="flex-1 leading-snug">{toast.message}</span>
            <button
                onClick={() => onDismiss(toast.id)}
                className="mt-0.5 shrink-0 rounded-xs p-0.5 text-muted opacity-0 transition
                    hover:text-ink hover:bg-ink/5 group-hover:opacity-100"
                aria-label="Dismiss"
            >
                <X size={13} />
            </button>
        </motion.div>
    );
}

function ToastContainer({
    toasts,
    onDismiss
}: {
    toasts: Toast[];
    onDismiss: (id: string) => void;
}) {
    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-end gap-2 p-4 sm:bottom-4 sm:items-end sm:p-6">
            <AnimatePresence mode="popLayout">
                {toasts.map((t) => (
                    <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
                ))}
            </AnimatePresence>
        </div>
    );
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        const timer = timers.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timers.current.delete(id);
        }
    }, []);

    const dispatch = useCallback(
        (action: { type: "ADD"; toast: Toast } | { type: "REMOVE"; id: string }) => {
            if (action.type === "ADD") {
                setToasts((prev) => [...prev, action.toast]);
                const timer = setTimeout(() => {
                    dismiss(action.toast.id);
                }, 4000);
                timers.current.set(action.toast.id, timer);
            } else {
                dismiss(action.id);
            }
        },
        [dismiss]
    );

    useEffect(() => {
        globalDispatch = dispatch;
        return () => {
            globalDispatch = null;
        };
    }, [dispatch]);

    return (
        <>
            {children}
            <ToastContainer toasts={toasts} onDismiss={dismiss} />
        </>
    );
}
