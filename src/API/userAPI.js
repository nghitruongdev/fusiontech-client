import axiosClient from "./axiosClient";

const userApi = {
    checkExistsByEmail: (email) => {
        const url = `http://localhost:8080/api/users/search/existsByEmail?email=${email}`;
        return axiosClient.get(url);
    },

    checkExistsByPhone: (phone) => {
        const url = `http://localhost:8080/api/users/search/existsByPhoneNumber?phone=${phone}`;
        return axiosClient.get(url);
    },
    updateUser: (id, userData) => {
        const url =`http://localhost:8080/api/users/updateUser/${id}`;
        return axiosClient.put(url,userData);
    },
    createShippingAddress:(uid,shippingAdressData) => {
        const url = `http://localhost:8080/api/shippingAddresses/create/${uid}`;
        return axiosClient.post(url,shippingAdressData);
    },
};

export default userApi;
