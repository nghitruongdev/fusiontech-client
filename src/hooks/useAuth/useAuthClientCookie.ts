import nookies from "nookies";

const useAuthClientCookie = (props?: {}) => {
    const {} = (props = {} as any);
    const { auth } = nookies.get(null);
    if (!!auth) {
        const user = JSON.parse(auth);
        console.log("user", user);
        return {
            isAuthenticated: true,
            user: user,
        };
    }
    return {
        isAuthenticated: false,
    };
};
export default useAuthClientCookie;
