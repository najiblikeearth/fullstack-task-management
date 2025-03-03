<template>
    <div class="relative min-h-screen flex flex-col">
        <nav
            class="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        >
            <Navbar />
        </nav>

        <Sidebar
            class="fixed left-0 h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        />

        <main class="ml-56 mt-16 p-4 bg-gray-100 md:ml-40 flex-grow">
            <router-view />
        </main>

        <footer
            class="p-4 bg-white shadow md:flex md:items-center md:justify-center md:p-6 dark:bg-gray-800 ml-56 md:ml-56"
        >
            <span
                class="text-sm text-gray-500 sm:text-center dark:text-gray-400"
            >
                © 2023
                <a
                    href="https://linkedin.com/in/najibdz"
                    class="hover:underline"
                >
                    Just Najib
                </a>
                . All Rights Reserved.
            </span>
        </footer>
    </div>
</template>

<script setup>
import Sidebar from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";
</script>
