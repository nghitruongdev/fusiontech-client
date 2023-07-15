import { useCurrentUrl } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

const useCallbackUrl = () => {
    const currentUrl = useCurrentUrl();
    const searchParams = useSearchParams();
    const isAuthPage = currentUrl.includes("/auth/");
    const previousCallback = searchParams.get("callbackUrl");
    if (previousCallback) {
        return {
            callbackUrl: previousCallback,
        };
    }
    if (isAuthPage) {
        return {
            callbackUrl: null,
        };
    }
    return {
        callbackUrl: encodeURIComponent(currentUrl),
    };
};
export default useCallbackUrl;
