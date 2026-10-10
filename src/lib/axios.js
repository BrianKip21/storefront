
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
    withCredentials: true,
});

// Configure request headers.
axiosInstance.interceptors.request.use(
    (config) => {
        if (config.data instanceof FormData) {
            // Let the browser set the multipart boundary.
            delete config.headers["Content-Type"];
        } else if (config.data !== undefined) {
            config.headers["Content-Type"] = "application/json";
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Handle API errors consistently.
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