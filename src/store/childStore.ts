import { ref } from "vue";
import { defineStore } from "pinia";
import { StatusEmployeeOrChild } from "@/store/index";

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

export type Child = {
  id: number;
  name: string;
  hours: Record<Days, HoursArray>;
  total: number;
  status: StatusEmployeeOrChild;
};
interface State {
  employees: Employee[];
  childrenPerHour: number[][];
  schedule: (Employee | null)[][][];
}

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const hoursPerDay = 9;

export const useChildStore = defineStore("child", () => {
  const children = ref<Child[]>([]);

  function addChild(c: Omit<Child, "id">) {
    c.id = new Date().getTime();
    children.value.push(c);
  }

  function updateChild(e: Child) {
    const index = children.value.findIndex((c) => c.id === e.id);
    children.value[index] = e;
  }

  function getStatusChild(status: StatusEmployeeOrChild) {
    switch (status) {
      case StatusEmployeeOrChild.SICK:
        return { label: "Malade", icon: "🤒️" };
      case StatusEmployeeOrChild.WORKING:
        return { label: "Créche", icon: "🚼️" };
      case StatusEmployeeOrChild.VACATION:
        return { label: "Vacances", icon: "🏝️" };
      default:
        return "";
    }
  }

  return {
    children,
    addChild,
    updateChild,
    getStatusChild,
  };
});
