"use client";

import useAuthUser from "@/hooks/useAuthUser";
import {
    firebaseAuth,
    firestore,
    firestoreDB,
    firestoreProvider,
} from "@/lib/firebase";
import useCart from "@components/store/cart/useCartStore";
import dynamic, { noSSR } from "next/dynamic";
import { useEffect, useRef } from "react";
import useAuhUser from "@/hooks/useAuthUser";
import { useIsMounted } from "usehooks-ts";
import { ILogin, firebaseAuthProvider } from "@/providers/firebaseAuthProvider";
import { Button } from "@components/ui/shadcn/button";
import { Input } from "@components/ui/shadcn/input";
import { useCreate, useUpdate } from "@refinedev/core";
import { collection, onSnapshot, query } from "firebase/firestore";
import { FirestoreDatabase } from "@/providers/firestore-data-provider/FirestoreDatabase";

const page = () => {
    // const { addToCart } = useCart(null);
    // const { data, status } = useList({
    //     resource: "cart",
    //     dataProviderName: "firestore",
    // });
    // const { mutateAsync } = useCreate({});
    // const { mutate: update } = useUpdate();
    // const addItemToCart = () => {
    //     console.log("Adding new item to cart");
    // mutateAsync({
    //     values: {
    //         items: [
    //             {
    //                 id: "1",
    //                 variantId: "10",
    //                 quantity: 1,
    //             },
    //             {
    //                 id: "1",
    //                 variantId: "10",
    //                 quantity: 1,
    //             },
    //         ],
    //         uid: fakeUserId,
    //     },
    //     resource: "carts",
    //     dataProviderName: "firestore",
    // });
    // update({
    //     id: "QAGzfD7M20AP7RTD97MM",
    //     values: {
    //         items: arrayRemove({
    //             id: "",
    //             variantId: "",
    //             quantity: "",
    //         }),
    //     },
    //     resource: "carts",
    //     dataProviderName: "firestore",
    // });
    // };
    const { cart, status, addItem } = useCart();

    const user = useAuhUser((state) => state.user);
    const isMounted = useIsMounted();
    const variantRef = useRef<HTMLInputElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);
    const { mutate } = useUpdate();
    const add = () => {
        const value = {
            variantId: variantRef.current?.valueAsNumber || 0,
            quantity: quantityRef.current?.valueAsNumber || 0,
        };
        // addItem({
        //     variantId: variantRef.current?.valueAsNumber || 0,
        //     quantity: quantityRef.current?.valueAsNumber || 0,
        // });
        // firestoreProvider.create({
        //     resource: "carts/spirnjb3FTIFiAcypd8C/items",
        //     variables: {

        //     }
        // });
        mutate({
            resource: "carts/spirnjb3FTIFiAcypd8C/items",
            id: "8X8rmZXxDNgs3po028x5",
            dataProviderName: "firestore",
            values: { ...value },
        });
    };

    useEffect(() => {
        const q = query(
            collection(firestore, "carts", "spirnjb3FTIFiAcypd8", "items"),
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const cities = [] as any;
            querySnapshot.forEach((doc) => {
                cities.push(doc.data());
            });
            querySnapshot.docChanges().forEach((change) => {
                console.log("doc.data()", change.doc.data());
                console.log("change.type", change.type);
            });

            console.log("Current cities in CA: ", cities.join(", "));
        });
        // const unsub = onSnapshot(
        //     new FirestoreDatabase().getDocRef("carts", "spirnjb3FTIFiAcypd8C"),
        //     (snapshot) => {
        //         console.log("snapshot", snapshot);
        //     },
        // );
        return unsubscribe;
    }, []);
    return (
        <div>
            Test page: uid: {isMounted() ? user?.uid : ""}, data:{" "}
            {JSON.stringify(cart)}
            <div>
                <Input
                    type="number"
                    ref={variantRef}
                    placeholder="Variant id"
                />
                <Input type="number" ref={quantityRef} placeholder="Quantity" />
            </div>
            <Button className="" onClick={add}>
                Add
            </Button>
            <Button
                onClick={() => {
                    const props: ILogin = {
                        providerName: "credentials",
                        credentials: {
                            email: "nghitvps19009@fpt.edu.vn",
                            password: "123456",
                        },
                    };
                    firebaseAuthProvider().login(props);
                }}
            >
                Log user id
            </Button>
            <Button
                onClick={() => {
                    firebaseAuthProvider().logout({});
                }}
            >
                Log out
            </Button>
            <Button
                onClick={() => {
                    const userString = window.localStorage.getItem(
                        `firebase:authUser:${firebaseAuth.config.apiKey}:${firebaseAuth.name}`,
                    );
                    const user = JSON.parse(userString || "");
                    console.debug("user", user.stsTokenManager.accessToken);
                }}
            >
                Cart ID
            </Button>
        </div>
    );
};
export default page;
