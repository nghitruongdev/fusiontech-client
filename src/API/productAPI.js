import axiosClient from "./axiosClient";

const productApi = {

  searchByKeyword: (keyword) => {
    const url = `http://localhost:8080/api/products/search/byKeyWord?keyword=${keyword}`;
    return axiosClient.get(url);
  },
  searchByCategoryId: (cid) => {
    const url = `http://localhost:8080/api/products/search/byCategoryId?cid=${cid}`;
    return axiosClient.get(url);
  },
  
};

export default productApi;