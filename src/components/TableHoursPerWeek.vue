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
import { computed } from "vue";
import { useScheduleStore } from "@/store/scheduleStore";
import { Employee, useEmployeeStore } from "@/store";
import AddEmployeeForm from "@/components/AddEmployeeForm.vue";
import { ref, watch } from "vue";
const { employees } = useEmployeeStore();
const { schedule } = useScheduleStore();
const employeeToEdit = ref<Employee['id']>();
const openEditForm = ref(false);
watch(openEditForm, (v) => {
  if (!v) {
    employeeToEdit.value = undefined;
  }
});


const totalHoursPerWeek = computed(() => {
  return Object.values(Object.values(schedule).reduce((acc, day) => {
    day.employee.forEach(employee => {
      if (!acc[employee.name]) {
        const e = employees.find(e => e.id === employee.id);
        acc[employee.name] = {
          name: employee.name,
          totalHoursPerWeek: 0,
          ...e
        };
      }

      acc[employee.name].totalHoursPerWeek += employee.hours.reduce((sum, hour) => sum + hour.total, 0);
    });

    return acc;
  }, {}));
});
</script>

<template>
  <div class="sticky w-[210px] top-0 right-0 h-[200px]">
    <Table>
      <TableCaption>Total semaine</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[100px]">Nom</TableHead>
          <TableHead>Heures</TableHead>
          <TableHead>Diff</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="r in totalHoursPerWeek" @click="
            employeeToEdit = r.id;
            openEditForm = true;
          ">
          <TableCell class="capitalize font-medium">{{ r.name }}</TableCell>
          <TableCell class="text-center">{{ r.hoursPerWeek }} </TableCell>
          <TableCell>
              <span :class="r.totalHoursPerWeek - r?.hoursPerWeek === r?.hoursPerWeek  ? 'text-green-400' : 'text-red-400'">
                 {{r.totalHoursPerWeek - r?.hoursPerWeek }}
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
