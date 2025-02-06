// // src/config/axios.js
// import axios from "axios";

// export const apiClient = axios.create({
//     baseURL: "http://localhost:8000/api/v1",
//     headers: {
//         Accept: "application/json",
//         "X-Requested-With": "XMLHttpRequest",
//     },
// });

// // Tambahkan interceptor untuk menambahkan token ke header
// apiClient.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export default apiClient;

import axios from "axios";

export const apiClient = axios.create({
    baseURL: "http://localhost:8000/api/v1",
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
