<script setup lang="ts">
import TimeBar from "@/components/TimeBar.vue";
import CellEmployee from "@/components/CellEmployee.vue";

import { useDragAndDrop } from "@/store/useDragAndDrop";
import { useScheduleStore } from "@/store/scheduleStore";
import CellChild from "@/components/CellChild.vue";

const { schedule, getTimeSlot } = useScheduleStore();
const { onDrop, onLeave } = useDragAndDrop();
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
          <template v-for="timeChild in currentDay.childs">
            <cell-child :current-time="currentTime" :time-child="timeChild" />
          </template>

          <time-bar :current-time="currentTime" :index-time="indexTime" />

          <template v-for="(dayEmployee, indexE) in currentDay.employee">
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
