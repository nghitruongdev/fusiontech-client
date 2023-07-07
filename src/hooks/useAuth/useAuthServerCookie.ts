import { RedirectType } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
type Options = {
    required?: boolean;
    callbackUrl?: string;
    type?: RedirectType;
};

const useAuthServerCookie = (props?: { options?: Options }) => {
    const { options } = (props = {} as any);
    const auth = cookies().get("auth")?.value;
    if (!!auth) {
        const user = JSON.parse(auth);
        console.log("user", user);
        return {
            isAuthenticated: true,
            user: user,
        };
    }

    if (!!props?.options) {
        const { required, callbackUrl, type } = options;
        if (required) {
            redirect(callbackUrl ?? "/", type);
        }
    }
    return {
        isAuthenticated: false,
    };
};
export default useAuthServerCookie;
