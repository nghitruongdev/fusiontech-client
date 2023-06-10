import { PlusCircleIcon, PlusIcon } from "@heroicons/react/20/solid";
import { AddressModalList } from "./modal";
import { Plus, PlusSquare } from "lucide-react";
import { EmptyAddressBox } from "./AddressBox";

const AddressSection = () => {
    return (
        <div className="justify-around grid grid-cols-2 gap-4 min-h-[100px]">
            <AddressModalList />
            <EmptyAddressBox />
        </div>
    );
};
export default AddressSection;
