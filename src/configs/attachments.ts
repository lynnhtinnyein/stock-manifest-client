export const ALLOWED_IMAGE_TYPES = [
    //images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif"
];

export const ALLOWED_DOCUMENT_TYPES = [
    // word files
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    // excel files
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    // zip files
    "application/zip",
    "application/x-rar-compressed",

    // other files
    "text/plain",
    "application/pdf"
];

export const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];

export const MAX_FILE_SIZE_MB = 10; //MB
export const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024; // in bytes
export const MAX_FILE_COUNT = 5;
