import NextAuth, { Awaitable, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { CredentialsProvider } from "next-auth/providers/credentials";
export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {},
            async authorize(credentials, req) {
                // TODO: Request your API to check credentials
                console.log(
                    "credentials",
                    JSON.stringify(credentials, null, 2),
                );
                const user = {
                    id: "1",
                    name: "John Doe",
                    email: "demo@refine.dev",
                    image: "https://i.pravatar.cc/300",
                };
                return user;
            },
        }),
        // ...add more providers here
    ],
    secret: ``,
};
export default NextAuth(authOptions);
