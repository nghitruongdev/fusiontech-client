import Form from "./Form";
const CheckoutPage = () => {
    return (
        <>
            <div className="mx-auto flex min-h-[500px]">
                <div className="w-2/3 p-4">
                    <Form />
                </div>
                <div className="w-1/3 bg-lightBlue mx-4 rounded-2xl">
                    {/*====================Cart Sumamry====================*/}
                    <p className="">Order Summary</p>
                    <div className="">
                        <div>Image product</div>
                        <p>Product title</p>
                        <p>Price</p>
                        <p>Quantity</p>
                    </div>

                    {/*====================Order Sumamry====================*/}
                    <p>Divider</p>
                    <Discount />
                    <p>Subtotal</p>
                    <p>Shipping</p>
                    <p className="">Taxes</p>
                    <p>Discount</p>

                    <p className="">Divider</p>
                    <p className="">Total Amount</p>
                    <button>Dat hang</button>
                </div>
            </div>
        </>
    );
};

const Discount = () => {
    return (
        <>
            <p className="">Coupon Code</p>
            <p className="">Enter code to get a discount instantly</p>
            <input type="text" placeholder="Enter discount code or select" />
            <button>Apply</button>
        </>
    );
};

export default CheckoutPage;
