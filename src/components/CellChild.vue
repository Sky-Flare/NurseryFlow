<template>
  <div
    class="w-full h-[15px] font-bold overflow-visible absolute -top-4"
    v-if="timeChild.number && isDateBetween.active"
    :class="[
      { 'bg-blue-400': isDateBetween.active },
      {
        'rounded-l-[8px]': isDateBetween.start,
      },
      {
        'rounded-r-[8px]': isDateBetween.end,
      },
    ]"
  >
    <div
      class="capitalize pl-1 text-[10px] absolute left-0 z-[1] text-white"
      v-if="isDateBetween.start"
    >
      👶 {{ timeChild.number }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
  currentTime: Date;
  timeChild: {
    number: number;
    start: Date;
    end: Date;
  };
}>();

const isDateBetween = computed(() => {
  return {
    start: props.currentTime.getTime() === props.timeChild.start.getTime(),
    end:
      props.currentTime.getTime() ===
      new Date(props.timeChild.end.getTime() - 30 * 60000).getTime(),
    active:
      props.currentTime >= props.timeChild.start &&
      props.currentTime < props.timeChild.end,
  };
});
</script>
