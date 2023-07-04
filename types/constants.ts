export const API_URL = "http://localhost:8080/api";
export const fakeUserId = "e9030127-ed84-44f4-9295-5230387a95f4";
export const resources = {
    categories: {
        name: "Danh mục sản phẩm",
    },
    products: {
        name: "Sản phẩm",
    },
};
export const RESOURCE_API = {
    url: API_URL,
    users: {
        url: ``,
        defaultAddress: {
            update: (uid: string, aid: number) =>
                `users/${uid}/defaultAddress/${aid}`,
        },
    },
    shippingAddress: () => {
        const name = "shippingAddresses";
        const searchUrl = `${name}/search`;
        return {
            name,
            findAllByUserId: `${searchUrl}/findAllByUserId`,
            defaultAddressByUserId: `${searchUrl}/findDefaultShippingAddressByUserId`,
        };
    },
    orders: () => {
        const name = "orders";
        const searchUrl = `${name}/search`;
        return {
            name,
            checkout: "cart/checkout",
        };
    },
};

// const firebaseBucket = `nextjs-sneaker-shop.appspot.com`;
// const config = {
//     apiPath: process.env.NEXT_PUBLIC_API_PATH,
//     api: {
//         products: {
//             url: "/products",
//             search: {
//                 findByNameLike: (name?: string | null) => {
//                     return `/products/search/findByNameLike?name=${name}`;
//                 },
//             },
//         },
//         orders: {
//             url: "/orders",
//             status: "/orders/status",
//             phoneNumbers: "/orders/findAllPhoneNumbers",
//             search: {
//                 countByStatus: (status?: string) => {
//                     if (status === "ALL") {
//                         return `/orders/search/countAll`;
//                     }
//                     return `/orders/search/countByStatus?status=${status}`;
//                 },
//                 findByUserId: (id?: number) => {
//                     return `/orders/search/findByUserId?uid=${id}`;
//                 },
//                 findByPhone: (phoneNum?: string | null) => {
//                     return `/orders/search/findByPhone?phone=${phoneNum}`;
//                 },
//             },
//         },
//         categories: {
//             url: "/categories",
//             root: "/categories/search/root",
//         },
//         shippingAddress: {
//             search: {
//                 findByPhoneLike: (phone?: string) => {
//                     return `/shippingAddresses/search/findByPhoneLike?phone=${phone}`;
//                 },
//             },
//         },
//         users: {
//             url: "/users",
//             search: {
//                 existsBy: {
//                     phone: (phone: string) =>
//                         `/users/search/exists-by-phone?phone=${phone}`,
//                     email: (email: string) =>
//                         `/users/search/exists-by-email?email=${email}`,
//                     login: (login: string) =>
//                         `/users/search/exists-by-login?login=${login}`,
//                 },
//                 byDeletedDate: (includeDeleted: boolean) =>
//                     `/users/search/findAllByDeletedDate?includeDeleted=${includeDeleted}`,
//             },
//         },
//         image: {
//             url: (name?: string) => {
//                 if (!name) return "";

//                 return `https://firebasestorage.googleapis.com/v0/b/${firebaseBucket}
// /o/${name.replace("/", "%2F")}?alt=media&metadata=true
// `;
//             },
//         },
//         carts: {
//             url: "",
//         },
//     },
// };

// export default config;
