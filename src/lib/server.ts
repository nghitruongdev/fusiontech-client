"server-only";

const basePath = process.env.NEXT_URL ?? "http://localhost:3000";
export const getServerSession = async () => {
    return (
        await fetch(`${basePath}/api/auth/session`, {
            cache: "no-store",
        })
    ).json();
};
