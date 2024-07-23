<template>
  <div
    class="w-full h-[24px] relative overflow-visible"
    @dragstart="startDrag"
    :draggable="isDateBetween.active"
    @click="
      !isDateBetween.active
        ? addHoursOfDay(dayEmployee, day, currentTime.getTime())
        : null
    "
    :class="[
      {
        'bg-red-400': isDateBetween.active,
      },
      {
        'rounded-l-[8px]': isDateBetween.start,
      },
      {
        'rounded-r-[8px]': isDateBetween.end,
      },
      {
        'hover:bg-red-500 !cursor-ew-resize':
          isDateBetween.start || isDateBetween.end,
      },
      isDateBetween.active
        ? `${dayEmployee.name}-${day} cursor-grab active:cursor-grabbing`
        : 'hover:bg-red-200',
    ]"
  >
    <div
      class="capitalize pl-2 absolute left-0 z-[1] text-white"
      v-if="isDateBetween.start"
    >
      {{ dayEmployee.name }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ArrayElement, Days } from "@/store";
import { computed } from "vue";
import { useScheduleStore } from "@/store/scheduleStore";
import { currentDrag } from "@/store/useDragAndDrop";

const { schedule, addHoursOfDay } = useScheduleStore();

const props = defineProps<{
  currentTime: Date;
  timeEmployee: {
    id: number;
    start: Date;
    end: Date;
  };
  dayEmployee: ArrayElement<typeof schedule.Monday.employee>;
  day: Days;
}>();

const isDateBetween = computed(() => {
  return {
    start: props.currentTime.getTime() === props.timeEmployee.start.getTime(),
    end:
      props.currentTime.getTime() ===
      new Date(props.timeEmployee.end.getTime() - 30 * 60000).getTime(),
    active:
      props.currentTime >= props.timeEmployee.start &&
      props.currentTime < props.timeEmployee.end,
  };
});

function startDrag() {
  currentDrag.value = {
    itemID: props.dayEmployee.name,
    start: props.timeEmployee.start.toString(),
    end: props.timeEmployee.end.toString(),
    day: props.day,
    isStart: isDateBetween.value.start.toString(),
    isEnd: isDateBetween.value.end.toString(),
    active: isDateBetween.value.active.toString(),
    currentDate: props.currentTime.toString(),
    hourId: props.timeEmployee.id.toString(),
  };
}
</script>
