import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from "@/configs/attachments";
import { addToast } from "@/lib/Toaster";

const useFileValidation = () => {
    const validateFile = (file: File) => {
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
