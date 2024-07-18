<template>
  <div class="flex items-center gap-4 mb-2">
    <h2 class="text-xl font-semibold">Liste des employés</h2>
    <Button
      @click="openEditForm = true"
      class="rounded-full w-[20px] h-[20px] flex items-center justify-center p-0"
    >
      <font-awesome-icon :icon="['fas', 'plus']" />
    </Button>
  </div>

  <div class="flex gap-2 flex-wrap">
    <Card
      :class="cn('w-[190px] h-[190px]', $attrs.class ?? '')"
      v-for="employee in employees"
      :key="employee.name"
      @click="
        employeeToEdit = employee;
        openEditForm = true;
      "
    >
      <CardHeader>
        <CardTitle class="capitalize">{{ employee.name }}</CardTitle>
      </CardHeader>
      <CardContent>
        <span class="block">{{ employee.hoursPerWeek }} h/semaine</span>
        <span v-if="employee.daysOff.length"
          >Days off : {{ employee.daysOff.join(", ") }}</span
        >
      </CardContent>
    </Card>
    <add-employee-form
      :key="openEditForm.toString()"
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

const store = useStore();
const employees = computed(() => store.employees);
const openEditForm = ref(false);
const employeeToEdit = ref<Employee>();
watch(openEditForm, (v) => {
  if (!v) {
    employeeToEdit.value = undefined;
  }
});
const removeEmployee = (name: string) => {
  store.removeEmployee(name);
};
</script>

<style scoped>
/* Ajoute des styles ici */
</style>
