import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from "@/configs/attachments";
import { addToast } from "@/lib/Toaster";

const BLOCKED_EXTENSIONS = [".heic", ".heif", ".avif"];

const useFileValidation = () => {
    const validateFile = (file: File) => {
        const ext = "." + file.name.split(".").pop()?.toLowerCase();

        if (BLOCKED_EXTENSIONS.includes(ext)) {
            addToast({
                message: `${file.name} is not a supported image format`,
                status: "warning"
            });
            return false;
        }

        if (file.size > MAX_FILE_SIZE) {
            addToast({
                message: `${file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit`,
                status: "warning"
            });
            return false;
        }

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            addToast({
                message: `${file.name} is not an allowed file type`,
                status: "warning"
            });
            return false;
        }

        return true;
    };

    return {
        validateFile
    };
};

export default useFileValidation;
