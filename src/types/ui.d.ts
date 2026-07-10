type ViewMode = "table" | "card";

type Option = {
    label: string;
    value: string;
};

type DropdownOption<T> = {
    label: string;
    value: T | null;
    description?: string;
};
