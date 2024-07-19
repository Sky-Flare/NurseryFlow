import { ref } from "vue";
import { defineStore } from "pinia";

export interface Employee {
  name: string;
  hoursPerWeek: number;
  daysOff: string[];
}
export type Days =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type HoursArray = { start: string; end: string; total: number };

export interface Child {
  id: number;
  name: string;
  hours: Record<Days, HoursArray>;
  total: number;
}
interface State {
  employees: Employee[];
  childrenPerHour: number[][];
  schedule: (Employee | null)[][][];
}

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const hoursPerDay = 9;

export const useStore = defineStore("child", () => {
  const children = ref<Child[]>([]);

  function addChild(c: Omit<Child, "id">) {
    c.id = new Date().getTime();
    children.value.push(c);
  }

  function updateChild(e: Child) {
    const index = children.value.findIndex((c) => c.id === e.id);
    children.value[index] = e;
  }

  return {
    children,
    addChild,
    updateChild,
  };
});
