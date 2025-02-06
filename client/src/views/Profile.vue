<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Profile</h1>

        <!-- Toast Notification -->
        <Transition name="toast">
            <div
                v-if="showToast"
                class="fixed bottom-5 right-5 flex items-center w-full max-w-sm p-4 mb-4 text-green-900 bg-green-100 border border-green-300 rounded-lg shadow-lg dark:bg-green-900 dark:text-green-100"
                role="alert"
            >
                <div
                    class="inline-flex items-center justify-center w-8 h-8 text-white bg-green-500 rounded-lg"
                >
                    <svg
                        class="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
                        />
                    </svg>
                </div>
                <div class="ml-3 text-sm font-medium">{{ toastMessage }}</div>
                <button
                    @click="showToast = false"
                    type="button"
                    class="ml-auto -mx-1.5 -my-1.5 bg-transparent text-green-500 hover:text-green-700 rounded-lg focus:ring-2 focus:ring-green-300 p-1.5"
                    aria-label="Close"
                >
                    <svg
                        class="w-3 h-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                    </svg>
                </button>
            </div>
        </Transition>

        <form @submit.prevent="updateProfile">
            <div class="mb-4">
                <label
                    class="block text-gray-700 text-sm font-bold mb-2"
                    for="address"
                >
                    Address
                </label>
                <input
                    v-model="form.address"
                    type="text"
                    id="address"
                    class="w-full px-3 py-2 border rounded-lg"
                    required
                />
            </div>
            <div class="mb-4">
                <label
                    class="block text-gray-700 text-sm font-bold mb-2"
                    for="phone_number"
                >
                    Phone Number
                </label>
                <input
                    v-model="form.phone_number"
                    type="text"
                    id="phone_number"
                    class="w-full px-3 py-2 border rounded-lg"
                    required
                />
            </div>
            <div class="mb-4">
                <label
                    class="block text-gray-700 text-sm font-bold mb-2"
                    for="birthdate"
                >
                    Birthdate
                </label>
                <input
                    v-model="form.birthdate"
                    type="date"
                    id="birthdate"
                    class="w-full px-3 py-2 border rounded-lg"
                    required
                />
            </div>
            <div class="flex justify-end">
                <button
                    type="button"
                    @click="goBack"
                    class="text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                    Back
                </button>
                <button
                    type="submit"
                    class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                    {{ authStore.user ? "Update Profile" : "Create Profile" }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { reactive, watchEffect, ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import { apiClient } from "@/config/axios";

const authStore = useAuthStore();
const router = useRouter();
const toastMessage = ref("");
const showToast = ref(false);

const form = reactive({
    address: "",
    phone_number: "",
    birthdate: "",
});

// Ambil data user ketika halaman diakses
const fetchUserData = async () => {
    try {
        await authStore.fetchUserProfile();
        console.log("Fetched user:", authStore.user); // Debugging
    } catch (error) {
        console.error("Gagal mengambil data profil:", error);
    }
};

// Pastikan form terisi otomatis ketika user sudah ada
watchEffect(() => {
    if (authStore.user?.data?.profile) {
        form.address = authStore.user.data.profile.address || "";
        form.phone_number = authStore.user.data.profile.phone_number || "";
        form.birthdate = authStore.user.data.profile.birthdate || "";
    }
});

// Panggil fungsi fetchUserData saat halaman dimuat
fetchUserData();

// Fungsi untuk menampilkan toast
const showSuccessToast = (message) => {
    toastMessage.value = message;
    showToast.value = true;

    setTimeout(() => {
        showToast.value = false; // Sembunyikan toast setelah 3 detik
    }, 5000);
};

const updateProfile = async () => {
    try {
        const response = await apiClient.post("/profile", form);
        console.log(response);
        await authStore.fetchUserProfile(); // Refresh profil setelah diupdate
        showSuccessToast(response.data.message || "Task deleted successfully");
    } catch (error) {
        console.error("Gagal menyimpan profil:", error);
    }
};

const goBack = () => {
    router.back();
};
</script>
