import axiosClient from "./axiosClient";

const reviewApi = {
    //   getAll: (params) => {
    //     const url = 'https://localhost/todos';
    //     return axiosClient.get(url, { params });
    //   },

    get: (id) => {
        const url = `http://localhost:8080/api/reviews/search/findAllReviewsByProductId?pid=${id}`;
        return axiosClient.get(url);
    },

    create: (reviewData) => {
        const url = "http://localhost:8080/api/reviews";
        return axiosClient.post(url, reviewData);
    },
};

export default reviewApi;
