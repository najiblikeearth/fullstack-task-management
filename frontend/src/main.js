// src/main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import { apiClient } from "./config/axios";

const app = createApp(App);

app.config.globalProperties.$apiClient = apiClient;

// Setup Pinia dan Router
app.use(createPinia());
app.use(router);

// Mount aplikasi
app.mount("#app");
