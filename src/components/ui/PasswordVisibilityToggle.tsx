import { Eye, EyeOff } from "lucide-react";

interface Props {
    show: boolean;
    onToggle: (show: boolean) => void;
}

const PasswordVisibilityToggle = ({ show, onToggle }: Props) => {
    const handleChange = () => {
        onToggle(!show);
    };
    return (
        <button
            aria-label="toggle password visibility"
            className="focus:outline-none cursor-pointer"
            type="button"
            onClick={handleChange}
        >
            {show ? (
                <EyeOff size={18} className="text-default-400 pointer-events-none" />
            ) : (
                <Eye size={18} className="text-default-400 pointer-events-none" />
            )}
        </button>
    );
};

export default PasswordVisibilityToggle;
