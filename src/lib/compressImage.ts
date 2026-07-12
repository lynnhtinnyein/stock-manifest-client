import imageCompression from "browser-image-compression";

const OPTIONS = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1200,
    useWebWorker: false,
    fileType: "image/jpeg",
    initialQuality: 0.8
};

const COMPRESSABLE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function compressImage(file: File): Promise<File> {
    if (!COMPRESSABLE_TYPES.has(file.type)) return file;

    try {
        const compressed = await imageCompression(file, OPTIONS);
        const name = file.name.replace(/\.[^.]+$/, ".jpg");
        return new File([compressed], name, { type: "image/jpeg" });
    } catch {
        return file;
    }
}
