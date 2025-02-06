import { defineStore } from "pinia";
import { ref } from "vue";
import { apiClient } from "@/config/axios";

export const useTaskAssignmentStore = defineStore("taskAssignment", () => {
    const tasks = ref([]);

    const assignTask = async (assignTaskData) => {
        try {
            const response = await apiClient.post(
                `/tasks/${assignTaskData.task_id}/assign`,
                {
                    assigned_to: assignTaskData.user_id,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error assigning task:", error);
            throw error;
        }
    };

    const fetchMyAssignedTasks = async () => {
        try {
            const response = await apiClient.get("my-assigned-tasks");
            tasks.value = response.data.tasks; // Correctly update tasks ref
        } catch (error) {
            console.error("Error fetching assigned tasks:", error);
            throw error;
        }
    };

    const fetchAssignedTasks = async () => {
        try {
            const response = await apiClient.get("/assigned-tasks");
            tasks.value = response.data.tasks; // Correctly update tasks ref
        } catch (error) {
            console.error("Error fetching assigned tasks:", error);
            throw error;
        }
    };

    const updateTaskStatus = async (taskId, status) => {
        try {
            const response = await apiClient.put(
                `/tasks/${taskId}/update-status`,
                {
                    status: status,
                }
            );
            await fetchMyAssignedTasks(); // Refresh task list setelah update
            return response.data;
        } catch (error) {
            console.error(
                "Error updating task status:",
                error.response?.data?.message || error.message
            );
            throw error;
        }
    };

    return {
        tasks,
        assignTask,
        fetchMyAssignedTasks,
        fetchAssignedTasks,
        updateTaskStatus,
    };
});
