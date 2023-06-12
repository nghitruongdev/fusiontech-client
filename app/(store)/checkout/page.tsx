import OrderOverview from "./(side bar)/OrderOverviewNew";
import CheckoutForm from "./form";

const CheckoutPage = () => {
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
