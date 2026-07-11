import { useEffect, useMemo, useState, type ChangeEvent, type SubmitEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { SlideDrawer } from "react-slide-drawer";
import { useAppDispatch } from "@/store/hooks";
import { Input, type InputChangeEvent } from "@/components/ui/Input";
import { createItem, syncImage, updateItem } from "@/store/features/items/itemsThunk";
import { addToast } from "@/lib/Toaster";
import { getComputed } from "@/lib/computed";
import { getOneToOneAttachmentsPayload, parseToLocalAttachment } from "@/lib/attachement";
import { ALLOWED_IMAGE_TYPES } from "@/configs/attachments";
import { compressImage } from "@/lib/compressImage";
import { generateId } from "@/utils/generateId";
import CategorySelect from "./CategorySelect";
import useDimensions from "@/hooks/useDimensions";
import useFileValidation from "@/hooks/useFileValidation";
import ProtectedImage from "./ui/ProtectedImage";

interface Props {
    show: boolean;
    exchangeRate: string;
    onClose: () => void;
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
    remark: "",
    image: null
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
    remark: item.remark ?? "",
    image: item?.image ? parseToLocalAttachment(item.image) : null
});

const ItemFormDrawer = ({ show, onClose, item, exchangeRate }: Props) => {
    const isEditMode = !!item;

    const { width: screenWidth } = useDimensions();
    const dispatch = useAppDispatch();
    const { validateFile } = useFileValidation();

    const [formData, setFormData] = useState<ItemFormData>(emptyForm);
    const [isErrorCheckable, setIsErrorCheckable] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!show) {
            return;
        }

        const id = setTimeout(() => {
            setFormData(item ? toFormData(item) : emptyForm);
            setIsErrorCheckable(false);
        }, 0);

        return () => clearTimeout(id);
    }, [show, item]);

    const title = useMemo(() => {
        return isEditMode ? "Edit Item" : "Add New Item";
    }, [isEditMode]);

    const formErrors = useMemo(() => {
        const errors: string[] = [];
        const requiredFields = ["name", "priceInThb", "categoryId"];
        requiredFields.forEach((field) => {
            if (!formData[field as keyof ItemFormData]) {
                errors.push(field);
            }
        });

        const stockIn = Number(formData.stockIn) || 0;
        const stockOut = Number(formData.stockOut) || 0;
        if (formData.stockOut && stockOut > stockIn) {
            errors.push("invalidStockOut");
        }

        return errors;
    }, [formData]);

    const imagePreviewUrl = useMemo(() => {
        if (!formData.image) return null;
        if (formData.image.file) return URL.createObjectURL(formData.image.file);
        return formData.image.url ?? null;
    }, [formData.image]);

    useEffect(() => {
        return () => {
            if (imagePreviewUrl && formData.image?.file) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [imagePreviewUrl, formData.image]);

    const handleInputChange = (e: InputChangeEvent) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (categoryId: number | null) => {
        setFormData((prev) => ({ ...prev, categoryId }));
    };

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file || !validateFile(file)) {
            e.target.value = "";
            return;
        }

        const compressedFile = await compressImage(file);

        setFormData((prev) => ({
            ...prev,
            image: {
                id: generateId(),
                file: compressedFile,
                name: compressedFile.name,
                originalName: file.name,
                size: compressedFile.size,
                mimeType: compressedFile.type,
                isExisting: false
            }
        }));

        e.target.value = "";
    };

    const handleImageRemove = () => {
        setFormData((prev) => ({ ...prev, image: null }));
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

            if (isEditMode && item) {
                await dispatch(updateItem({ id: item.id, payload: formData })).unwrap();
                const attachmentsPayload = getOneToOneAttachmentsPayload(
                    formData.image ? { image: formData.image } : {}
                );
                await dispatch(syncImage({ id: item.id, payload: attachmentsPayload })).unwrap();
            } else {
                const newItem = await dispatch(createItem(formData)).unwrap();
                const attachmentsPayload = getOneToOneAttachmentsPayload(
                    formData.image ? { image: formData.image } : {}
                );
                await dispatch(syncImage({ id: newItem.id, payload: attachmentsPayload })).unwrap();
            }

            addToast({
                message: isEditMode ? "Item updated!" : "Item added!",
                status: "success"
            });

            clearForm();
            onClose();
        } catch (error: unknown) {
            const errorMessage = typeof error === "string" ? error : "Server error!";
            addToast({
                message: errorMessage,
                status: "error"
            });
        } finally {
            setIsErrorCheckable(false);
            setIsSubmitting(false);
        }
    };

    const computed = useMemo(() => {
        return getComputed(
            {
                name: formData.name,
                category: { id: formData.categoryId ?? 0, name: "", color: "" },
                priceInThb: formData.priceInThb,
                weightInGrams: formData.weightInGrams,
                cargoPriceInThb: formData.cargoPriceInThb,
                cargoPriceInMmk: formData.cargoPriceInMmk,
                sellingPriceInMmk: formData.sellingPriceInMmk,
                stockIn: Number(formData.stockIn),
                stockOut: Number(formData.stockOut),
                remark: formData.remark
            } as Item,
            exchangeRate
        );
    }, [formData, exchangeRate]);

    return (
        <SlideDrawer
            show={show}
            onClose={onClose}
            width={screenWidth <= 400 ? "100%" : 400}
            animate={true}
            position="right"
            zIndex={42}
            type="front"
        >
            <div className="relative w-full max-w-md bg-paper h-full overflow-y-auto border-l border-paper-line shadow-xl">
                <div className="flex items-center justify-between px-5 py-4 border-b border-paper-line sticky top-0 bg-paper z-10">
                    <div>
                        <p className="font-mono text-[10px] tracking-[0.15em] text-muted uppercase">
                            {isEditMode ? "Edit Entry" : "New Entry"}
                        </p>
                        <h2 className="font-display text-lg font-bold">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="text-muted hover:text-ink transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="pt-5 px-5 pb-20 space-y-4">
                    <div className="flex flex-col space-y-1.5">
                        <span className="font-mono text-[10px] tracking-[0.15em] text-muted uppercase">
                            Image
                        </span>
                        {imagePreviewUrl ? (
                            <div className="relative w-24 h-24 rounded-xs overflow-hidden border border-paper-line">
                                <ProtectedImage
                                    src={imagePreviewUrl}
                                    alt={formData.image?.name}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleImageRemove}
                                    aria-label="Remove image"
                                    className="absolute top-1 right-1 bg-ink text-paper rounded-full p-0.5 hover:opacity-90 transition"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-24 h-24 rounded-xs border border-dashed border-paper-line text-muted hover:text-ink hover:border-ink transition cursor-pointer">
                                <ImagePlus size={18} />
                                <span className="font-mono text-[9px] mt-1">Upload</span>
                                <input
                                    type="file"
                                    accept={ALLOWED_IMAGE_TYPES.join(",")}
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    <Input
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Spinach Cheese Croissant"
                        isInvalid={isErrorCheckable && formErrors.includes("name")}
                        errorMessage={
                            isErrorCheckable && formErrors.includes("name") ? "Required!" : ""
                        }
                    />

                    <Input
                        label="Weight (Grams)"
                        name="weightInGrams"
                        type="number"
                        min={0}
                        placeholder="1 kg = 1000 grams"
                        value={formData.weightInGrams}
                        onChange={handleInputChange}
                    />

                    <div className="flex flex-col space-y-1">
                        <CategorySelect
                            value={formData.categoryId}
                            onChange={handleCategoryChange}
                        />
                        {isErrorCheckable && formErrors.includes("categoryId") && (
                            <span className="text-xs text-alert-red font-medium">Required!</span>
                        )}
                    </div>

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
                            label="Org. Price (MMK auto)"
                            name="priceInThb"
                            type="number"
                            min={0}
                            value={computed.priceInMmk.toString()}
                            onChange={handleInputChange}
                            isDisabled
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
                        label="Profit (MMK auto)"
                        name="profitInMmk"
                        type="number"
                        min={0}
                        value={computed.profit.toString()}
                        onChange={handleInputChange}
                        isDisabled
                    />

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
                            onClick={onClose}
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
