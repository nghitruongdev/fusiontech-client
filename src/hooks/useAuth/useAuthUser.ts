import { User } from "@firebase/auth";
import { create } from "zustand";

type State = {
    user: User | null;
};

const store = create<State>()(() => ({
    user: null,
}));

export const useAuthUser = () => {
    const user = store((state) => state.user);
    return {
        user,
    };
};
export const setAuthUser = (user: State["user"]) => {
    store.setState(() => ({ user }));
};
