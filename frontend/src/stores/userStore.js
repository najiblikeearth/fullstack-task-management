import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "axios";

export const useUserStore = defineStore("userStore", () => {
    const users = ref([]);
});
