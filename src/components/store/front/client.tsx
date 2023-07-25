"use client";
import { useEffect, useState } from "react";
import favoriteApi from "src/api/favoriteAPI";
import { useBoolean } from "@chakra-ui/react";
import { Heart } from "lucide-react";
import { createContext, useContext, PropsWithChildren } from "react";
import { IProduct } from "types";
import useFavorite, { useFavoriteStore } from "@/hooks/useFavorite";

type ContextState = {
    product: IProduct;
};
const ProductContext = createContext<ContextState | null>(null);
const useProductCardContext = () => {
    const ctx = useContext(ProductContext);
    if (!ctx) throw new Error("ProductContext.Provider is missing");
    return ctx;
};

export const ProductCardProvider = ({
    children,
    product,
}: PropsWithChildren<{ product: IProduct }>) => {
    return (
        <ProductContext.Provider value={{ product }}>
            {children}
        </ProductContext.Provider>
    );
};

export const FavoriteButton = () => {
    // const [isFavorited, { toggle }] = useBoolean(Math.random() > 0.5);
    const [isFavorited, setFavorited] = useState(false);
    const [isBouncing, { on: startBouncing, off: stopBouncing }] = useBoolean();
    const { product } = useProductCardContext();
    const {addFavoriteProduct, deleteFavoriteProduct} = useFavorite()
    const uid = '931c0861-f018-4cf6-ac93-5a42a7659fa5';
    const [favorites, checkFavorite] = useFavoriteStore(({favoriteProducts, isFavorite})=> [favoriteProducts, isFavorite])
    // useEffect(() => {
    //     const fetchFavoriteStatus = async () => {
    //         try {
    //             const response = await favoriteApi.get(uid);
    //             const favoriteProducts = response.data._embedded.products;
    //             // const isFavorite = favoriteProducts.some((product:any) => product.id === productId);
    //             setFavorited(isFavorite);
    //         } catch (error) {
    //             console.log("Failed to fetch favorite status", error);
    //         }
    //     };
    
    //     fetchFavoriteStatus();
    // }, []);

    useEffect(()=>{
    if(!product || !product.id){
        setFavorited(false)
        return
    }
        console.log('isFavorited', isFavorited)
    setFavorited(checkFavorite(+product.id))
    
    }, [product, favorites])

    const onClick = () => {
        if(!product.id){
            console.error("Product Id is not found")
            return
        }
         startBouncing();
      
        setTimeout(() => {
            if(!product.id)return 
            if (isFavorited) {
            deleteFavoriteProduct(+product.id, ()=> {})
            
        }else{
            addFavoriteProduct(product)
        }
        stopBouncing();
        }, 500);
    };

    
    return (
        <div
            onClick={onClick}
            className={`absolute ${
                !isFavorited ? "opacity-0 group-hover:opacity-100" : ""
            } ${isBouncing ? "animate-pulse !duration-1000" : ""}
            ${"active:animate-ping"} top-1 right-2 group-hover:bg-white rounded-full p-1 duration-300 ease-in-out`}
        >
            <Heart
                className={`text-sm w-5 h-5 font-bold text-rose-500  ${
                    isFavorited ? "fill-current" : ""
                }`}
            />
        </div>
    );
};
