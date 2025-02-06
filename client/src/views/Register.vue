<template>
    <div
        class="relative w-full min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12"
    >
        <!-- Background Gradient -->
        <div
            class="absolute inset-0 bg-gradient-to-br from-green-400 to-teal-600 opacity-90"
        ></div>

        <!-- Register Card with Animation -->
        <transition name="fade" appear>
            <div
                class="relative z-10 w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden"
            >
                <!-- Left Side - Hero Section -->
                <div
                    class="hidden md:flex flex-col justify-center items-center w-1/2 p-10 bg-gradient-to-br from-green-500 to-teal-500 text-white"
                >
                    <h1 class="text-3xl font-bold leading-tight text-center">
                        Join Task Management App Now!
                    </h1>
                    <p class="mt-3 text-center text-gray-200">
                        Create an account and start managing your tasks
                        efficiently.
                    </p>
                    <router-link
                        to="/login"
                        class="mt-6 bg-white text-green-600 font-medium py-2 px-6 rounded-lg hover:bg-gray-100 transition"
                    >
                        Already have an account? Login
                    </router-link>
                </div>

                <!-- Right Side - Register Form -->
                <div class="w-full md:w-1/2 p-8">
                    <h2
                        class="text-2xl font-semibold text-gray-800 text-center"
                    >
                        Create Your Account
                    </h2>
                    <form @submit.prevent="handleRegister" class="mt-6">
                        <div class="mb-4">
                            <label
                                for="name"
                                class="block text-gray-700 font-medium"
                            >
                                Name
                            </label>
                            <input
                                v-model="form.name"
                                type="text"
                                id="name"
                                class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                                required
                            />
                        </div>
                        <div class="mb-4">
                            <label
                                for="email"
                                class="block text-gray-700 font-medium"
                            >
                                Email
                            </label>
                            <input
                                v-model="form.email"
                                type="email"
                                id="email"
                                class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                                required
                            />
                        </div>
                        <div class="mb-4">
                            <label
                                for="password"
                                class="block text-gray-700 font-medium"
                            >
                                Password
                            </label>
                            <input
                                v-model="form.password"
                                type="password"
                                id="password"
                                class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            class="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            Register
                        </button>
                    </form>

                    <!-- Success Message -->
                    <p
                        v-if="successMessage"
                        class="mt-4 text-center text-green-500"
                    >
                        {{ successMessage }}
                    </p>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "@/stores/authStore";

const form = reactive({
    name: "",
    email: "",
    password: "",
});

const successMessage = ref(""); // Untuk menampilkan pesan sukses
const authStore = useAuthStore();

const handleRegister = async () => {
    try {
        await authStore.register(form);
        successMessage.value = "Registrasi berhasil! Silakan login.";
        form.name = "";
        form.email = "";
        form.password = "";
    } catch (error) {
        successMessage.value = ""; // Hapus pesan sukses jika ada error
        alert(error.message); // Tampilkan pesan error dari backend
    }
};
</script>

<style>
/* Fade-in animation */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.6s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
