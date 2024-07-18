<template>
  <form @submit.prevent="submitChildren">
    <div v-for="(day, dayIndex) in days" :key="day">
      <h3>{{ day }}</h3>
      <div v-for="hourIndex in hours" :key="hourIndex">
        <label :for="`children-${dayIndex}-${hourIndex}`"
          >{{ hourIndex + 7 }}h</label
        >
        <input
          :id="`children-${dayIndex}-${hourIndex}`"
          v-model.number="children[dayIndex][hourIndex]"
          type="number"
          min="0"
        />
      </div>
    </div>
    <button type="submit">Enregistrer</button>
  </form>
</template>

<script lang="ts" setup>
import { useStore } from "../store/index";
import { ref } from "vue";

const store = useStore();
const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const hours = Array.from({ length: 11 }, (_, i) => i);

const children = ref(
  Array.from({ length: days.length }, () => Array(hours.length).fill(0))
);

const submitChildren = () => {
  console.log(children.value);

  store.setChildrenPerHour(children.value);
};
</script>

<style scoped>
/* Ajoute des styles ici */
</style>
