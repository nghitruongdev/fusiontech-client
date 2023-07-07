import { useRef, useEffect } from "react";

const useRenderCount = () => {
    const renderCountRef = useRef(0);

    useEffect(() => {
        renderCountRef.current += 1;
        console.count("Component rendered");
    });

    return renderCountRef.current;
};

export default useRenderCount;
