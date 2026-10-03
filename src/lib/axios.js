import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    } else {
        config.headers["Content-Type"] = "application/json";
    }

    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong";

        return Promise.reject({
            ...error,
            message,
        });
    }
);

export default axiosInstance;