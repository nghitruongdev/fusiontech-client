import axiosClient from "./axiosClient";

const favoriteApi = {
    get: (uid) => {
        const url = `http://localhost:8080/api/products/search/favorites?uid=${uid}`;
        return axiosClient.get(url);
    },

    delete: (productId, uid) => {
        const url = `http://localhost:8080/api/products/${productId}/favorites?uid=${uid}`;
        return axiosClient.delete(url);
    },

    getProductId: (pid) => {
        const url = `http://localhost:8080/api/products/${pid}`;
        return axiosClient.get(url);
    },

    create: (productId, uid) => {
      const url = `http://localhost:8080/api/products/${productId}/favorites?uid=${uid}`;
      return axiosClient.post(url);
    },
};

export default favoriteApi;
