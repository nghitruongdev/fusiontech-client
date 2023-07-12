import { firebaseAuth } from "@/providers/firebaseAuthProvider";
import { User } from "firebase/auth";
import { create } from "zustand";

type State = {
    user: User | null;
};

type Action = {
    setUser: (user: State["user"]) => void;
    updateUser: () => void;
    isAnonymous: () => boolean | undefined;
};

const getCurrentUser = () => {
    console.log("getCurrentUser called");
    return firebaseAuth.auth.currentUser;
};

export const useAuthStore = create<State>(() => ({
    user: getCurrentUser(),
}));

export const setUser = (user: State["user"]) => {
    useAuthStore.setState({ user: user });
    console.log("setUser called", useAuthStore.getState().user?.uid);
};

export default useAuthStore;
