<template>
    <div class="max-w-[740px] mx-auto">
        <Button @click="openEditForm = true">Ajouter</Button>
        <div class="flex justify-between my-4">
            <div>
                <Input v-model="search" placeholder="Recherche" />
            </div>
            <div class="flex gap-2">
                <Button
                    v-for="s in StatusEmployeeOrChild"
                    :variant="!currentFilter?.includes(s) ? 'outline' : ''"
                    @click="
                        currentFilter.includes(s) ? (currentFilter = currentFilter.filter((f) => f !== s)) : currentFilter.push(s);
                        currentFilterType = FilterType.STATUS;
                    "
                    >{{ getStatusEmployee(s).icon }}</Button
                >
            </div>
        </div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead
                        class="w-[100px] cursor-pointer"
                        @click="
                            currentSortType = SortType.NAME;
                            currentSort = currentSort === Sort.ASC ? Sort.DESC : Sort.ASC;
                        "
                    >
                        Nom
                        <font-awesome-icon v-if="currentSortType === SortType.NAME" :icon="['fas', currentSort === Sort.ASC ? 'sort-alpha-asc' : 'sort-alpha-desc']" />
                    </TableHead>

                    <TableHead
                        class="text-center cursor-pointer"
                        @click="
                            currentSortType = SortType.HOURS;
                            currentSort = currentSort === Sort.ASC ? Sort.DESC : Sort.ASC;
                        "
                        >Nombre d'heures <font-awesome-icon v-if="currentSortType === SortType.HOURS" :icon="['fas', currentSort === Sort.ASC ? 'sort-numeric-asc' : 'sort-numeric-desc']"
                    /></TableHead>
                    <TableHead class="text-center">Jours de congés</TableHead>
                    <TableHead
                        class="text-center cursor-pointer"
                        @click="
                            currentSortType = SortType.STATUS;
                            currentSort = currentSort === Sort.ASC ? Sort.DESC : Sort.ASC;
                        "
                        >Status <font-awesome-icon v-if="currentSortType === SortType.STATUS" :icon="['fas', currentSort === Sort.ASC ? 'sort-numeric-asc' : 'sort-numeric-desc']"
                    /></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow
                    v-for="employee in employeesFiltered"
                    :key="employee.id"
                    class="cursor-pointer hover:bg-accent"
                    @click="
                        employeeToEdit = employee.id;
                        openEditForm = true;
                    "
                >
                    <TableCell class="font-medium capitalize">
                        {{ employee.name }}
                    </TableCell>
                    <TableCell class="text-center">{{ employee.hoursPerWeek }}</TableCell>
                    <TableCell>
                        {{ employee.daysOff.join(', ') }}
                    </TableCell>
                    <TableCell class="text-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger class="text-2xl">{{ getStatusEmployee(employee.status).icon }}</TooltipTrigger>
                                <TooltipContent>
                                    <p>{{ getStatusEmployee(employee.status).label }}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </TableCell>
                </TableRow>
                <TableRow class="cursor-alias hover:bg-accent" @click="openEditForm = true">
                    <TableCell class="font-medium capitalize">
                        <Button class="rounded-full w-[20px] h-[20px] flex items-center justify-center p-0" @click="openEditForm = true"> <font-awesome-icon :icon="['fas', 'plus']" /> </Button
                    ></TableCell>
                    <TableCell></TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </div>
    <div class="flex gap-2 flex-wrap">
        <add-employee-form :key="employeeToEdit ?? openEditForm.toString()" v-model:open="openEditForm" :id-employee="employeeToEdit" />
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { Employee, StatusEmployeeOrChild, useEmployeeStore } from '../store/index';

import AddEmployeeForm from '@/components/AddEmployeeForm.vue';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Input from '@/components/ui/input/Input.vue';
const { getStatusEmployee, employees } = useEmployeeStore();

enum SortType {
    NAME = 'name',
    STATUS = 'status',
    HOURS = 'hours',
    NONE = 'none',
}
enum FilterType {
    STATUS = 'status',
    NONE = 'none',
}

enum Sort {
    ASC = 'asc',
    DESC = 'desc',
}
const search = ref('');
const currentSortType = ref<SortType>(SortType.NONE);
const currentFilterType = ref<FilterType>(FilterType.NONE);
const currentFilter = ref<StatusEmployeeOrChild[]>([]);
const currentSort = ref<Sort>(Sort.ASC);
const employeesFiltered = computed(() => {
    let currentEmployeeList = [...employees];
    if (search.value) {
        currentEmployeeList = currentEmployeeList.filter((e) => e.name.toLowerCase().includes(search.value.toLowerCase()));
    }
    if (currentFilterType.value !== FilterType.NONE) {
        currentEmployeeList = currentEmployeeList.filter((e) => currentFilter.value?.includes(e.status));
    }
    if (currentSortType.value === SortType.NONE) {
        return currentEmployeeList;
    }
    switch (currentSortType.value) {
        case SortType.NAME:
            return currentEmployeeList.sort((a, b) => (currentSort.value === Sort.ASC ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
        case SortType.STATUS:
            return currentEmployeeList.sort((a, b) => (currentSort.value === Sort.ASC ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)));
        case SortType.HOURS:
            return currentEmployeeList.sort((a, b) => (currentSort.value === Sort.ASC ? a.hoursPerWeek - b.hoursPerWeek : b.hoursPerWeek - a.hoursPerWeek));
    }
});

const openEditForm = ref(false);
const employeeToEdit = ref<Employee['id']>();
watch(openEditForm, (v) => {
    if (!v) {
        employeeToEdit.value = undefined;
    }
});
watch(
    () => currentFilter.value.length,
    (v) => {
        if (v === 0) {
            currentFilterType.value = FilterType.NONE;
        }
    }
);
</script>

<style scoped>
/* Ajoute des styles ici */
</style>
