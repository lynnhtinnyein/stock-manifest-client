import { useEffect, useState } from "react";
import { acquireImageUrl, releaseImageUrl } from "@/utils/protectedImageCache";
import Cipher from "@/utils/cipher";

interface Props {
    src: string;
    alt?: string;
    [key: string]: any;
}

const ProtectedImage = ({ src, alt = "", ...rest }: Props) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        let acquiredSrc: string | null = null;

        const load = async () => {
            const storedToken = localStorage.getItem("stock-manifest-access-token");
            const token = storedToken ? new Cipher().decrypt(storedToken) : null;

            const url = await acquireImageUrl(src, token);
            acquiredSrc = src;

            if (cancelled) {
                // Unmounted mid-fetch (e.g. quick hover) — release right away.
                releaseImageUrl(src);
                return;
            }
            setImageUrl(url);
        };

        load();

        return () => {
            cancelled = true;
            if (acquiredSrc) releaseImageUrl(acquiredSrc);
        };
    }, [src]);

    if (!imageUrl) return null;

    return <img src={imageUrl} alt={alt} {...rest} />;
};

export default ProtectedImage;
