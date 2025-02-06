import { defineStore } from "pinia";
import { reactive } from "vue";
import { apiClient } from "@/config/axios";

export const useAuthStore = defineStore("auth", () => {
    const user = reactive({ data: null });
    const token = localStorage.getItem("token") || null;

    const fetchUserProfile = async () => {
        try {
            const response = await apiClient.get("/profile");

            user.data = response.data.user; // Simpan hanya objek user
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            user.data = null;
        }
    };

    const register = async (credentials) => {
        try {
            const { email, name, password } = credentials;

            const { data } = await apiClient.post("/auth/register", {
                email,
                name,
                password,
            });

            console.log(data);
        } catch (error) {
            console.error(error.message);
        }
    };

    const login = async (credentials) => {
        try {
            const { email, password } = credentials;

            const { data } = await apiClient.post("/auth/login", {
                email,
                password,
            });
            console.log(data);

            // Simpan token ke localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Simpan user ke Pinia
            user.data = data.user;

            await fetchUserProfile(); // Ambil profil setelah login
            return data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Login failed");
        }
    };

    const logout = async () => {
        try {
            await apiClient.post("/auth/logout");
            user.data = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        } catch (error) {
            throw error;
        }
    };

    return { user, token, fetchUserProfile, register, login, logout };
});
