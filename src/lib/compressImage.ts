import imageCompression from "browser-image-compression";

const OPTIONS = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: "image/jpeg",
    initialQuality: 0.8
};

export async function compressImage(file: File): Promise<File> {
    if (!file.type.startsWith("image/")) return file;

    const compressed = await imageCompression(file, OPTIONS);
    const name = file.name.replace(/\.[^.]+$/, ".jpg");

    return new File([compressed], name, { type: "image/jpeg" });
}
