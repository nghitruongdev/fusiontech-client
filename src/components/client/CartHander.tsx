// import React, { useState, useEffect } from "react";
// import {
//     onSnapshot,
//     collection,
//     addDoc,
//     deleteDoc,
//     query,
//     where,
//     getDocs,
// } from "firebase/firestore";
// import { firestore } from "@/firebase";
// import { GoPlus } from "react-icons/go";
// import { Product } from "@/interfaces";

// const useCart = () => {
//     const [cartItems, setCartItems] = useState<Product[]>([]); // Danh sách sản phẩm trong giỏ hàng
//     const [totalPrice, setTotalPrice] = useState<number>(0); // Tổng tiền trong giỏ hàng
//     const [totalQuantity, setTotalQuantity] = useState<number>(0); // Tổng số lượng sản phẩm trong giỏ hàng

//     useEffect(() => {
//         // Load danh sách sản phẩm trong giỏ hàng và tính tổng tiền
//         loadCartItems();
//     }, []);

//     const loadCartItems = () => {
//         // Lắng nghe sự thay đổi trong collection "cart" và cập nhật danh sách sản phẩm trong giỏ hàng
//         const unsubscribe = onSnapshot(
//             collection(firestore, "cart"),
//             (snapshot) => {
//                 const items: Product[] = [];
//                 let quantity = 0;
//                 let price = 0;

//                 snapshot.forEach((doc) => {
//                     const product = doc.data() as Product;
//                     items.push(product);
//                     quantity += 1;
//                     price += product.price;
//                 });

//                 setCartItems(items);
//                 setTotalQuantity(quantity);
//                 setTotalPrice(price);
//             },
//         );

//         return () => unsubscribe();
//     };

//     const addToCart = async (product: Product) => {
//         try {
//             const docRef = await addDoc(collection(firestore, "cart"), product);
//             console.log("Sản phẩm đã được thêm vào giỏ hàng", docRef.id);

//             setCartItems([...cartItems, product]);
//             setTotalQuantity(totalQuantity + 1);
//             setTotalPrice(totalPrice + product.price);
//         } catch (error) {
//             console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
//         }
//     };

//     const removeFromCart = async (product: Product) => {
//         try {
//             const cartQuery = query(
//                 collection(firestore, "cart"),
//                 where("_id", "==", product._id),
//             );
//             const cartSnapshot = await getDocs(cartQuery);

//             cartSnapshot.forEach(async (doc) => {
//                 await deleteDoc(doc.ref);
//                 console.log("Sản phẩm đã được xóa khỏi giỏ hàng");
//             });

//             const updatedCartItems = cartItems.filter(
//                 (item) => item._id !== product._id,
//             );
//             const updatedQuantity = totalQuantity - 1;
//             const updatedPrice = totalPrice - product.price;

//             setCartItems(updatedCartItems);
//             setTotalQuantity(updatedQuantity);
//             setTotalPrice(updatedPrice);
//         } catch (error) {
//             console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
//         }
//     };

//     const clearCart = async () => {
//         try {
//             const cartQuery = query(collection(firestore, "cart"));
//             const cartSnapshot = await getDocs(cartQuery);

//             cartSnapshot.forEach(async (doc) => {
//                 await deleteDoc(doc.ref);
//                 console.log("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
//             });

//             setCartItems([]);
//             setTotalQuantity(0);
//             setTotalPrice(0);
//         } catch (error) {
//             console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
//         }
//     };

//     const handleAddToCart = (product: Product) => {
//         addToCart(product);
//     };

//     const handleRemoveFromCart = (product: Product) => {
//         removeFromCart(product);
//     };

//     return {
//         cartItems,
//         totalPrice,
//         totalQuantity,
//         handleAddToCart,
//         handleRemoveFromCart,
//         loadCartItems,
//         clearCart,
//     };
// };

// export default useCart;

import React, { useState, useEffect } from "react";
import {
    onSnapshot,
    collection,
    addDoc,
    deleteDoc,
    query,
    where,
    getDocs,
    writeBatch,
    doc,
} from "firebase/firestore";
import { firestore } from "@/firebase";
import { GoPlus } from "react-icons/go";
import { Product } from "@/interfaces";

