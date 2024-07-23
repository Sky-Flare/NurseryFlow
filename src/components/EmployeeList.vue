<template>
  <div class="max-w-[740px] mt-8 mx-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[100px]"> Nom </TableHead>
          <TableHead class="text-center">Nombre d'heures</TableHead>
          <TableHead class="text-center">Jours de congés</TableHead>
          <TableHead class="text-center">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="employee in employees"
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
import { Employee, useStore } from "../store/index";
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
const { getStatusEmployee, removeEmployee, employees } = useStore();

const openEditForm = ref(false);
const employeeToEdit = ref<Employee>();
watch(openEditForm, (v) => {
  if (!v) {
    employeeToEdit.value = undefined;
  }
});
</script>

<style scoped>
/* Ajoute des styles ici */
</style>
