"use client";

import { useShow, IResourceComponentsProps, useOne } from "@refinedev/core";
import { Show, NumberField, TagField, TextField } from "@refinedev/chakra-ui";
import { Heading, HStack, Image } from "@chakra-ui/react";
import { formatPrice } from "@/lib/utils";
import { API, IProduct, IVariant } from "types";
import { PropsWithChildren, createContext, useContext, useEffect } from "react";

const page = () => {
    return (
        <ContextProvider>
            <VariantShow />
        </ContextProvider>
    );
};

export const VariantShow: React.FC<IResourceComponentsProps> = () => {
    const {
        queryResult: { isLoading },
        record,
        productData: { product, productStatus },
    } = useContextProvider();
    useEffect(() => {
        if (product) {
            console.log("product", product);
        }
    }, [product]);
    const firstImage = record?.images?.[0];
    return (
        <Show isLoading={isLoading}>
            <div className="grid grid-cols-2">
                <div className="">
                    <Heading as="h5" size="sm" mt={4}>
                        Images
                    </Heading>
                    <div className="">
                        {/* If there are no images, display a placeholder */}
                        {!firstImage && <>Hiển thị ảnh trống</>}
                        {firstImage && (
                            <Image sx={{ maxWidth: 300 }} src={firstImage} />
                        )}
                    </div>
                    <div className="flex">
                        {record?.images?.map((item: any) => (
                            <Image
                                sx={{ maxWidth: 50 }}
                                src={item}
                                key={item}
                            />
                        ))}
                    </div>
                </div>
                <div className="">
                    <Heading as="h5" size="sm" mt={4}>
                        Id
                    </Heading>
                    <NumberField value={record?.id ?? ""} />
                    <Heading as="h5" size="sm" mt={4}>
                        Sku
                    </Heading>
                    <TextField value={record?.sku} />
                    <Heading as="h5" size="sm" mt={4}>
                        Price
                    </Heading>
                    <NumberField value={formatPrice(record?.price)} />
                    <Heading as="h5" size="sm" mt={4}>
                        Available Quantity
                    </Heading>
                    <NumberField value={`${record?.availableQuantity}`} />
                    <Heading as="h5" size="sm" mt={4}>
                        Attributes
                    </Heading>
                    {JSON.stringify(record?.attributes)}
                    <Heading as="h5" size="sm" mt={4}>
                        Product Info
                    </Heading>
                    {productStatus === "loading" && <>Product is Loading</>}
                    {productStatus === "success" && product && (
                        <>{JSON.stringify(product)}</>
                    )}
                </div>
            </div>
        </Show>
    );
};

const Context = createContext<State | null>(null);
const useContextProvider = () => {
    const ctx = useContext(Context);
    if (!ctx) throw new Error("Context Provider is missing");
    return ctx;
};

type State = {
    record: IVariant | undefined;
    productData: {
        product: IProduct | undefined;
        productStatus: "error" | "loading" | "success";
    };
} & ReturnType<typeof useShow<IVariant>>;

const productResource = API["products"]();
const variantResource = API["variants"]();
const ContextProvider = ({ children }: PropsWithChildren) => {
    const showProps = useShow<IVariant>({
        meta: {
            query: {
                projection: variantResource.projection.withAttributes,
            },
        },
    });
    const { data: { data: record } = {} } = showProps.queryResult;

    const { data: { data: product } = {}, status: productStatus } =
        useOne<IProduct>({
            resource: productResource.resource,
            id: record?.product?.id,
            queryOptions: {
                enabled: !!record?.product,
            },
        });
    return (
        <Context.Provider
            value={{
                ...showProps,
                record,
                productData: {
                    product,
                    productStatus,
                },
            }}
        >
            {children}
        </Context.Provider>
    );
};

const render = (variant: IVariant | undefined) => {
    if (!variant) {
    }
};
export default page;
