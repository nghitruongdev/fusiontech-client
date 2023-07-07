/**
 * used together with React's use hook for waiting for some condition become true
 * @param condition if true, resolve promise immediately
 * @returns undefined
 */
export const suspensePromise = (condition?: boolean) => {
    return new Promise((res) => {
        if (condition) {
            res(undefined);
        }
    });
};
