export const parseToLocalAttachment = (attachment: UploadedAttachment): Attachment => {
    return {
        id: attachment.id,
        url: attachment.url,
        name: attachment.originalName,
        originalName: attachment.originalName,
        size: attachment.size || 0,
        mimeType: attachment.mimeType,
        isExisting: true
    };
};

export const getOneToOneAttachmentsPayload = (
    attachments: Record<string, Attachment | undefined> | Attachment[]
): FormData => {
    const formData = new FormData();
    Object.entries(attachments).forEach(([key, attachment]) => {
        if (attachment) {
            if (attachment.isExisting) {
                // update or unchanged
                formData.append(`${key}[id]`, attachment.id.toString());
                if (attachment.file) {
                    // update
                    formData.append(`${key}[file]`, attachment.file);
                }
            } else {
                //create
                formData.append(`${key}[file]`, attachment.file!);
            }
        } else {
            // delete
            formData.append(key, "null");
        }
    });

    return formData;
};
