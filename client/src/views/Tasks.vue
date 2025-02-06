<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Task Management</h1>
        <div class="mb-4">
            <button
                @click="openCreateModal"
                class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
                Create Task
            </button>
            <button
                @click="openAssignModal"
                class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
                Assign Task
            </button>
        </div>
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
                v-if="taskStore.tasks.length > 0"
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
                            {{ task.id }} | {{ task.title }}
                        </td>
                        <td class="px-6 py-4">{{ task.description }}</td>
                        <td class="px-6 py-4">
                            <span
                                :class="{
                                    'bg-yellow-100 text-yellow-800':
                                        task.status === 'pending',
                                    'bg-blue-100 text-blue-800':
                                        task.status === 'in progress',
                                    'bg-green-100 text-green-800':
                                        task.status === 'completed',
                                }"
                                class="text-sm font-medium px-2.5 py-0.5 rounded-sm"
                            >
                                {{ task.status }}
                            </span>
                        </td>
                        <td class="px-6 py-4">{{ task.due_date }}</td>
                        <td class="px-6 py-4">
                            <template
                                v-if="task.user_id === authStore.user.data?.id"
                            >
                                <button
                                    @click="openEditModal(task)"
                                    class="text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2"
                                >
                                    Edit
                                </button>
                                <button
                                    @click="openDeleteModal(task.id)"
                                    class="text-white bg-gradient-to-r from-red-500 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2"
                                >
                                    Delete
                                </button>
                            </template>
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

        <!-- Modal untuk Create Task -->
        <div
            id="createTaskModal"
            tabindex="-1"
            aria-hidden="true"
            class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
            <div class="relative w-full max-w-2xl max-h-full">
                <div class="relative bg-white rounded-lg shadow">
                    <div
                        class="flex items-start justify-between p-4 border-b rounded-t"
                    >
                        <h3 class="text-xl font-semibold text-gray-900">
                            Create Task
                        </h3>
                        <button
                            type="button"
                            @click="closeCreateModal"
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
                        <form @submit.prevent="createTask">
                            <div class="mb-4">
                                <label
                                    class="block text-gray-700 text-sm font-bold mb-2"
                                    for="title"
                                >
                                    Title
                                </label>
                                <input
                                    v-model="newTask.title"
                                    type="text"
                                    id="title"
                                    class="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div class="mb-4">
                                <label
                                    class="block text-gray-700 text-sm font-bold mb-2"
                                    for="description"
                                >
                                    Description
                                </label>
                                <textarea
                                    v-model="newTask.description"
                                    id="description"
                                    class="w-full px-3 py-2 border rounded-lg"
                                    required
                                ></textarea>
                            </div>
                            <div class="mb-4">
                                <label
                                    class="block text-gray-700 text-sm font-bold mb-2"
                                    for="due_date"
                                >
                                    Due Date
                                </label>
                                <input
                                    v-model="newTask.due_date"
                                    type="date"
                                    id="due_date"
                                    class="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div class="flex justify-end">
                                <button
                                    type="button"
                                    @click="closeCreateModal"
                                    class="text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    class="text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal untuk Edit Task -->
        <div
            id="editTaskModal"
            tabindex="-1"
            aria-hidden="true"
            class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
            <div class="relative w-full max-w-2xl max-h-full">
                <div class="relative bg-white rounded-lg shadow">
                    <div
                        class="flex items-start justify-between p-4 border-b rounded-t"
                    >
                        <h3 class="text-xl font-semibold text-gray-900">
                            Edit Task
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
                        <form @submit.prevent="updateTask">
                            <div class="mb-4">
                                <label
                                    class="block text-gray-700 text-sm font-bold mb-2"
                                    for="title"
                                >
                                    Title
                                </label>
                                <input
                                    v-model="editTaskData.title"
                                    type="text"
                                    id="title"
                                    class="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div class="mb-4">
                                <label
                                    class="block text-gray-700 text-sm font-bold mb-2"
                                    for="description"
                                >
                                    Description
                                </label>
                                <textarea
                                    v-model="editTaskData.description"
                                    id="description"
                                    class="w-full px-3 py-2 border rounded-lg"
                                    required
                                ></textarea>
                            </div>
                            <div class="mb-4">
                                <label
                                    class="block text-gray-700 text-sm font-bold mb-2"
                                    for="due_date"
                                >
                                    Due Date
                                </label>
                                <input
                                    v-model="editTaskData.due_date"
                                    type="date"
                                    id="due_date"
                                    class="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
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
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal untuk Assign Task -->
        <div
            id="assignTaskModal"
            tabindex="-1"
            aria-hidden="true"
            class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
            <div class="relative w-full max-w-2xl max-h-full">
                <div class="relative bg-white rounded-lg shadow">
                    <div
                        class="flex items-start justify-between p-4 border-b rounded-t"
                    >
                        <h3 class="text-xl font-semibold text-gray-900">
                            Assign Task
                        </h3>
                        <button
                            type="button"
                            @click="closeAssignModal"
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
                        <form @submit.prevent="assignTask">
                            <div class="mb-4">
                                <label
                                    class="block text-gray-700 text-sm font-bold mb-2"
                                    for="assignee"
                                >
                                    Task Title
                                </label>
                                <select
                                    v-model="assignTaskData.task_id"
                                    id="assignee"
                                    class="w-full px-3 py-2 border rounded-lg"
                                    required
                                >
                                    <option
                                        v-for="task in filteredTasks"
                                        :key="task.id"
                                        :value="task.id"
                                    >
                                        {{ task.id }} | {{ task.title }}
                                    </option>
                                </select>
                            </div>
                            <div class="mb-4">
                                <label
                                    class="block text-gray-700 text-sm font-bold mb-2"
                                    for="assignee"
                                >
                                    Assign To
                                </label>
                                <select
                                    v-model="assignTaskData.user_id"
                                    id="assignee"
                                    class="w-full px-3 py-2 border rounded-lg"
                                    required
                                >
                                    <option
                                        v-for="user in users"
                                        :key="user.id"
                                        :value="user.id"
                                    >
                                        {{ user.id }} | {{ user.name }}
                                    </option>
                                </select>
                            </div>
                            <input
                                type="hidden"
                                v-model="assignTaskData.assigned_by"
                            />
                            <input
                                type="hidden"
                                v-model="assignTaskData.task_id"
                            />
                            <div class="flex justify-end">
                                <button
                                    type="button"
                                    @click="closeAssignModal"
                                    class="text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                >
                                    Assign
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal untuk Delete Task -->
        <div
            id="deleteTaskModal"
            tabindex="-1"
            aria-hidden="true"
            class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
            <div class="relative p-4 w-full max-w-md max-h-full">
                <div
                    class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700"
                >
                    <button
                        @click="closeDeleteModal"
                        type="button"
                        class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-hide="popup-modal"
                    >
                        <svg
                            class="w-3 h-3"
                            aria-hidden="true"
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
                        <span class="sr-only">Close modal</span>
                    </button>
                    <div class="p-4 md:p-5 text-center">
                        <form @submit.prevent="confirmDeleteTask">
                            <svg
                                class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                            <h3
                                class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400"
                            >
                                Are you sure want to delete this task?
                            </h3>
                            <button
                                data-modal-hide="popup-modal"
                                type="submit"
                                class="text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                            >
                                Yes, I'm sure
                            </button>
                            <button
                                @click="goBack"
                                data-modal-hide="popup-modal"
                                type="button"
                                class="text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                            >
                                No, cancel
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted, ref, computed } from "vue";
import { useTaskStore } from "@/stores/taskStore";
import { useAuthStore } from "@/stores/authStore";
import { useTaskAssignmentStore } from "@/stores/TaskAssignmentStore";
import { Modal } from "flowbite";
import apiClient from "@/config/axios";

