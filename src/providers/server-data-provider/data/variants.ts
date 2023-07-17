import { API, IVariant, ResourceName } from "types";
import { cleanUrl } from "../../../lib/utils";
import { ListData, serverDataProvider as provider } from "../provider";

const { resource, projection } = API["variants"]();
export const getProductVariants = async (url?: string) => {
    if (!url) {
        return;
    }
    return provider.custom<IVariant>({
        url: cleanUrl(url),
        resource,
        projecion: projection.withAttributes,
    }) as Promise<ListData<IVariant>>;
};
