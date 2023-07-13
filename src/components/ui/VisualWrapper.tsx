import useRenderCount from "@/hooks/useRenderCount";
import { useIsMounted, useSsr } from "usehooks-ts";
import RenderCount from "./RenderCount";
const DEBUG = false;

function VisualWrapper({
    children,
    name,
    debug = DEBUG,
    isRenderCount,
}: {
    children: React.ReactNode;
    name?: string;
    debug?: boolean;
    isRenderCount?: boolean;
}) {
    const { isServer: ssr } = useSsr();
    return <>{children}</>;
    if (!debug) {
        return <div>{children}</div>;
    }
    return (
        <div
            // className={`border-4 ${
            //      ssr ? "border-blue-800" : "border-red-800"
            // } rounded-lg relative`}
            className={`relative w-full group hover:outline-dashed ${
                ssr ? "outline-blue-600" : "outline-red-600"
            }`}
        >
            {isRenderCount && <RenderCount />}

            {!!name && (
                <div
                    className={`absolute bottom-0 w-full hidden group-hover:flex opacity-75 text-2xl rounded-t-sm ${
                        ssr ? "bg-blue-100" : "bg-red-100"
                    } font-bold`}
                >
                    <div
                        className={`ml-2 py-2 ${
                            ssr ? "text-blue-700" : "text-red-700"
                        }`}
                    >
                        {name}
                    </div>
                </div>
            )}
            <>{children}</>
        </div>
    );
}

export default VisualWrapper;
