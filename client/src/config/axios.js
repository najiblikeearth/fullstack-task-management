import axios from "axios";

export const apiClient = axios.create({
    baseURL: "https://task-management-production-njb.up.railway.app/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

// Tambahkan interceptor untuk menyisipkan token di setiap request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
