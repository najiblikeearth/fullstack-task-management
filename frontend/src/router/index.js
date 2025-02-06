import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";

import AdminLayout from "@/layouts/AdminLayout.vue";
import Dashboard from "@/views/Dashboard.vue";
import Tasks from "@/views/Tasks.vue";
import AssignedTasks from "@/views/Assigned-Tasks.vue";
import MyTasks from "@/views/MyTasks.vue";

import ProfileLayout from "@/layouts/ProfileLayout.vue";
import Profile from "@/views/Profile.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/login", component: Login },
        { path: "/register", component: Register },
        { path: "/", redirect: "/tasks" },
        {
            path: "/admin",
            component: AdminLayout,
            children: [
                {
                    path: "/tasks",
                    component: Tasks,
                    meta: { requiresAuth: true },
                },
                {
                    path: "/assigned-tasks",
                    component: AssignedTasks,
                    meta: { requiresAuth: true },
                },
                {
                    path: "/my-tasks",
                    component: MyTasks,
                    meta: { requiresAuth: true },
                },
                {
                    path: "/dashboard",
                    component: Dashboard,
                    meta: { requiresAuth: true },
                },
            ],
        },
        {
            path: "/profile",
            component: ProfileLayout,
            children: [
                {
                    path: "/profile",
                    component: Profile,
                    meta: { requiresAuth: true },
                },
            ],
        },
    ],
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token");

    // Jika halaman memerlukan auth dan pengguna belum login
    if (to.meta.requiresAuth && !token) {
        next("/login"); // Arahkan ke login
    }
    // Jika pengguna sudah login dan mencoba mengakses halaman login/register
    else if ((to.path === "/login" || to.path === "/register") && token) {
        next("/admin"); // Arahkan ke tasks
    }
    // Jika tidak ada kondisi di atas, lanjutkan navigasi
    else {
        next();
    }
});

export default router;
