<template>
    <aside
        class="h-full pt-20 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 w-40 md:w-40"
    >
        <!-- Menu -->
        <nav class="px-4 py-6 space-y-4">
            <ul class="space-y-2 font-semibold">
                <!-- Sidebar -->
                <!-- Dashboard -->
                <li>
                    <router-link
                        to="/dashboard"
                        class="flex items-center p-2 rounded-lg text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
                        <font-awesome-icon :icon="['fas', 'border-all']" />
                        <span class="ml-3">Dashboard</span>
                    </router-link>
                </li>

                <!-- Task -->
                <li>
                    <router-link
                        to="/tasks"
                        class="flex items-center p-2 rounded-lg text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
                        <font-awesome-icon :icon="['fas', 'user-cog']" />
                        <span class="ml-3">Tasks</span>
                    </router-link>
                </li>

                <!-- Assigned Task -->
                <li>
                    <router-link
                        to="/assigned-tasks"
                        class="flex items-center p-2 rounded-lg text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
                        <font-awesome-icon :icon="['fas', 'user-cog']" />
                        <span class="ml-3">Assigned Tasks</span>
                    </router-link>
                </li>

                <!-- My Task -->
                <li>
                    <router-link
                        to="/my-tasks"
                        class="flex items-center p-2 rounded-lg text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
                        <font-awesome-icon :icon="['fas', 'bookmark']" />
                        <span class="ml-3">My Tasks</span>
                    </router-link>
                </li>
            </ul>
        </nav>
    </aside>
</template>

<script setup>
import { onMounted } from "vue";
import { initFlowbite } from "flowbite";

// Import FontAwesomeIcon component and icons
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faBorderAll,
    faUserCog,
    faBookmark,
} from "@fortawesome/free-solid-svg-icons";

// Add icons to the library
library.add(faBorderAll, faUserCog, faBookmark);

onMounted(() => {
    initFlowbite(); // Inisialisasi komponen Flowbite
});
</script>
