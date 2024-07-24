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
          >{{ getStatusChild(s).icon }}</Button
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
          <TableHead class="text-center">Planning</TableHead>
          <TableHead
            class="text-center cursor-pointer"
            @click="
              currentSortType = SortType.HOURS;
              currentSort = currentSort === Sort.ASC ? Sort.DESC : Sort.ASC;
            "
            >Heures/semaines
            <font-awesome-icon
              v-if="currentSortType === SortType.HOURS"
              :icon="[
                'fas',
                currentSort === Sort.ASC
                  ? 'sort-numeric-asc'
                  : 'sort-numeric-desc',
              ]"
          /></TableHead>
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
          v-for="child in childrenFiltered"
          :key="child.name"
          class="cursor-pointer hover:bg-accent"
          @click="
            childToEdit = child;
            openEditForm = true;
          "
        >
          <TableCell class="font-medium capitalize">
            {{ child.name }}
          </TableCell>
          <TableCell class="text-center flex items-center justify-center gap-4">
            <div class="flex flex-col items-start">
              <div v-for="(item, key) in child.hours">
                {{ key }}
              </div>
            </div>
            <div>
              <div class="flex items-start" v-for="(item, key) in child.hours">
                {{ item.start }} - {{ item.end }}
              </div>
            </div>
            <div>
              <div class="flex items-start" v-for="(item, key) in child.hours">
                Total :
                {{
                  totalHoursPerDays(item.start, item.end)
                    ? totalHoursPerDays(item.start, item.end) + " h"
                    : "0"
                }}
              </div>
            </div>
          </TableCell>
          <TableCell class="text-center">{{ child.total }}</TableCell>
          <TableCell class="text-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger class="text-2xl">{{
                  getStatusChild(child.status).icon
                }}</TooltipTrigger>
                <TooltipContent>
                  <p>{{ getStatusChild(child.status).label }}</p>
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
              class="rounded-full w-[20px] h-[20px] flex items-center justify-center p-0"
            >
              <font-awesome-icon :icon="['fas', 'plus']" /></Button
          ></TableCell>
          <TableCell></TableCell>
          <TableCell> </TableCell>
          <TableCell> </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
  <div class="flex gap-2 flex-wrap">
    <AddChildForm
      :key="childToEdit?.id ?? new Date().getTime()"
      v-model:open="openEditForm"
      :child="childToEdit"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/components/lib/utils";
import AddChildForm from "@/components/AddChildForm.vue";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddEmployeeForm from "@/components/AddEmployeeForm.vue";
import { StatusEmployeeOrChild, useStore } from "@/store";
import { Child, useChildStore } from "@/store/childStore";
import Input from "@/components/ui/input/Input.vue";
const { updateEmployee, addEmployee } = useStore();
const { children, getStatusChild } = useChildStore();

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
const childrenFiltered = computed(() => {
  console.log(currentSortType.value);
  console.log(currentSort.value);
  let currentChildrenList = [...children];
  if (search.value) {
    console.log("icic");
    currentChildrenList = currentChildrenList.filter((child) =>
      child.name.toLowerCase().includes(search.value.toLowerCase()),
    );
  }
  if (currentFilterType.value !== FilterType.NONE) {
    currentChildrenList = currentChildrenList.filter(
      (child) => currentFilter.value?.includes(child.status),
    );
  }
  if (currentSortType.value === SortType.NONE) {
    console.log("currentSortType.value === SortType.NONE");
    return currentChildrenList;
  }
  switch (currentSortType.value) {
    case SortType.NAME:
      return currentChildrenList.sort((a, b) =>
        currentSort.value === Sort.ASC
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name),
      );
    case SortType.STATUS:
      return currentChildrenList.sort((a, b) =>
        currentSort.value === Sort.ASC
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status),
      );
    case SortType.HOURS:
      return currentChildrenList.sort((a, b) =>
        currentSort.value === Sort.ASC ? a.total - b.total : b.total - a.total,
      );
  }
});
const store = useStore();
const openEditForm = ref(false);
const childToEdit = ref<Child>();
watch(openEditForm, (v) => {
  if (!v) {
    childToEdit.value = undefined;
  }
});
const totalHoursPerDays = (start: string, end: string) => {
  if (start && end) {
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);
    return endHour - startHour + (endMinute - startMinute) / 60;
  }
  return "";
};
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
