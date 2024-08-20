<script setup lang="ts">
import TimeBar from '@/components/TimeBar.vue';
import CellEmployee from '@/components/CellEmployee.vue';
import { useDragAndDrop } from '@/composable/useDragAndDrop';
import { useScheduleStore } from '@/store/scheduleStore';
import CellChild from '@/components/CellChild.vue';
import TableHoursPerWeek from '@/components/TableHoursPerWeek.vue';
import { Button } from '@/components/ui/button';

import { onMounted, ref, watch } from 'vue';
import { Days } from '@/store/employeeStore';
import AddEmployeeSchedule from '@/components/AddEmployeeSchedule.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { storeToRefs } from 'pinia';
import { useToast } from '@/components/ui/toast';

const scheduleStore = useScheduleStore();
const { employeeDisplay, schedule, generateScheduleLoading } = storeToRefs(scheduleStore);
const { onDrop, onLeave } = useDragAndDrop();

const selectedDate = ref<Date>();
const errorNotMonday = ref(false);
const employeeSelected = ref<number>();
const allSchedules = ref<Record<string, typeof schedule.value>>();
const { toast } = useToast();

onMounted(() => {
    const storedSchedule = JSON.parse(localStorage.getItem('schedules') ?? 'null', (_, value) => {
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
            return new Date(value);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return value;
    }) as Record<string, typeof schedule.value>;
    if (!Object.keys(storedSchedule).length) {
        return;
    }
    allSchedules.value = storedSchedule;
});

const save = () => {
    if (!schedule.value?.Monday.date) {
        toast({
            title: "Erreur d'enregistrement",
            description: 'Pas de planning à enregistrer',
            variant: 'destructive',
        });
        return;
    }
    const name = prompt("Nom de l'enregistrement", `${new Date(schedule.value.Monday.date).toLocaleString()}`);
    if (!name) {
        toast({
            title: "Erreur d'enregistrement",
            description: "Enregistrement annulé ou pas de nom d'enregistrement",
            variant: 'destructive',
        });
        return;
    }
    toast({
        title: 'Planning enregistré',
        description: `Planning enregistré ${name}`,
    });
    allSchedules.value = { ...allSchedules.value, [name]: schedule.value };
    localStorage.setItem('schedules', JSON.stringify(allSchedules.value));
};

const deleteScheduleItem = (k: string) => {
    if (!allSchedules.value) {
        return;
    }
    if (window.confirm(`Souhaitez-vous vraiment supprimer le planning ${k}`)) {
        if (allSchedules.value[k]) {
            delete allSchedules.value[k];
            localStorage.setItem('schedules', JSON.stringify(allSchedules.value));
        } else {
            toast({
                title: 'Erreur de suppression',
                description: `Le planning ${k} n'existe pas`,
                variant: 'destructive',
            });
        }
        if (allSchedules.value && Object.keys(allSchedules.value).length === 0) {
            allSchedules.value = undefined;
        }
    }
};

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
        <div v-if="allSchedules">
            Planning déja enregistré :
            <ul>
                <li v-for="(s, k) in allSchedules" :key="k" class="gap-2 flex items-center justify-start">
                    <span class="cursor-pointer" @click="schedule = s">{{ k }}</span>
                    <font-awesome-icon :icon="['fas', 'trash']" class="cursor-pointer size-3 text-xs rounded-full p-1 bg-red-400 text-white" @click="deleteScheduleItem(k)" />
                </li>
            </ul>
        </div>
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

        <Button class="block mx-auto my-12" @click="save">Enregistrer</Button>
    </div>
</template>

<style>
.dark ::-webkit-calendar-picker-indicator {
    filter: invert(1);
}
</style>
