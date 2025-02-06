<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Assigned Task Management</h1>

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
                        <th scope="col" class="px-6 py-3">Actions</th>
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
                            {{ task.task.id }} | {{ task.task.title }}
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
                                class="text-sm font-medium px-2.5 py-0.5 rounded-sm"
                            >
                                {{ task.task.status }}
                            </span>
                        </td>
                        <td class="px-6 py-4">{{ task.task.due_date }}</td>
                        <td class="px-6 py-4">
                            <button
                                @click="openEditModal(task)"
                                class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2"
                            >
                                Edit Status
                            </button>
                        </td>
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

        <!-- Modal untuk Edit Status Task -->
        <div
            id="editTaskModal"
            tabindex="-1"
            aria-hidden="true"
            class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
            <div class="relative w-full max-w-md max-h-full">
                <div class="relative bg-white rounded-lg shadow">
                    <div
                        class="flex items-start justify-between p-4 border-b rounded-t"
                    >
                        <h3 class="text-xl font-semibold text-gray-900">
                            Update Task Status
                        </h3>
                        <button
                            type="button"
                            @click="closeEditModal"
                            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                        >
                            <svg
                                class="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    <div class="p-6 space-y-6">
                        <form @submit.prevent="updateStatus">
                            <div class="mb-4">
                                <label
                                    class="block text-gray-700 text-sm font-bold mb-2"
                                    for="status"
                                >
                                    Status
                                </label>
                                <select
                                    v-model="editTaskData.status"
                                    id="status"
                                    class="w-full px-3 py-2 border rounded-lg"
                                    required
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in progress">
                                        In Progress
                                    </option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div class="flex justify-end">
                                <button
                                    type="button"
                                    @click="closeEditModal"
                                    class="text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                >
                                    Update Status
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted, ref, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useTaskAssignmentStore } from "@/stores/TaskAssignmentStore";
import { useTaskStore } from "@/stores/taskStore";
import { Modal } from "flowbite";
import apiClient from "@/config/axios";

const authStore = useAuthStore();
const taskStore = useTaskStore();
const taskAssignmentStore = useTaskAssignmentStore();
const users = ref([]);
const myAssignedTask = ref([]);
const toastMessage = ref("");
const showToast = ref(false);

const editTaskData = reactive({
    id: null,
    status: "",
});

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

// Fungsi untuk berpindah ke halaman sebelumnya / berikutnya
const prevPage = () => changePage(currentPage.value - 1);
const nextPage = () => changePage(currentPage.value + 1);

// Fetch Users
const fetchUsers = async () => {
    try {
        const response = await apiClient.get("/users");
        users.value = response.data.data; // Pastikan respons API sesuai
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};

let editTaskModal;

onMounted(() => {
    editTaskModal = new Modal(document.getElementById("editTaskModal"));

    taskAssignmentStore.fetchMyAssignedTasks();
    myAssignedTask.value = taskAssignmentStore.tasks.filter(
        (task) => task.assigned_to === authStore.user.id
    );
    fetchUsers();
});

const openEditModal = (task) => {
    editTaskData.id = task.task.id;
    editTaskData.status = task.task.status;
    editTaskModal.show();
};

const closeEditModal = () => {
    editTaskModal.hide();
};

// Fungsi untuk menampilkan toast
const showSuccessToast = (message) => {
    toastMessage.value = message;
    showToast.value = true;

    setTimeout(() => {
        showToast.value = false; // Sembunyikan toast setelah 3 detik
    }, 5000);
};

const updateStatus = async () => {
    try {
        const response = await taskAssignmentStore.updateTaskStatus(
            editTaskData.id,
            editTaskData.status
        );
        console.log(response);
        showSuccessToast(
            response.message || "Task Status updated successfully"
        );
        editTaskModal.hide();
    } catch (error) {
        console.error("Error updating task status:", error);
    }
};
</script>
