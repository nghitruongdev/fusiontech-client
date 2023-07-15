import { API_URL } from "types/constants";
import axios, {
    AxiosInterceptorManager,
    AxiosRequestConfig,
    AxiosResponse,
} from "axios";
import useSWR from "swr";

type OptionProps = {
    transform?: (data: any) => any;
    responseInterceptor?: (
        resposne: AxiosResponse<any>,
    ) => AxiosResponse | Promise<AxiosResponse>;
};

const axiosInstance = axios.create({
    baseURL: API_URL,
});

export const getFetcher = ({
    options: { transform, responseInterceptor } = {},
    config: requestConfig = {},
}: {
    options?: OptionProps;
    config?: AxiosRequestConfig;
} = {}) => {
    return async (url: string) => {
        // const timeout = await new Promise((res) => setTimeout(res, 500))
        console.debug("axios fetch", url, API_URL);
        const res = await axiosInstance.get(url);

        return transform ? transform(res.data) : res.data;
    };
};

const useFetcher = (url: string, fetcher: any) => {
    const { data, isLoading, error } = useSWR(url, fetcher);
    return {
        axios: axiosInstance,
        fetcher,
        data,
        isLoading,
        error,
    };
};

export default useFetcher;
