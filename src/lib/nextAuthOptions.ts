import { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AppUser } from "types/next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_ID || "",
        //     clientSecret: process.env.GOOGLE_SECRET || "",
        // }),
        CredentialsProvider({
            id: "firebase",
            name: "Firebase",
            credentials: {},
            async authorize(credentials, req) {
                const authUser = req.body?.user;
                if (!!!authUser)
                    throw Error("Không tìm thấy người dùng firebase");
                const user = JSON.parse(authUser) as AppUser;
                return user;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile, user, trigger, session }) {
            if (!!user) {
                const nextUser = user as AppUser;
                token.accessToken = nextUser.tokens.accessToken;
                token.refreshToken = nextUser.tokens.refreshToken;
                token.metadata = nextUser.metadata;
                token.isAnonymous = nextUser.isAnonymous;
                token.phone = nextUser.phone;
            }
            // console.log("JWT token", token);
            // console.log("JWT user", user);
            // console.log("JWT account", account);
            // console.log("JWT profile", profile);
            // console.log("JWT trigger", trigger);
            // console.log("JWT session", session);
            return token;
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                phone: token.phone,
                metadata: token.metadata,
                isAnonymous: token.isAnonymous,
                accessToken: (token.accessToken as any).token,
            };
            // console.log("session", session);
            return session;
        },
        // redirect(params) {},
    },

    secret: process.env.NEXTAUTH_SECRET,
};
