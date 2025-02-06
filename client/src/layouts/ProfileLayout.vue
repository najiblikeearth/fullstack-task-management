<template>
    <div
        class="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr_auto] min-h-screen"
    >
        <!-- Sidebar
        <Sidebar
            class="col-start-1 row-span-3 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        /> -->

        <!-- Navbar -->
        <nav
            class="col-start-2 row-start-1 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        >
            <Navbar />
        </nav>

        <!-- Konten Utama -->
        <main class="col-start-2 row-start-2 p-6 bg-gray-100">
            <router-view />
        </main>

        <!-- Footer
        <AdminFooter
            class="col-start-2 row-start-3 bg-gray-200 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700"
        /> -->
    </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
</script>
