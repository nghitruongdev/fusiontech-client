import { useAuthUser } from "@/hooks/useAuth/useAuthUser";
import { useCustom, useUpdate } from "@refinedev/core";
import { API } from "types";
import { API_URL } from "types/constants";

export const ProfileForm = () => {
    const { user } = useAuthUser();
    const { resource, findByFirebaseId } = API["users"]();
    const { data, status } = useCustom({
        url: `${API_URL}/${findByFirebaseId(user?.uid ?? "")}`,
        method: "get",
        queryOptions: {
            enabled: !!user,
        },
    });
    return (
        <>
            <h2 className="text-xl font-semibold">Thông tin tài khoản</h2>
            <form className="mt-2">
                <div className="mb-4">
                    <label htmlFor="fullName" className="block mb-1 text-sm ">
                        Họ và tên:
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1 text-sm ">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block mb-1 text-sm ">
                        Số điện thoại:
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="birthdate" className="block mb-1 text-sm ">
                        Ngày sinh:
                    </label>
                    <input
                        type="date"
                        id="birthdate"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="gender" className="block mb-1 text-sm ">
                        Giới tính:
                    </label>
                    <select
                        id="gender"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                    </select>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Cập nhật
                </button>
            </form>
        </>
    );
};
