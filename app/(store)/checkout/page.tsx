import OrderOverview from "./(side bar)/OrderOverview";
import CheckoutForm from "./form";

const CheckoutPage = () => {
    return (
        <div className="min-h-[100vh] flex bg-gray-50">
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
