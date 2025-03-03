<template>
    <div id="app" class="font-montserrat">
        <main><router-view /></main>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import "flowbite";

onMounted(() => {
    import("flowbite").then((flowbite) => {
        flowbite.init();
    });
});
</script>
