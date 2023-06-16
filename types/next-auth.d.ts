import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`
     */
    interface Session {
        user: {
            id: string;
            /** The user's postal address */
            address: string;
        } & DefaultUser;
    }
}
