import UserOptions from "./(form)/userOption";
import OrderManagement from "./(form)/OrderForm";

const UserOptionsPage = () => {

    return (
        <div className="bg-gray-100">
            <div className="min-h-screen flex w-4/5 mx-auto max-w-7xl">
            <div className=" w-1/4 p-4 ">
                <UserOptions/>
            </div>
            <div className="w-3/4  p-4 ">
                <OrderManagement/>
            </div>
            </div>
        </div>
        
    );
};
export default UserOptionsPage;
