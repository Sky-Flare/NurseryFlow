<template>
  <div ref="container">
    <template v-for="index in 200" :key="index">
      <div
        v-if="index > currentId - 5 && index < currentId + 5"
        :ref="(el) => (elements[index] = el)"
        :data-id="index"
      >
        <Tasks :index="index" :key="index" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  ComponentPublicInstance,
  onMounted,
  ref,
  watch,
} from "@vue/runtime-dom";
import Tasks from "./components/Tasks.vue";

const elements = ref<Element[] | ComponentPublicInstance[] | null[]>([]);
const container = ref<Element>();
const observer = ref<IntersectionObserver>();
const currentId = ref(1);

observer.value = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0.5) {
        currentId.value = Number((entry.target as any).dataset.id);
        console.log(currentId.value);
      }
    });
  },
  { threshold: [0.5] }
);
watch(
  () => currentId.value,
  () => {
    console.log(currentId.value);
    observer.value?.unobserve;
    if (elements.value.length) {
      elements.value.forEach((el) => {
        const value = el as Element;
        if (value) {
          observer.value?.observe(value);
        }
      });
    }
  }
);

onMounted(() => {
  if (elements.value.length) {
    elements.value.forEach((el) => {
      const value = el as Element;
      if (value) {
        observer.value?.observe(value);
      }
    });
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
