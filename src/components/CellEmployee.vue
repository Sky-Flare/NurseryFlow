<script lang="ts" setup>
import { ArrayElement } from '@/store/employeeStore';
import { computed } from 'vue';
import { Hour, useScheduleStore } from '@/store/scheduleStore';
import { currentDrag } from '@/composable/useDragAndDrop';
import { storeToRefs } from 'pinia';
import { Days } from '@/store/childStore';

const scheduleStore = useScheduleStore();
const { employeeDisplay } = storeToRefs(scheduleStore);

const props = defineProps<{
    currentTime: Date;
    timeEmployee: ArrayElement<Hour['hours']>;
    dayEmployee: Hour;
    day: Days;
    firstHours: boolean;
    sameEmploye: boolean;
    employeeSelected?: number;
}>();

const isDateBetween = computed(() => ({
    start: props.currentTime.getTime() === props.timeEmployee.start.getTime(),
    end: props.currentTime.getTime() === new Date(props.timeEmployee.end.getTime() - 30 * 60000).getTime(),
    active: props.currentTime >= props.timeEmployee.start && props.currentTime < props.timeEmployee.end,
}));
const isDateBetwennOtherHours = computed(() => {
    if (!props.firstHours) {
        return 0;
    }
    const otherHours = props.dayEmployee.hours.filter((hour) => hour.id !== props.timeEmployee.id);
    let s = 0;
    otherHours.forEach((h) => {
        if (props.currentTime >= h.start && props.currentTime < h.end && h.id !== props.timeEmployee.id) {
            s++;
        }
    });
    return s;
});

const startDrag = () => {
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
};

const deleteHour = () => {
    if (window.confirm(`Souhaitez-vous vraiment supprimer ${props.dayEmployee.name} le ${props.day}`)) {
        scheduleStore.deleteHour(props.day, props.dayEmployee.name, props.timeEmployee.id);
    }
};
</script>

<template>
    <div
        v-if="isDateBetween.active || (firstHours && isDateBetwennOtherHours === 0)"
        class="w-full h-[24px] relative overflow-visible"
        :draggable="isDateBetween.active"
        :class="[
            {
                'rounded-l-[8px]': isDateBetween.start,
            },
            {
                'rounded-r-[8px]': isDateBetween.end,
            },
            {
                '!cursor-ew-resize': isDateBetween.start || isDateBetween.end,
            },
            isDateBetween.active ? `${dayEmployee.name}-${day} cursor-grab active:cursor-grabbing` : employeeDisplay ? 'hover:bg-red-200' : 'hover:bg-blue-200',
            isDateBetween.active && (!employeeSelected || employeeSelected === dayEmployee.id) ? (employeeDisplay ? 'bg-red-400' : 'bg-blue-400') : '',
            isDateBetween.start || isDateBetween.end ? (employeeDisplay ? 'hover:bg-red-500' : 'hover:bg-blue-500') : null,
        ]"
        @dragstart="startDrag"
        @click.stop.prevent="!isDateBetween.active ? scheduleStore.addHoursOfDay(dayEmployee, day, currentTime.getTime()) : deleteHour()"
    >
        <div v-if="isDateBetween.start && (!employeeSelected || employeeSelected === dayEmployee.id)" class="capitalize w-max pl-2 absolute left-0 z-[1] text-white">
            {{ dayEmployee.name }} {{ timeEmployee.total }}
        </div>
    </div>
</template>
