<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">My Tasks Management</h1>
        <div class="overflow-x-auto">
            <table
                v-if="taskAssignmentStore.tasks.length > 0"
                class="w-full text-sm text-left text-gray-500"
            >
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" class="px-6 py-3">No.</th>
                        <th scope="col" class="px-6 py-3">Title</th>
                        <th scope="col" class="px-6 py-3">Description</th>
                        <th scope="col" class="px-6 py-3">Status</th>
                        <th scope="col" class="px-6 py-3">Due Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(task, index) in paginatedTasks"
                        :key="task.id"
                        class="bg-white border-b"
                    >
                        <td
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                            {{ (currentPage - 1) * tasksPerPage + index + 1 }}
                        </td>
                        <td
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                            {{ task.task.title }}
                        </td>
                        <td class="px-6 py-4">{{ task.task.description }}</td>
                        <td class="px-6 py-4">
                            <span
                                :class="{
                                    'bg-yellow-100 text-yellow-800':
                                        task.task.status === 'pending',
                                    'bg-blue-100 text-blue-800':
                                        task.task.status === 'in progress',
                                    'bg-green-100 text-green-800':
                                        task.task.status === 'completed',
                                }"
                                class="text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm"
                            >
                                {{ task.task.status }}
                            </span>
                        </td>
                        <td class="px-6 py-4">{{ task.task.due_date }}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination Controls -->
            <div v-if="totalPages > 1" class="flex justify-end mt-4">
                <nav aria-label="Page navigation">
                    <ul class="inline-flex -space-x-px text-sm">
                        <li>
                            <button
                                @click="prevPage"
                                :disabled="currentPage === 1"
                                class="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                        </li>
                        <li v-for="page in totalPages" :key="page">
                            <button
                                @click="changePage(page)"
                                :class="{
                                    'bg-blue-500 text-white':
                                        currentPage === page,
                                    'text-gray-500 bg-white border border-gray-300':
                                        currentPage !== page,
                                }"
                                class="px-3 py-2 leading-tight border hover:bg-gray-100 hover:text-gray-700"
                            >
                                {{ page }}
                            </button>
                        </li>
                        <li>
                            <button
                                @click="nextPage"
                                :disabled="currentPage === totalPages"
                                class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            <div v-else class="text-gray-600 text-center mt-4">Data Kosong</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useTaskAssignmentStore } from "@/stores/TaskAssignmentStore";
import { useAuthStore } from "@/stores/authStore";

const taskAssignmentStore = useTaskAssignmentStore();
const authStore = useAuthStore();
const myTasks = ref([]);

// **State untuk pagination**
const currentPage = ref(1);
const tasksPerPage = 5;

// **Hitung total halaman**
const totalPages = computed(() =>
    Math.ceil(taskAssignmentStore.tasks.length / tasksPerPage)
);

// **Ambil data sesuai halaman**
const paginatedTasks = computed(() => {
    const start = (currentPage.value - 1) * tasksPerPage;
    const end = start + tasksPerPage;
    return taskAssignmentStore.tasks.slice(start, end);
});

// Fungsi untuk berpindah halaman
const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

onMounted(async () => {
    taskAssignmentStore.fetchAssignedTasks();
    myTasks.value = taskAssignmentStore.tasks.filter(
        (task) => task.assigned_to === authStore.user.id
    );
});
</script>
