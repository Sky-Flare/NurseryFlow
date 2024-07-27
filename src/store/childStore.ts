import { ref } from "vue";
import { defineStore } from "pinia";
import { StatusEmployeeOrChild } from "@/store/index";

export interface Employee {
  name: string;
  hoursPerWeek: number;
  daysOff: string[];
}
export type Days = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

export type HoursArray = { start: string; end: string; total: number | string };

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
  const children = ref<Child[]>([
    {
      name: "helene",
      hours: {
        Monday: { start: "9:00", end: "16:30", total: 7.5 },
        Tuesday: { start: "10:00", end: "17:30", total: 7.5 },
        Wednesday: { start: "8:30", end: "13:00", total: 4.5 },
        Thursday: { start: "", end: "", total: "" },
        Friday: { start: "8:30", end: "16:00", total: 7.5 },
      },
      total: 27,
      status: StatusEmployeeOrChild.WORKING,
      id: 0,
    },
    {
      name: "guillaume",
      hours: {
        Monday: { start: "8:30", end: "16:00", total: 7.5 },
        Tuesday: { start: "9:00", end: "17:00", total: 8 },
        Wednesday: { start: "", end: "", total: "" },
        Thursday: { start: "9:30", end: "16:30", total: 7 },
        Friday: { start: "8:00", end: "17:30", total: 9.5 },
      },
      total: 32,
      status: StatusEmployeeOrChild.WORKING,
      id: 1,
    },
    {
      name: "abby",
      hours: {
        Monday: { start: "11:00", end: "18:30", total: 7.5 },
        Tuesday: { start: "12:30", end: "18:30", total: 6 },
        Wednesday: { start: "7:30", end: "15:00", total: 7.5 },
        Thursday: { start: "8:00", end: "14:30", total: 6.5 },
        Friday: { start: "", end: "", total: "" },
      },
      total: 27.5,
      status: StatusEmployeeOrChild.WORKING,
      id: 2,
    },
    {
      name: "capucine",
      hours: {
        Monday: { start: "9:00", end: "17:30", total: 8.5 },
        Tuesday: { start: "11:00", end: "17:00", total: 6 },
        Wednesday: { start: "", end: "", total: "" },
        Thursday: { start: "7:30", end: "16:30", total: 9 },
        Friday: { start: "", end: "", total: "" },
      },
      total: 23.5,
      status: StatusEmployeeOrChild.WORKING,
      id: 3,
    },
    {
      name: "leon",
      hours: {
        Monday: { start: "", end: "", total: "" },
        Tuesday: { start: "9:00", end: "17:00", total: 8 },
        Wednesday: { start: "9:00", end: "17:00", total: 8 },
        Thursday: { start: "10:30", end: "18:30", total: 8 },
        Friday: { start: "8:30", end: "15:30", total: 7 },
      },
      total: 31,
      status: StatusEmployeeOrChild.WORKING,
      id: 4,
    },
    {
      name: "martin",
      hours: {
        Monday: { start: "7:30", end: "14:30", total: 7 },
        Tuesday: { start: "", end: "", total: "" },
        Wednesday: { start: "8:30", end: "17:30", total: 9 },
        Thursday: { start: "", end: "", total: "" },
        Friday: { start: "7:30", end: "12:00", total: 4.5 },
      },
      total: 20.5,
      status: StatusEmployeeOrChild.WORKING,
      id: 5,
    },
    {
      name: "valentine",
      hours: {
        Monday: { start: "9:00", end: "15:00", total: 6 },
        Tuesday: { start: "7:30", end: "17:00", total: 9.5 },
        Wednesday: { start: "9:00", end: "15:30", total: 6.5 },
        Thursday: { start: "7:30", end: "17:30", total: 10 },
        Friday: { start: "10:30", end: "17:00", total: 6.5 },
      },
      total: 38.5,
      status: StatusEmployeeOrChild.WORKING,
      id: 6,
    },
    {
      name: "juliette",
      hours: {
        Monday: { start: "9:30", end: "17:00", total: 7.5 },
        Tuesday: { start: "9:00", end: "17:30", total: 8.5 },
        Wednesday: { start: "10:30", end: "15:00", total: 4.5 },
        Thursday: { start: "8:00", end: "17:00", total: 9 },
        Friday: { start: "", end: "", total: "" },
      },
      total: 29.5,
      status: StatusEmployeeOrChild.WORKING,
      id: 7,
    },
    {
      name: "jocelyn",
      hours: {
        Monday: { start: "", end: "", total: "" },
        Tuesday: { start: "", end: "", total: "" },
        Wednesday: { start: "7:30", end: "17:00", total: 9.5 },
        Thursday: { start: "7:30", end: "15:00", total: 7.5 },
        Friday: { start: "", end: "", total: "" },
      },
      total: 17,
      status: StatusEmployeeOrChild.WORKING,
      id: 8,
    },
  ]);

  function addChild(c: Omit<Child, "id">) {
    children.value.push({ ...c, id: children.value.length });
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
