import { IdTokenResult, User } from "firebase/auth";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`
     */
    interface Session {
        user: AppUSer & DefaultUser;
    }
}

export interface AppUser {
    id: string;
    name: string | null;
    email?: string | null;
    image?: string | null;
    phone?: string | null;
    isAnonymous?: boolean;
    metadata: user.metadata;
    providerId?: string;
    tokens: {
        accessToken: IdTokenResult;
        refreshToken: string;
    };
}
