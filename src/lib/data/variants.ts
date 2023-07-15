import { IVariant, ResourceName, projectionAPI } from "types";
import { cleanUrl } from "../utils";
import { ListData, serverDataProvider as provider } from "./provider";

const resource: ResourceName = "variants";
export const getProductVariants = async (url?: string) => {
    if (!url) {
        return;
    }

    return provider.custom<IVariant>({
        resource,
        projecion: projectionAPI[resource].withAttributes,
        url: cleanUrl(url),
    }) as Promise<ListData<IVariant>>;
};
