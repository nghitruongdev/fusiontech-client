const throwIfMissing = (name: string) => {
    throw new Error(`${name} is missing from .env.local`);
    return "";
};

export const API_URL =
    process.env.NEXT_PUBLIC_RESOURCE_SERVER_URL ??
    throwIfMissing("NEXT_PUBLIC_RESOURCE_SERVER_URL");

export const fakeUserId = process.env.NEXT_PUBLIC_FAKE_USER_ID ?? "";
// throwIfMissing("NEXT_PUBLIC_FAKE_USER_ID");
