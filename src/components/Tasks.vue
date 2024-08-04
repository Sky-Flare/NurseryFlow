<script setup lang="ts">
defineProps<{ index: number }>();
</script>

<template>
    <div class="component">
        <div class="number">{{ index }}</div>
        <img loading="lazy" :src="`https://picsum.photos/id/${index}/1366/768`" />
    </div>
</template>

<style>
.component {
    height: 400px;
    width: 100%;
    margin-top: 50px;
    position: relative;
}
.number {
    color: white;
    font-size: 40px;
    position: absolute;
    top: 4rem;
    width: 100%;
    text-align: center;
}
img {
    width: 100%;
    height: 100% !important;
    object-fit: cover;
    object-position: center;
}
</style>
