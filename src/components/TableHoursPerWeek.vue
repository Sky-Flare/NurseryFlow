<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const employeeSelected = defineModel("employeeSelected");
import { computed } from "vue";
import { useScheduleStore } from "@/store/scheduleStore";
import { Employee, useEmployeeStore } from "@/store";
import AddEmployeeForm from "@/components/AddEmployeeForm.vue";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
const { employees } = useEmployeeStore();
const scheduleStore = useScheduleStore();
const { schedule } = storeToRefs(scheduleStore);
const employeeToEdit = ref<Employee["id"]>();
const openEditForm = ref(false);
watch(openEditForm, (v) => {
  if (!v) {
    employeeToEdit.value = undefined;
  }
});

const totalHoursPerWeek = computed(() => {
  return Object.values(
    Object.values(schedule.value).reduce((acc, day) => {
      day.employee.forEach((employee) => {
        if (!acc[employee.name]) {
          const e = employees.find((e) => e.id === employee.id);
          acc[employee.name] = {
            name: employee.name,
            totalHoursPerWeek: 0,
            ...e,
          };
        }

        acc[employee.name].totalHoursPerWeek += employee.hours.reduce(
          (sum, hour) => sum + hour.total,
          0,
        );
      });

      return acc;
    }, {}),
  );
});
</script>

<template>
  <div class="sticky w-[350px] top-0 right-0 h-[200px]">
    <Table>
      <TableCaption>Total semaine</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead
            class="cursor-pointer"
            @click.stop.prevent="employeeSelected = undefined"
            >🔦</TableHead
          >
          <TableHead>Nom</TableHead>
          <TableHead>Base</TableHead>
          <TableHead>Current</TableHead>
          <TableHead>Diff</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="r in totalHoursPerWeek"
          @click="
            employeeToEdit = r.id;
            openEditForm = true;
          "
          class="cursor-alias"
        >
          <TableCell
            class="cursor-pointer"
            @click.stop.prevent="
              employeeSelected = employeeSelected === r.id ? undefined : r.id
            "
            >{{ employeeSelected === r.id ? "💡" : "" }}</TableCell
          >
          <TableCell class="capitalize">{{ r.name }}</TableCell>
          <TableCell class="text-center">{{ r.hoursPerWeek }} </TableCell>
          <TableCell class="text-center">
            {{ r.totalHoursPerWeek }}
          </TableCell>
          <TableCell class="text-center">
            <span
              :class="
                r.hoursPerWeek === r?.totalHoursPerWeek
                  ? 'text-green-400'
                  : 'text-red-400'
              "
            >
              {{ r.totalHoursPerWeek - r.hoursPerWeek }}
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
  <add-employee-form
    :key="employeeToEdit ?? openEditForm.toString()"
    v-model:open="openEditForm"
    :id-employee="employeeToEdit"
  />
</template>
