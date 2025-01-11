<script setup>
import { RouterView } from "vue-router"
</script>

<template>
    <Suspense>
        <RouterView />
        <template #fallback>
            Loading ...
        </template>
    </Suspense>
</template>

<style scoped>
</style>
