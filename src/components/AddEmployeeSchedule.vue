<script lang="ts" setup>
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, watch } from 'vue';
import { Days, Employee, StatusEmployeeOrChild, useEmployeeStore } from '@/store/employeeStore';
import { useScheduleStore } from '@/store/scheduleStore';
import { storeToRefs } from 'pinia';

const props = defineProps<{ date: Date }>();
const { employees } = useEmployeeStore();
const DaysSchedule = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const scheduleStore = useScheduleStore();
const { schedule } = storeToRefs(scheduleStore);
const employeeSelected = ref<Employee>();
const openDialogAddEmployee = ref(false);

const avaibilityEmployeeForCurrentDay = computed(() => {
    const employeesAlreadyInDay = schedule.value?.[DaysSchedule[props.date?.getDay()] as Days]?.employee.map((e) => e.name) ?? [];
    return employees?.filter((e) => !employeesAlreadyInDay?.includes(e.name) && e.status === StatusEmployeeOrChild.WORKING);
});
watch(employeeSelected, () => {
    if (employeeSelected.value?.id && props.date) {
        scheduleStore.addEmployeeOfOneDay(employeeSelected.value?.id, DaysSchedule[props.date?.getDay()] as Days);
        openDialogAddEmployee.value = false;
        employeeSelected.value = undefined;
    }
});
</script>

<template>
    <Dialog v-model:open="openDialogAddEmployee">
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Ajouter un employee</DialogTitle>
                <DialogDescription />
            </DialogHeader>
            <div class="grid grid-cols-4 items-center gap-4">
                <select v-model="employeeSelected" class="bg-background text-foreground capitalize">
                    <option v-for="time in avaibilityEmployeeForCurrentDay" :key="time.id" :value="time">
                        {{ time.name }}
                    </option>
                </select>
            </div>
        </DialogContent>
    </Dialog>
    <div v-if="avaibilityEmployeeForCurrentDay?.length" class="cursor-pointer absolute opacity-60 hover:opacity-100 text-accent-foreground -bottom-4 -left-6" @click="openDialogAddEmployee = true">
        <font-awesome-icon :icon="['fas', 'user-plus']" />
    </div>
</template>
