import { ReactNode } from "react";
import { cookies } from "next/headers";
import { authProvider } from "@/providers/authProvider";
import { redirect } from "next/navigation";
type Props = {
    children: ReactNode;
};

async function checkAuth(authCookie: string | undefined) {
    // return await authProvider.check(authCookie);
}

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = cookies();
    const auth = cookieStore.get("auth");

    // const { authenticated } = await checkAuth(auth?.value);
    // const authenticated = true;
    // if (authenticated) {
    //     return redirect("/");
    // } else {
    //     return <>{children}</>;
    // }
    return <>{children}</>;
}

// export const getServerSideProps = async (context) => {
// We've handled the SSR case in our `check` function by sending the `context` as parameter.
//     const { authenticated, redirectTo } = await authProvider.check(context);

//     if (!authenticated) {
//         context.res.statusCode = 401;
//         context.res.end();
//     }

//     if (!authenticated && redirectTo) {
//         return {
//             redirect: {
//                 destination: redirectTo,
//                 permanent: false,
//             },
//         };
//     }

//     return {
//         props: {
//             authenticated,
//         },
//     };
// };

// export async function getServerSideProps(context: any) {
//     const session = await getServerSession(
//         context.req,
//         context.res,
//         authOptions,
//     );

//     if (!session) {
//         return {
//             redirect: {
//                 destination: `/login?to=${encodeURIComponent(
//                     context.req.url || "/",
//                 )}`,
//                 permanent: false,
//             },
//         };
//     }

//     return {
//         props: {
//             session,
//         },
//     };
// }
