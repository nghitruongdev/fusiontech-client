import { DefaultSession } from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`
     */
    interface Session {
        user: {
            /** The user's postal address */
            address: string;
        } & DefaultSession["user"];
    }
}
