"use client";

import useRenderCount from "@/hooks/useRenderCount";
const RenderCount = () => {
    const count = useRenderCount();
    return <p className=" text-2xl">{count}</p>;
};
export default RenderCount;
