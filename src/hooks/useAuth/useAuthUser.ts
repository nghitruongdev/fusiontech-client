import { User } from "@firebase/auth";
import { useEffect } from "react";
import { create } from "zustand";

type State = {
    user: User | null;
    roles: string[];
};

const store = create<State>()(() => ({
    user: null,
    roles: [],
}));

export const useAuthUser = () => {
    const user = store((state) => state.user);

    useEffect(() => {
        console.log("use");
        if (user) {
            user.getIdTokenResult().then((token) =>
                console.log("token.claims", token.claims),
            );
        }
    }, [user]);

    return {
        user,
    };
};
export const setAuthUser = (user: State["user"]) => {
    store.setState(() => ({ user }));
};
