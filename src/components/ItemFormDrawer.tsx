import { useEffect, useMemo, useState, type SubmitEvent } from "react";
import { X } from "lucide-react";
import { SlideDrawer } from "react-slide-drawer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setShowItemFormDrawer } from "@/store/features/ui/uiSlice";
import { Input, type InputChangeEvent } from "@/components/ui/Input";
import { createItem } from "@/store/features/items/itemsThunk";
import CategorySelect from "./CategorySelect";

interface Props {
    item: Item | null;
}

const emptyForm: ItemFormData = {
    name: "",
    categoryId: null as number | null,
    priceInThb: "",
    weightInGrams: "",
    cargoPriceInThb: "",
    cargoPriceInMmk: "",
    sellingPriceInMmk: "",
    stockIn: "",
    stockOut: "",
    remark: ""
};

const toFormData = (item: Item): ItemFormData => ({
    name: item.name ?? "",
    categoryId: item.category.id ?? null,
    priceInThb: item.priceInThb?.toString() ?? "",
    weightInGrams: item.weightInGrams?.toString() ?? "",
    cargoPriceInThb: item.cargoPriceInThb?.toString() ?? "",
    cargoPriceInMmk: item.cargoPriceInMmk?.toString() ?? "",
    sellingPriceInMmk: item.sellingPriceInMmk?.toString() ?? "",
    stockIn: item.stockIn?.toString() ?? "",
    stockOut: item.stockOut?.toString() ?? "",
    remark: item.remark ?? ""
});

const ItemFormDrawer = ({ item }: Props) => {
    const isEditMode = !!item;

    const dispatch = useAppDispatch();
    const { showItemFormDrawer } = useAppSelector((state) => state.ui);

    const [formData, setFormData] = useState<ItemFormData>(emptyForm);
    const [isErrorCheckable, setIsErrorCheckable] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!showItemFormDrawer) {
            return;
        }

        // Defer state updates to avoid synchronous setState within effect
        // which can cause cascading renders. Schedule with setTimeout so
        // the update happens after the current render cycle.
        const id = setTimeout(() => {
            setFormData(item ? toFormData(item) : emptyForm);
            setIsErrorCheckable(false);
        }, 0);

        return () => clearTimeout(id);
    }, [showItemFormDrawer, item]);

    const title = useMemo(() => {
        return isEditMode ? "Edit Item" : "Log New Item";
    }, [isEditMode]);

    const formErrors = useMemo(() => {
        const errors: string[] = [];
        const requiredFields = ["name", "priceInThb"];
        requiredFields.forEach((field) => {
            if (!formData[field as keyof ItemFormData]) {
                errors.push(field);
            }
        });

        // stockOut can never exceed stockIn
        const stockIn = Number(formData.stockIn) || 0;
        const stockOut = Number(formData.stockOut) || 0;
        if (formData.stockOut && stockOut > stockIn) {
            errors.push("invalidStockOut");
        }

        return errors;
    }, [formData]);

    const handleInputChange = (e: InputChangeEvent) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (categoryId: number | null) => {
        setFormData((prev) => ({ ...prev, categoryId }));
    };

    const handleClose = () => {
        dispatch(setShowItemFormDrawer(false));
    };

    const clearForm = () => {
        setFormData(emptyForm);
        setIsErrorCheckable(false);
    };

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsErrorCheckable(true);

        if (formErrors.length !== 0) {
            return;
        }

        try {
            setIsSubmitting(true);

            console.log("Form submitted with data:", formData);

            if (isEditMode && item) {
                // TODO: await dispatch(updateItem({ id: item.id, payload: formData })).unwrap();
            } else {
                await dispatch(createItem(formData)).unwrap();
            }

            // clearForm();
            // handleClose();
        } catch (error: unknown) {
            // TODO: surface error via toast once available in this app
            console.error(error);
        } finally {
            setIsErrorCheckable(false);
            setIsSubmitting(false);
        }
    };

    return (
        <SlideDrawer
            show={showItemFormDrawer}
            onClose={handleClose}
            width={400}
            animate={true}
            position="right"
            zIndex={42}
            type="front"
        >
            <div className="absolute inset-0 bg-ink/40" onClick={handleClose} />
            <div className="relative w-full max-w-md bg-paper h-full overflow-y-auto border-l border-paper-line shadow-xl">
                <div className="flex items-center justify-between px-5 py-4 border-b border-paper-line sticky top-0 bg-paper z-10">
                    <div>
                        <p className="font-mono text-[10px] tracking-[0.15em] text-muted uppercase">
                            {isEditMode ? "Edit Entry" : "New Entry"}
                        </p>
                        <h2 className="font-display text-lg font-bold">{title}</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        aria-label="Close"
                        className="text-muted hover:text-ink transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <Input
                        label="Item Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Spinach Cheese Croissant"
                        isInvalid={isErrorCheckable && formErrors.includes("name")}
                        errorMessage={
                            isErrorCheckable && formErrors.includes("name") ? "Required!" : ""
                        }
                    />

                    <CategorySelect value={formData.categoryId} onChange={handleCategoryChange} />

                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Org. Price (THB)"
                            name="priceInThb"
                            type="number"
                            min={0}
                            value={formData.priceInThb}
                            onChange={handleInputChange}
                            isInvalid={isErrorCheckable && formErrors.includes("priceInThb")}
                            errorMessage={
                                isErrorCheckable && formErrors.includes("priceInThb")
                                    ? "Required!"
                                    : ""
                            }
                        />
                        <Input
                            label="Weight (Grams)"
                            name="weightInGrams"
                            type="number"
                            min={0}
                            value={formData.weightInGrams}
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Cargo Price (THB)"
                            name="cargoPriceInThb"
                            type="number"
                            min={0}
                            value={formData.cargoPriceInThb}
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Cargo Price (MMK)"
                            name="cargoPriceInMmk"
                            type="number"
                            min={0}
                            value={formData.cargoPriceInMmk}
                            onChange={handleInputChange}
                        />
                        <div className="col-span-2">
                            <Input
                                label="Sell Price (MMK)"
                                name="sellingPriceInMmk"
                                type="number"
                                min={0}
                                value={formData.sellingPriceInMmk}
                                onChange={handleInputChange}
                            />
                        </div>
                        <Input
                            label="Stock In"
                            name="stockIn"
                            type="number"
                            min={0}
                            value={formData.stockIn}
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Stock Out"
                            name="stockOut"
                            type="number"
                            min={0}
                            value={formData.stockOut}
                            onChange={handleInputChange}
                            isInvalid={isErrorCheckable && formErrors.includes("invalidStockOut")}
                            errorMessage={
                                isErrorCheckable && formErrors.includes("invalidStockOut")
                                    ? "Cannot exceed stock in"
                                    : ""
                            }
                        />
                    </div>

                    <Input
                        label="Remark"
                        name="remark"
                        type="textarea"
                        value={formData.remark}
                        onChange={handleInputChange}
                        placeholder="Optional note"
                    />

                    <div className="flex items-center gap-2 pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 font-display text-sm font-semibold bg-ink text-paper px-4 py-2.5 rounded-xs hover:opacity-90 transition disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Save Item"}
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="font-display text-sm font-semibold text-muted px-4 py-2.5"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </SlideDrawer>
    );
};

export default ItemFormDrawer;
