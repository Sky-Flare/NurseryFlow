<script setup lang="ts">
import TimeBar from "@/components/TimeBar.vue";
import CellEmployee from "@/components/CellEmployee.vue";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDragAndDrop } from "@/store/useDragAndDrop";
import { useScheduleStore } from "@/store/scheduleStore";
import CellChild from "@/components/CellChild.vue";
import TableHoursPerWeek from "@/components/TableHoursPerWeek.vue";

import { computed, ref, watch } from "vue";
import { Employee } from "@/store";
import AddEmployeeSchedule from "@/components/AddEmployeeSchedule.vue";

const { schedule, getTimeSlot, addEmployeeOfOneDay } = useScheduleStore();
const { onDrop, onLeave } = useDragAndDrop();

const employeeSelected = ref<Employee>();
</script>
<template>
  <div class="relative flex justify-between gap-8">
    <div class="w-full flex flex-col gap-[70px] pt-12 justify-center">
      <div class="flex items-center" v-for="(currentDay, key) in schedule">
        <div class="w-[140px]">{{ key }}</div>

        <div class="flex w-full max-w-[800px]">
          <div
            v-for="(currentTime, indexTime) in getTimeSlot(currentDay.date)"
            class="w-[12%] flex flex-col gap-2 relative pt-2 group"
            :data-date="currentTime"
            @drop="onDrop($event, currentTime, true)"
            @dragover.prevent="onDrop($event, currentTime)"
            @dragenter.prevent
            @dragleave.prevent="onLeave"
          >
            <add-employee-schedule
              v-if="indexTime === 0"
              :date="currentDay.date"
            />
            <time-bar :current-time="currentTime" :index-time="indexTime" />

            <template v-for="timeChild in currentDay.childs">
              <cell-child
                :day-employees="currentDay.employee"
                :current-time="currentTime"
                :time-child="timeChild"
              />
            </template>
            <template v-for="(dayEmployee, indexE) in currentDay.employee">
              <cell-employee
                v-for="(timeEmployee, index) in dayEmployee.hours"
                :key="dayEmployee.name + index"
                :current-time="currentTime"
                :time-employee="timeEmployee"
                :day-employee="dayEmployee"
                :day="key"
                :first-hours="index === 0"
                :index-employee="indexE"
                :same-employe="
                  dayEmployee.name === currentDay.employee?.[indexE + 1]?.name
                "
              />
            </template>
          </div>
        </div>
      </div>
    </div>

    <table-hours-per-week />
  </div>
</template>
