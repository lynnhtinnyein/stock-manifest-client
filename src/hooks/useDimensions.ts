import { useEffect, useState } from "react";

interface Dimension {
    width: number;
    height: number;
}

const getDimensions = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth <= 640
});

const useDimensions = () => {
    const [state, setState] = useState<Dimension & { isMobile: boolean }>(() =>
        typeof window !== "undefined" ? getDimensions() : { width: 0, height: 0, isMobile: false }
    );

    useEffect(() => {
        const handleResize = () => setState(getDimensions());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return state;
};

export default useDimensions;
