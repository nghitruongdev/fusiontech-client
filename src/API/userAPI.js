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
};

export default userApi;
