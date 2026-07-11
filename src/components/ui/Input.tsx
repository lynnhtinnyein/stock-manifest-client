import { type ChangeEvent, memo, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

export type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const ID_SEPARATOR = "___";

interface InputProps {
    id?: string;
    label?: string;
    name: string;
    type?: "text" | "number" | "decimal" | "textarea";
    placeholder?: string;
    value: string;
    isInvalid?: boolean;
    errorMessage?: string;
    onChange: (event: InputChangeEvent) => void;
    min?: number;
    max?: number;
    maxLength?: number;
    isDisabled?: boolean;
}

const fieldClass = (isInvalid?: boolean, isDisabled?: boolean) =>
    [
        "w-full text-sm px-3 py-2.5 border rounded-xs bg-white focus:outline-none transition",
        isInvalid
            ? "border-alert-red focus:border-alert-red"
            : "border-paper-line focus:border-ink",
        isDisabled ? "cursor-not-allowed bg-gray-100" : ""
    ]
        .filter(Boolean)
        .join(" ");

export const Input = ({
    id,
    label,
    name,
    type = "text",
    placeholder,
    value,
    isInvalid,
    errorMessage,
    onChange,
    min,
    max,
    maxLength = 500,
    isDisabled
}: InputProps) => {
    const [uuid] = useMemo(() => [uuidv4()], []);
    const prefixedId = id ? `${uuid}${ID_SEPARATOR}${id}` : name;

    const isNumeric = type === "number" || type === "decimal";
    const isTextarea = type === "textarea";

    const currentLength = value?.length ?? 0;
    const isMaxLengthReached = currentLength >= maxLength;

    const handleNumericChange = (e: ChangeEvent<HTMLInputElement>) => {
        const raw = e.currentTarget.value;

        const acceptCharRegex = /^[0-9.]*$/;
        const twoDecimalRegex = /^(\d+(\.\d{0,2})?)?$/;

        if (!acceptCharRegex.test(raw)) return;
        if (Number(raw) < 0) return;
        if (!twoDecimalRegex.test(raw)) return;

        const numericValue = Number(raw);
        if (typeof min === "number" && raw !== "" && numericValue < min) return;
        if (typeof max === "number" && numericValue > max) return;

        onChange({ ...e, target: { ...e.target, name, value: raw } } as InputChangeEvent);
    };

    return (
        <div className="flex w-full flex-col space-y-1">
            {label && (
                <label
                    htmlFor={prefixedId}
                    className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase block"
                >
                    {label}
                </label>
            )}

            {isTextarea ? (
                <textarea
                    id={prefixedId}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={isDisabled}
                    rows={3}
                    maxLength={maxLength}
                    className={`${fieldClass(isInvalid, isDisabled)} resize-none`}
                />
            ) : (
                <input
                    id={prefixedId}
                    name={name}
                    type="text"
                    inputMode={
                        type === "number" ? "numeric" : type === "decimal" ? "decimal" : undefined
                    }
                    value={value}
                    onChange={isNumeric ? handleNumericChange : onChange}
                    placeholder={placeholder}
                    disabled={isDisabled}
                    className={`disabled:bg-paper disabled:text-muted ${fieldClass(isInvalid, isDisabled)}${isNumeric ? " font-mono" : ""}`}
                />
            )}

            {isTextarea && (
                <div className="font-mono text-[10px] text-muted">
                    {currentLength} / {maxLength}
                    {isMaxLengthReached && (
                        <span className="ml-1 text-alert-red">Max length reached.</span>
                    )}
                </div>
            )}

            {isInvalid && errorMessage && (
                <p className="text-xs text-alert-red font-medium">{errorMessage}</p>
            )}
        </div>
    );
};

export default memo(Input);
