<template>
    <div>
        <nav
            class="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 border-gray-200 shadow-md"
        >
            <div
                class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
            >
                <a href="/dashboard" class="flex items-center">
                    <span
                        class="self-center text-2xl font-semibold text-white whitespace-nowrap"
                    >
                        Task Management Dashboard
                    </span>
                </a>
                <div class="flex items-center md:order-2">
                    <!-- Notifikasi -->
                    <div class="relative mr-6">
                        <button
                            @click="toggleDropdown"
                            class="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                            <BellIcon class="w-6 h-6 text-purple-500" />
                            <span
                                v-if="unreadCount > 0"
                                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2"
                            >
                                {{ unreadCount }}
                            </span>
                        </button>
                        <div
                            v-if="isOpen"
                            class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg"
                        >
                            <div v-if="notifications.length > 0" class="p-2">
                                <div
                                    v-for="notification in notifications"
                                    :key="notification.id"
                                    class="p-2 border-b hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                                    @click="markAsRead(notification.id)"
                                >
                                    <span class="text-sm">
                                        {{ notification.message }}
                                    </span>
                                    <span class="text-xs text-gray-500">
                                        {{
                                            formatDate(notification.created_at)
                                        }}
                                    </span>
                                </div>
                            </div>
                            <p v-else class="text-center text-gray-500 p-2">
                                Tidak ada notifikasi
                            </p>
                        </div>
                    </div>

                    <!-- User Profile -->
                    <button
                        type="button"
                        class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                        id="user-menu-button"
                        aria-expanded="false"
                        data-dropdown-toggle="user-dropdown"
                        data-dropdown-placement="bottom"
                    >
                        <span class="sr-only">Open user menu</span>
                        <img
                            class="w-8 h-8 rounded-full"
                            :src="user"
                            alt="user photo"
                        />
                    </button>
                    <!-- Dropdown menu -->
                    <div
                        class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow"
                        id="user-dropdown"
                    >
                        <div class="px-4 py-3">
                            <span class="block text-sm text-gray-900">
                                {{ authStore.user.data?.name }}
                            </span>
                        </div>
                        <ul class="py-2" aria-labelledby="user-menu-button">
                            <li>
                                <router-link
                                    to="/profile"
                                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Profile
                                </router-link>
                            </li>
                            <li>
                                <button
                                    @click="logout"
                                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import { Dropdown } from "flowbite";
import apiClient from "@/config/axios"; // Gunakan apiClient
import user from "@/assets/img/user.png";
import { BellIcon } from "@heroicons/vue/24/outline";

const authStore = useAuthStore();
const router = useRouter();

let dropdown;

// State untuk notifikasi
const isOpen = ref(false);
const notifications = ref([]);
const unreadCount = ref(0);

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

const fetchNotifications = async () => {
    try {
        const response = await apiClient.get("/notifications");
        notifications.value = response.data.notifications;
        unreadCount.value = notifications.value.length;
    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
};

const markAsRead = async (id) => {
    try {
        await apiClient.post(`/notifications/${id}/mark-as-read`);
        notifications.value = notifications.value.filter((n) => n.id !== id);
        unreadCount.value = notifications.value.length;
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

onMounted(async () => {
    await authStore.fetchUserProfile();
    fetchNotifications();

    const dropdownElement = document.getElementById("user-dropdown");
    const dropdownButton = document.getElementById("user-menu-button");

    if (dropdownElement && dropdownButton) {
        dropdown = new Dropdown(dropdownElement, dropdownButton);
    }
});

const logout = async () => {
    try {
        await authStore.logout();
        router.push("/login");
    } catch (error) {
        console.error("Failed to logout:", error);
    }
};
</script>
