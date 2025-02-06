import { defineStore } from "pinia";
import { ref } from "vue";
import { apiClient } from "@/config/axios";

export const useTaskStore = defineStore("task", () => {
    const tasks = ref([]);

    const fetchTasks = async () => {
        try {
            const response = await apiClient.get("/tasks");

            // Pastikan mengambil data dari "tasks"
            tasks.value = Array.isArray(response.data.tasks)
                ? response.data.tasks
                : [];
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            tasks.value = []; // Pastikan tetap array meskipun gagal fetch
        }
    };

    const createTask = async (task) => {
        try {
            const response = await apiClient.post("/tasks", task);
            await fetchTasks(); // Refresh tasks setelah membuat task baru
            return response;
        } catch (error) {
            throw new Error(
                error.response?.data?.message || "Failed to create task"
            );
        }
    };

    const updateTask = async (task) => {
        try {
            const response = await apiClient.put(`/tasks/${task.id}`, task);
            await fetchTasks(); // Refresh tasks setelah mengupdate task
            return response;
        } catch (error) {
            throw new Error(
                error.response?.data?.message || "Failed to update task"
            );
        }
    };

    const deleteTask = async (id) => {
        try {
            const response = await apiClient.delete(`/tasks/${id}`);
            await fetchTasks();
            return response;
        } catch (error) {
            throw new Error(
                error.response?.data?.message || "Failed to delete task"
            );
        }
    };

    return {
        tasks,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
    };
});
