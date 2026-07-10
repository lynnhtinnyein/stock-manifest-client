type UploadedAttachment = {
    id: number;
    originalName: string;
    storedName: string;
    mimeType: string;
    size: number;
    sizeFormatted: string;
    url: string;
    createdAt: string;
};

type Attachment = {
    id: number;
    originalName: string;
    file?: File;
    url?: string;
    name: string;
    size: number;
    mimeType: string;
    isExisting: boolean;
};
