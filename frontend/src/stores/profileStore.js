// src/stores/profileStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "@/config/axios";

export const useProfileStore = defineStore("profile", () => {
    const profile = ref(null);

    const fetchProfile = async () => {
        try {
            const response = await apiClient.get("/profile");
            profile.value = response.data;
        } catch (error) {
            throw error;
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await apiClient.post("/profile", profileData);
            profile.value = response.data;
            return response;
        } catch (error) {
            throw error;
        }
    };

    return {
        profile,
        fetchProfile,
        updateProfile,
    };
});
