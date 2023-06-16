import OrderOverview from "./(side bar)/OrderOverviewNew";
import CheckoutForm from "./(form)/index";
import { ShippingAddress } from "@/interfaces";
import { APP_API } from "@/constants";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

// const getShippingAddress = async (): Promise<ShippingAddress[]> => {
//     // const res = await fetch(`http://localhost:3000/api/products/${_id}`);
//     // The return value is *not* serialized
//     // You can return Date, Map, Set, etc.

//     // Recommendation: handle errors
//     const res = await fetch(`${APP_API.shippingAddress}`);
//     if (!res.ok) {
//         // This will activate the closest `error.js` Error Boundary
//         throw new Error("Failed to fetch data");
//     }

//     return res.json();
// };
const CheckoutPage = async () => {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/api/auth/signin?to=/cart/checkout");
    }
    // const addresses: ShippingAddress[] = await getShippingAddress();
    return (
        <div className="min-h-[500px] flex bg-gray-50 w-4/5 mx-auto max-w-7xl">
            <div className=" w-3/4 p-4">
                <CheckoutForm />
            </div>
            <div className="w-2/5  p-4">
                <OrderOverview />
            </div>
        </div>
    );
};
export default CheckoutPage;
