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
import { useEmployeeStore } from "@/store";
const { employees } = useEmployeeStore();
const { schedule } = useScheduleStore();

const totalHoursPerWeek = computed(() => {
  return Object.values(schedule).reduce((acc: Record<string, number>, day) => {
    console.log(acc);
    day.employee.forEach((employee) => {
      if (!acc[employee.name]) {
        acc[employee.name] = 0;
      }

      acc[employee.name] += employee.hours.reduce(
        (sum, hour) => sum + hour.total,
        0,
      );
    });

    return acc;
  }, {});
});

const result = computed(() => {
  return Object.keys(totalHoursPerWeek.value).map((name) => ({
    name,
    totalHoursPerWeek: totalHoursPerWeek.value[name],
  }));
});
</script>

<template>
  <div class="sticky top-0 right-0 h-[200px]">
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
        <TableRow v-for="r in result">
          <TableCell class="capitalize font-medium">{{ r.name }}</TableCell>
          <TableCell class="text-center">{{ r.totalHoursPerWeek }} </TableCell>
          <TableCell
            :class="{
              'text-red-500 ':
                r.totalHoursPerWeek -
                  employees.find((e) => e.name === r.name)?.hoursPerWeek ===
                r.totalHoursPerWeek,
            }"
          >
            {{
              r.totalHoursPerWeek -
              employees.find((e) => e.name === r.name)?.hoursPerWeek
            }}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
