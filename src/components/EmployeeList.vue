<template>
  <div class="max-w-[740px] mx-auto">
    <Button @click="openEditForm = true">Ajouter</Button>
    <div class="flex justify-between my-4">
      <div>
        <Input v-model="search" placeholder="Recherche" />
      </div>
      <div class="flex gap-2">
        <Button
          :variant="!currentFilter?.includes(s) ? 'outline' : ''"
          @click="
            currentFilter.includes(s)
              ? (currentFilter = currentFilter.filter((f) => f !== s))
              : currentFilter.push(s);
            currentFilterType = FilterType.STATUS;
          "
          v-for="s in StatusEmployeeOrChild"
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
            <font-awesome-icon
              v-if="currentSortType === SortType.NAME"
              :icon="[
                'fas',
                currentSort === Sort.ASC ? 'sort-alpha-asc' : 'sort-alpha-desc',
              ]"
            />
          </TableHead>

          <TableHead
            class="text-center cursor-pointer"
            @click="
              currentSortType = SortType.HOURS;
              currentSort = currentSort === Sort.ASC ? Sort.DESC : Sort.ASC;
            "
            >Nombre d'heures
            <font-awesome-icon
              v-if="currentSortType === SortType.HOURS"
              :icon="[
                'fas',
                currentSort === Sort.ASC
                  ? 'sort-numeric-asc'
                  : 'sort-numeric-desc',
              ]"
          /></TableHead>
          <TableHead class="text-center">Jours de congés</TableHead>
          <TableHead
            class="text-center cursor-pointer"
            @click="
              currentSortType = SortType.STATUS;
              currentSort = currentSort === Sort.ASC ? Sort.DESC : Sort.ASC;
            "
            >Status
            <font-awesome-icon
              v-if="currentSortType === SortType.STATUS"
              :icon="[
                'fas',
                currentSort === Sort.ASC
                  ? 'sort-numeric-asc'
                  : 'sort-numeric-desc',
              ]"
          /></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="employee in employeesFiltered"
          :key="employee.name"
          class="cursor-pointer hover:bg-accent"
          @click="
            employeeToEdit = employee;
            openEditForm = true;
          "
        >
          <TableCell class="font-medium capitalize">
            {{ employee.name }}
          </TableCell>
          <TableCell class="text-center">{{ employee.hoursPerWeek }}</TableCell>
          <TableCell>
            {{ employee.daysOff.join(", ") }}
          </TableCell>
          <TableCell class="text-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger class="text-2xl">{{
                  getStatusEmployee(employee.status).icon
                }}</TooltipTrigger>
                <TooltipContent>
                  <p>{{ getStatusEmployee(employee.status).label }}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
        </TableRow>
        <TableRow
          @click="openEditForm = true"
          class="cursor-alias hover:bg-accent"
        >
          <TableCell class="font-medium capitalize">
            <Button
              @click="openEditForm = true"
              class="rounded-full w-[20px] h-[20px] flex items-center justify-center p-0"
            >
              <font-awesome-icon :icon="['fas', 'plus']" /> </Button
          ></TableCell>
          <TableCell></TableCell>
          <TableCell> </TableCell>
          <TableCell> </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
  <div class="flex gap-2 flex-wrap">
    <add-employee-form
      :key="employeeToEdit?.id ?? openEditForm.toString()"
      v-model:open="openEditForm"
      :edit="employeeToEdit"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import {
  Employee,
  StatusEmployeeOrChild,
  useEmployeeStore,
} from "../store/index";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/components/lib/utils";
import AddEmployeeForm from "@/components/AddEmployeeForm.vue";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Input from "@/components/ui/input/Input.vue";
const { getStatusEmployee, removeEmployee, employees } = useEmployeeStore();

enum SortType {
  NAME = "name",
  STATUS = "status",
  HOURS = "hours",
  NONE = "none",
}
enum FilterType {
  STATUS = "status",
  NONE = "none",
}

enum Sort {
  ASC = "asc",
  DESC = "desc",
}
const search = ref("");
const currentSortType = ref<SortType>(SortType.NONE);
const currentFilterType = ref<FilterType>(FilterType.NONE);
const currentFilter = ref<StatusEmployeeOrChild[]>([]);
const currentSort = ref<Sort>(Sort.ASC);
const employeesFiltered = computed(() => {
  console.log(currentSortType.value);
  console.log(currentSort.value);
  let currentEmployeeList = [...employees];
  console.log(currentEmployeeList);
  if (search.value) {
    console.log("icic");
    currentEmployeeList = currentEmployeeList.filter((e) =>
      e.name.toLowerCase().includes(search.value.toLowerCase()),
    );
  }
  if (currentFilterType.value !== FilterType.NONE) {
    console.log("currentFilterType.value !== FilterType.NONE");
    currentEmployeeList = currentEmployeeList.filter(
      (e) => currentFilter.value?.includes(e.status),
    );
  }
  if (currentSortType.value === SortType.NONE) {
    console.log("currentSortType.value === SortType.NONE");
    console.log(currentEmployeeList);
    return currentEmployeeList;
  }
  switch (currentSortType.value) {
    case SortType.NAME:
      return currentEmployeeList.sort((a, b) =>
        currentSort.value === Sort.ASC
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name),
      );
    case SortType.STATUS:
      return currentEmployeeList.sort((a, b) =>
        currentSort.value === Sort.ASC
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status),
      );
    case SortType.HOURS:
      return currentEmployeeList.sort((a, b) =>
        currentSort.value === Sort.ASC
          ? a.hoursPerWeek - b.hoursPerWeek
          : b.hoursPerWeek - a.hoursPerWeek,
      );
  }
});

const openEditForm = ref(false);
const employeeToEdit = ref<Employee>();
watch(openEditForm, (v) => {
  if (!v) {
    employeeToEdit.value = undefined;
  }
});
watch(
  () => currentFilter.value.length,
  (v) => {
    console.log(v);
    if (v === 0) {
      currentFilterType.value = FilterType.NONE;
    }
  },
);
</script>

<style scoped>
/* Ajoute des styles ici */
</style>
