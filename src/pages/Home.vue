<script setup lang="ts">
import TimeBar from "@/components/TimeBar.vue";
import CellEmployee from "@/components/CellEmployee.vue";

import { useDragAndDrop } from "@/store/useDragAndDrop";
import { useScheduleStore } from "@/store/scheduleStore";

const { schedule, getTimeSlot } = useScheduleStore();
const { onDrop, onLeave } = useDragAndDrop();

function isDateBetween(date: Date, hours: { start: Date; end: Date }) {
  return {
    start: date.getTime() === hours.start.getTime(),
    end:
      date.getTime() === new Date(hours.end.getTime() - 30 * 60000).getTime(),
    active: date >= hours.start && date < hours.end,
  };
}
</script>
<template>
  <div class="flex flex-col gap-[70px] pt-12">
    <div class="flex" v-for="(currentDay, key) in schedule">
      <div class="pr-8">{{ key }}</div>
      <div class="flex w-full max-w-[1000px]">
        <div
          v-for="(currentTime, indexTime) in getTimeSlot(currentDay.date)"
          class="w-[12%] flex flex-col gap-2 relative pt-2 group"
          :data-date="currentTime"
          @drop="onDrop($event, currentTime, true)"
          @dragover.prevent="onDrop($event, currentTime)"
          @dragenter.prevent
          @dragleave.prevent="onLeave"
        >
          <!-- Childs -->
          <template v-for="timeChild in currentDay.childs">
            <div
              class="w-full h-[15px] font-bold overflow-visible absolute -top-4"
              v-if="
                timeChild.number && isDateBetween(currentTime, timeChild).active
              "
              :class="[
                { 'bg-blue-400': isDateBetween(currentTime, timeChild).active },
                {
                  'rounded-l-[8px]': isDateBetween(currentTime, timeChild)
                    .start,
                },
                {
                  'rounded-r-[8px]': isDateBetween(currentTime, timeChild).end,
                },
              ]"
            >
              <div
                class="capitalize pl-1 text-[10px] absolute left-0 z-[1] text-white"
                v-if="isDateBetween(currentTime, timeChild).start"
              >
                👶 {{ timeChild.number }}
              </div>
            </div>
          </template>

          <!-- Time Bar -->
          <time-bar :current-time="currentTime" :index-time="indexTime" />

          <template v-for="dayEmployee in currentDay.employee">
            <cell-employee
              v-for="timeEmployee in dayEmployee.hours"
              :key="timeEmployee.id"
              :current-time="currentTime"
              :time-employee="timeEmployee"
              :day-employee="dayEmployee"
              :day="key"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