const useCart = (uid: string | null) => {
    // Thêm tham số userId vào hàm useCart để xác định người dùng hiện tại.
    const [cartItems, setCartItems] = useState<Product[]>([]); // Danh sách sản phẩm trong giỏ hàng
    const [totalPrice, setTotalPrice] = useState<number>(0); // Tổng tiền trong giỏ hàng
    const [totalQuantity, setTotalQuantity] = useState<number>(0); // Tổng số lượng sản phẩm trong giỏ hàng

    useEffect(() => {
        loadCartItems();
    }, [uid]);

    const loadCartItems = async () => {
        try {
            if (!uid) {
                const storedCartItems = localStorage.getItem("cartItems");
                if (storedCartItems) {
                    const parsedItems = JSON.parse(storedCartItems);
                    setCartItems(parsedItems);
                    updateCartTotal(parsedItems);
                } else {
                    setCartItems([]);
                    updateCartTotal([]);
                }
                return;
            }

            const cartRef = collection(firestore, "users", uid, "cart");
            const unsubscribe = onSnapshot(cartRef, (snapshot) => {
                const items: Product[] = [];
                let quantity = 0;
                let price = 0;

                snapshot.forEach((doc) => {
                    const product = doc.data() as Product;
                    items.push(product);
                    quantity += 1;
                    price += product.price;
                });

                setCartItems(items);
                setTotalQuantity(quantity);
                setTotalPrice(price);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm trong giỏ hàng:", error);
        }
    };

    const saveCartItemsToLocalStorage = (items: Product[]) => {
        localStorage.setItem("cartItems", JSON.stringify(items));
    };

    const addToCart = async (product: Product) => {
        try {
            if (!uid) {
                const storedCartItems = localStorage.getItem("cartItems");
                if (storedCartItems) {
                    const parsedItems = JSON.parse(storedCartItems);
                    const updatedItems = [...parsedItems, product];
                    setCartItems(updatedItems);
                    updateCartTotal(updatedItems);
                    saveCartItemsToLocalStorage(updatedItems);
                } else {
                    const updatedItems = [product];
                    setCartItems(updatedItems);
                    updateCartTotal(updatedItems);
                    saveCartItemsToLocalStorage(updatedItems);
                }
                return;
            }

            const cartRef = collection(firestore, "users", uid, "cart");
            const batch = writeBatch(firestore);
            const itemDocRef = doc(cartRef);

            batch.set(itemDocRef, product);

            await batch.commit();
            console.log("Sản phẩm đã được thêm vào giỏ hàng");

            setCartItems([...cartItems, product]);
            setTotalQuantity(totalQuantity + 1);
            setTotalPrice(totalPrice + product.price);
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
        }
    };

    const removeFromCart = async (product: Product) => {
        try {
            if (!uid) {
                const storedCartItems = localStorage.getItem("cartItems");
                if (storedCartItems) {
                    const parsedItems = JSON.parse(storedCartItems);
                    const updatedItems = parsedItems.filter(
                        (item: Product) => item._id !== product._id,
                    );
                    setCartItems(updatedItems);
                    updateCartTotal(updatedItems);
                    saveCartItemsToLocalStorage(updatedItems);
                }
                return;
            }

            const cartRef = collection(firestore, "users", uid, "cart");
            const cartQuery = query(cartRef, where("_id", "==", product._id));
            const cartSnapshot = await getDocs(cartQuery);

            const batch = writeBatch(firestore);
            cartSnapshot.forEach((doc) => {
                batch.delete(doc.ref);
                console.log("Sản phẩm đã được xóa khỏi giỏ hàng");
            });
            await batch.commit();

            const updatedCartItems = cartItems.filter(
                (item) => item._id !== product._id,
            );
            setCartItems(updatedCartItems);
            updateCartTotal(updatedCartItems);
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
        }
    };

    const clearCart = async () => {
        try {
            if (!uid) {
                setCartItems([]);
                setTotalQuantity(0);
                setTotalPrice(0);
                localStorage.removeItem("cartItems");
                return;
            }

            const cartRef = collection(firestore, "users", uid, "cart");
            const cartSnapshot = await getDocs(cartRef);

            const batch = writeBatch(firestore);
            cartSnapshot.forEach((doc) => {
                batch.delete(doc.ref);
                console.log("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
            });
            await batch.commit();

            setCartItems([]);
            setTotalQuantity(0);
            setTotalPrice(0);
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
        }
    };

    const updateCartTotal = (items: Product[]) => {
        let quantity = 0;
        let price = 0;

        items.forEach((item) => {
            quantity += 1;
            price += item.price;
        });

        setTotalQuantity(quantity);
        setTotalPrice(price);
    };

    const handleAddToCart = (product: Product) => {
        addToCart(product);
    };

    const handleRemoveFromCart = (product: Product) => {
        removeFromCart(product);
    };

    return {
        cartItems,
        totalPrice,
        totalQuantity,
        handleAddToCart,
        handleRemoveFromCart,
        loadCartItems,
        clearCart,
    };
};

export default useCart;
