import { waitPromise } from "@/lib/promise";
import { toRecord } from "@/lib/utils";
import { IProduct } from "types";
import { serverDataProvider } from "./provider";

export const getProductsWithDetails = async () => {
    return serverDataProvider.getList<IProduct, "id">({
        resource: "products",
        key: "id",
        query: {
            projection: "full",
        },
    });
};
