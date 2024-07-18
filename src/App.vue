<template>
  <div class="container mx-auto p-4">
    <Toaster />

    <h1 class="text-2xl font-bold mb-4">Gestion de Planning de Crèche</h1>

    <section class="mb-8">
      <EmployeeList />
    </section>

    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-2">Nombre d'enfants par heure</h2>
      <ChildrenInputForm />
    </section>

    <section>
      <h2 class="text-xl font-semibold mb-2">Planning</h2>
      <ScheduleDisplay />
    </section>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import EmployeeList from "./components/EmployeeList.vue";
import ChildrenInputForm from "./components/ChildrenInputForm.vue";
import ScheduleDisplay from "./components/ScheduleDisplay.vue";
import Toaster from "@/components/ui/toast/Toaster.vue";
</script>

<style scoped></style>
