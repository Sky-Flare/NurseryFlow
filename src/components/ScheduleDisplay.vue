<template>
  <div>
    <h2>Planning</h2>
    <div v-if="employees?.length > 0">
      <button @click="generateSchedule">Générer le planning</button>
      <div v-if="schedule?.length > 0">
        <table>
          <thead>
            <tr>
              <th>Jour</th>
              <th v-for="hour in hours" :key="hour">{{ hour }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(day, index) in days" :key="day">
              <td>{{ day }}</td>
              <td v-for="hour in hours" :key="hour">
                <div v-if="getEmployeesForDayHour(day, hour).length > 0">
                  <div
                    v-for="employee in getEmployeesForDayHour(day, hour).sort(
                      (a, b) => a.name.localeCompare(b.name)
                    )"
                    :key="employee?.name"
                  >
                    {{ employee?.name }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else>
      <p>Aucun employé ajouté.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "../store/index";

const store = useStore();
const employees = computed(() => store.employees);
const schedule = computed(() => store.schedule);

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const hours = Array.from({ length: 9 }, (_, i) => `${9 + i}h`);

const generateSchedule = () => {
  console.log("generateSchedule");

  store.generateSchedule();
};

const getEmployeesForDayHour = (day: string, hour: string) => {
  const dayIndex = days.indexOf(day);
  const hourIndex = parseInt(hour) - 9;

  return schedule.value[dayIndex][hourIndex];
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}
</style>
