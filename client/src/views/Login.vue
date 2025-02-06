<template>
    <div
        class="relative w-full min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12"
    >
        <!-- Background Gradient -->
        <div
            class="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 opacity-90"
        ></div>

        <!-- Toast Notification Tanpa Transition -->
        <div
            v-show="showToast"
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
                class="ml-auto bg-transparent text-green-500 hover:text-green-700 rounded-lg p-1.5"
            >
                ✖
            </button>
        </div>

        <!-- Login Card with Animation -->
        <transition name="fade" appear>
            <div
                class="relative z-10 w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden"
            >
                <!-- Left Side - Hero Section -->
                <div
                    class="hidden md:flex flex-col justify-center items-center w-1/2 p-10 bg-gradient-to-br from-blue-500 to-indigo-500 text-white"
                >
                    <h1 class="text-3xl font-bold leading-tight text-center">
                        Welcome to Task Management App
                    </h1>
                    <p class="mt-3 text-center text-gray-200">
                        Manage your tasks efficiently with our intuitive
                        dashboard
                    </p>
                    <router-link
                        to="/register"
                        class="mt-6 bg-white text-blue-600 font-medium py-2 px-6 rounded-lg hover:bg-gray-100 transition"
                    >
                        Get Started
                    </router-link>
                </div>

                <!-- Right Side - Login Form -->
                <div class="w-full md:w-1/2 p-8">
                    <h2
                        class="text-2xl font-semibold text-gray-800 text-center"
                    >
                        Login to Your Account
                    </h2>
                    <form @submit.prevent="handleLogin" class="mt-6">
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
                                class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                                class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { reactive, ref, computed, nextTick } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const form = reactive({
    email: "",
    password: "",
});

const authStore = useAuthStore();
const router = useRouter();

const toastMessage = ref("");
const showToast = ref(false);

const showSuccessToast = (message) => {
    toastMessage.value = message;
    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, 5000);
};

const handleLogin = async () => {
    try {
        const response = await authStore.login(form);
        showSuccessToast(response.message || "Login Success");
        router.push("/tasks");
    } catch (error) {
        showSuccessToast(error.message || "Login Failed");
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
