import { firebaseAuth } from "@/providers/firebaseAuthProvider";
import { useEffect, useState } from "react";

export const useAuthUser = () => {
    const { currentUser } = firebaseAuth.auth;
    const [user, setUser] = useState(currentUser);

    useEffect(() => {
        setUser(currentUser);
    }, [currentUser]);

    return { user };
};
