<script setup lang="ts">
import TimeBar from '@/components/TimeBar.vue';
import CellEmployee from '@/components/CellEmployee.vue';
import { useDragAndDrop } from '@/store/useDragAndDrop';
import { useScheduleStore } from '@/store/scheduleStore';
import CellChild from '@/components/CellChild.vue';
import TableHoursPerWeek from '@/components/TableHoursPerWeek.vue';
import { Button } from '@/components/ui/button';

import { ref, watch } from 'vue';
import { Days } from '@/store';
import AddEmployeeSchedule from '@/components/AddEmployeeSchedule.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { storeToRefs } from 'pinia';

const scheduleStore = useScheduleStore();
const { employeeDisplay, schedule, generateScheduleLoading } = storeToRefs(scheduleStore);
const { onDrop, onLeave } = useDragAndDrop();

const selectedDate = ref<Date>();
const errorNotMonday = ref(false);
const employeeSelected = ref<number>();

watch(selectedDate, () => {
    errorNotMonday.value = false;
    if (!selectedDate.value) {
        return;
    }
    if (new Date(selectedDate.value).getDay() !== 1) {
        errorNotMonday.value = true;
    }
});
</script>
<template>
    <div v-if="!schedule" class="h-full w-full flex flex-col items-center justify-center gap-4 pt-8">
        <p :class="{ 'text-destructive': errorNotMonday }">Selectionner un lundi</p>
        <div class="border rounded cursor-pointer w-fit">
            <input v-model="selectedDate" class="cursor-pointer input-date text-foreground bg-background" type="date" @click="errorNotMonday = false" />
        </div>
        <Button :disabled="!selectedDate || errorNotMonday" @click="selectedDate ? scheduleStore.generateSchedule(selectedDate) : null">
            Générer
            <font-awesome-icon v-if="generateScheduleLoading" spin class="ml-2" :icon="['fas', 'spinner']" />
        </Button>
    </div>
    <div v-if="schedule">
        <div class="cursor-pointer flex items-center justify-start text-xl gap-4" @click="scheduleStore.toggleUserTypeDisplayed()">
            <font-awesome-icon
                v-for="icon in ['user', 'baby']"
                :key="icon"
                :class="(!employeeDisplay && icon === 'baby') || (employeeDisplay && icon === 'user') ? 'text-primary' : 'text-gray-400'"
                :icon="['fas', icon]"
            />
        </div>
        <div class="relative flex justify-between gap-8">
            <div class="w-full flex flex-col gap-[70px] pt-12 justify-center">
                <div v-for="(currentDay, key) in schedule" :key="key" class="flex items-center">
                    <div class="w-[140px]">{{ key }}</div>

                    <div class="flex w-full max-w-[800px]">
                        <div
                            v-for="(currentTime, indexTime) in scheduleStore.getTimeSlot(currentDay.date)"
                            :key="indexTime"
                            class="w-[12%] flex flex-col gap-2 relative pt-2 group"
                            :data-date="currentTime"
                            @drop="onDrop($event, currentTime, true)"
                            @dragover.prevent="onDrop($event, currentTime)"
                            @dragenter.prevent
                            @dragleave.prevent="onLeave"
                        >
                            <add-employee-schedule v-if="indexTime === 0" :date="currentDay.date" />
                            <time-bar :current-time="currentTime" :index-time="indexTime" />

                            <template v-for="timeChild in currentDay.totalChildren" :key="key + timeChild.number + indexTime">
                                <cell-child :day-employees="currentDay.employee" :current-time="currentTime" :time-child="timeChild" />
                            </template>
                            <template v-for="(dayEmployee, indexE) in employeeDisplay ? currentDay.employee : currentDay.children">
                                <cell-employee
                                    v-for="(timeEmployee, index) in dayEmployee.hours"
                                    :key="dayEmployee.name + indexE + index + indexTime"
                                    :current-time="currentTime"
                                    :time-employee="timeEmployee"
                                    :day-employee="dayEmployee"
                                    :day="key as Days"
                                    :first-hours="index === 0"
                                    :employee-selected="employeeSelected"
                                    :same-employe="dayEmployee.name === currentDay.employee?.[indexE + 1]?.name"
                                />
                            </template>
                        </div>
                    </div>
                </div>
            </div>

            <table-hours-per-week v-model:employee-selected="employeeSelected" />
        </div>
    </div>
</template>

<style>
.dark ::-webkit-calendar-picker-indicator {
    filter: invert(1);
}
</style>