const taskStore = useTaskStore();
const authStore = useAuthStore();
const taskAssignment = useTaskAssignmentStore();
const users = ref([]);
const toastMessage = ref("");
const showToast = ref(false);

// Pagination state
const currentPage = ref(1);
const tasksPerPage = 5; // Sesuaikan jumlah item per halaman

// Hitung total halaman
const totalPages = computed(() =>
    Math.ceil(taskStore.tasks.length / tasksPerPage)
);

// Hitung task yang harus ditampilkan berdasarkan halaman saat ini
const paginatedTasks = computed(() => {
    const start = (currentPage.value - 1) * tasksPerPage;
    const end = start + tasksPerPage;
    return taskStore.tasks.slice(start, end);
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

const newTask = reactive({
    title: "",
    description: "",
    due_date: "",
});
const editTaskData = reactive({
    id: null,
    title: "",
    description: "",
    status: "",
    due_date: "",
});
const deleteTaskData = reactive({
    id: null,
});

// Fetch assigned tasks for the current user
const fetchAssignedTasks = async () => {
    try {
        await taskAssignment.fetchMyAssignedTasks(); // Fetch tasks assigned to the logged-in user
    } catch (error) {
        console.error("Error fetching assigned tasks:", error);
    }
};

// Filter tasks based on the logged-in user's ID and tasks that are not assigned yet
const filteredTasks = computed(() => {
    // Get tasks assigned to this user
    const assignedTaskIds = taskAssignment.tasks.map((task) => task.task_id);

    // Filter tasks by user_id and exclude the ones already assigned
    return taskStore.tasks
        .filter((task) => task.user_id === authStore.user.data?.id) // Filter tasks owned by the logged-in user
        .filter((task) => !assignedTaskIds.includes(task.id)); // Exclude tasks already assigned
});

const assignTaskData = reactive({
    id: null,
    user_id: null,
    assigned_by: authStore.user.data?.id,
    task_id: null,
});

const fetchUsers = async () => {
    try {
        const response = await apiClient.get("/users");
        users.value = response.data.data;
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};

let createTaskModal;
let editTaskModal;
let assignTaskModal;
let deleteTaskModal;

onMounted(async () => {
    createTaskModal = new Modal(document.getElementById("createTaskModal"));
    editTaskModal = new Modal(document.getElementById("editTaskModal"));
    assignTaskModal = new Modal(document.getElementById("assignTaskModal"));
    deleteTaskModal = new Modal(document.getElementById("deleteTaskModal"));

    await authStore.fetchUserProfile();
    await taskStore.fetchTasks();
    await fetchAssignedTasks();
    await fetchUsers();
});

const openCreateModal = () => {
    newTask.title = "";
    newTask.description = "";
    newTask.due_date = "";
    createTaskModal.show();
};

const closeCreateModal = () => {
    createTaskModal.hide();
};

const openEditModal = (task) => {
    editTaskData.id = task.id;
    editTaskData.title = task.title;
    editTaskData.description = task.description;
    editTaskData.status = task.status;
    editTaskData.due_date = task.due_date;
    editTaskModal.show();
};

const closeEditModal = () => {
    editTaskModal.hide();
};

const openAssignModal = (task) => {
    assignTaskData.id = task.id;
    assignTaskData.user_id = task.user_id;
    assignTaskData.task_id = task.id;
    assignTaskModal.show();
};

const closeAssignModal = () => {
    assignTaskModal.hide();
};

const openDeleteModal = (taskId) => {
    deleteTaskData.id = taskId;
    deleteTaskModal.show();
};

const closeDeleteModal = () => {
    deleteTaskData.id = null; // Reset state
    deleteTaskModal.hide();
};

// Fungsi create task dengan toast
const createTask = async () => {
    try {
        newTask.status = "pending";
        const response = await taskStore.createTask(newTask);
        showSuccessToast(response.data.message || "Task created successfully");
        closeCreateModal();
    } catch (error) {
        console.error("Error creating task:", error);
    }
};

// Fungsi update task dengan toast
const updateTask = async () => {
    try {
        const response = await taskStore.updateTask(editTaskData);
        showSuccessToast(response.data.message || "Task updated successfully");
        closeEditModal();
    } catch (error) {
        console.error("Error updating task:", error);
    }
};

const assignTask = async () => {
    try {
        // Assign task ke user
        const response = await taskAssignment.assignTask(assignTaskData);
        console.log(response);
        showSuccessToast(response.message || "Task updated successfully");
        await taskAssignment.fetchMyAssignedTasks();
        assignTaskModal.hide(); // Tutup modal setelah berhasil
    } catch (error) {
        console.error("Error assigning task:", error);
    }
};

// Fungsi untuk menampilkan toast
const showSuccessToast = (message) => {
    toastMessage.value = message;
    showToast.value = true;

    setTimeout(() => {
        showToast.value = false; // Sembunyikan toast setelah 3 detik
    }, 5000);
};

// Perbaikan deleteTask agar hanya dijalankan saat tombol konfirmasi ditekan
const confirmDeleteTask = async () => {
    if (deleteTaskData.id) {
        try {
            const response = await taskStore.deleteTask(deleteTaskData.id);
            console.log(response);
            showSuccessToast(
                response.data.message || "Task deleted successfully"
            );
        } catch (error) {
            console.error("Error deleting task:", error);
        }
        closeDeleteModal();
    }
};

const goBack = () => {
    closeDeleteModal();
};
</script>
