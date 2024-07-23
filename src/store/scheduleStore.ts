import { ref } from "vue";
import { defineStore } from "pinia";
import { ArrayElement, StatusEmployee } from "@/store/index";
import { schedule } from "@/store/drag";
import { Days } from "@/store/childStore";

export const useScheduleStore = defineStore("schedule", () => {
  const schedule = ref({
    Monday: {
      date: new Date(`August 15, 2024 7:30:00`),
      employee: [
        {
          name: "marine",
          hours: [
            {
              id: 1,
              start: new Date("August 15, 2024 07:30:00"),
              end: new Date("August 15, 2024 16:30:00"),
            },
            {
              id: 2,
              start: new Date("August 15, 2024 17:00:00"),
              end: new Date("August 15, 2024 18:30:00"),
            },
          ],
        },
        {
          name: "fanny",
          hours: [
            {
              id: 1,
              start: new Date("August 15, 2024 10:00:00"),
              end: new Date("August 15, 2024 15:30:00"),
            },
          ],
        },
      ],
      childs: [
        {
          number: 0,
          start: new Date("August 15, 2024 07:30:00"),
          end: new Date("August 15, 2024 09:30:00"),
        },
        {
          number: 4,
          start: new Date("August 15, 2024 09:30:00"),
          end: new Date("August 15, 2024 12:30:00"),
        },
        {
          number: 11,
          start: new Date("August 15, 2024 12:30:00"),
          end: new Date("August 15, 2024 17:30:00"),
        },
        {
          number: 6,
          start: new Date("August 15, 2024 17:30:00"),
          end: new Date("August 15, 2024 18:30:00"),
        },
      ],
    },
    Tuesday: {
      date: new Date(`August 16, 2024 7:30:00`),
      employee: [
        {
          name: "marine",
          hours: [
            {
              id: 1,
              start: new Date("August 16, 2024 07:30:00"),
              end: new Date("August 16, 2024 12:00:00"),
            },
          ],
        },
        {
          name: "fanny",
          hours: [
            {
              id: 1,
              start: new Date("August 16, 2024 12:00:00"),
              end: new Date("August 16, 2024 17:30:00"),
            },
          ],
        },
      ],
      childs: [
        {
          number: 3,
          start: new Date("August 16, 2024 07:30:00"),
          end: new Date("August 16, 2024 10:30:00"),
        },
        {
          number: 7,
          start: new Date("August 16, 2024 10:30:00"),
          end: new Date("August 16, 2024 12:30:00"),
        },
        {
          number: 8,
          start: new Date("August 16, 2024 12:30:00"),
          end: new Date("August 16, 2024 16:30:00"),
        },
        {
          number: 4,
          start: new Date("August 16, 2024 16:30:00"),
          end: new Date("August 16, 2024 18:30:00"),
        },
      ],
    },
  });

  function addHoursOfDay(
    employee: ArrayElement<typeof schedule.value.Monday.employee>,
    day: Days,
    currentTime: number,
  ) {
    console.log(employee, day, currentTime);
    const currentEmployee = schedule.value[day].employee.find(
      (el) => el.name === employee.name,
    );
    currentEmployee.hours.push({
      id: currentEmployee.hours.length + 1,
      start: new Date(currentTime),
      end: new Date(new Date(currentTime).getTime() + 60 * 60000),
    });
  }

  function deleteHour(day: Days, nameEmployee: string, hourId: number) {
    const currentEmployee = schedule[day].employee.find(
      (el) => el.name === nameEmployee,
    );
    const curentHours = currentEmployee.hours.findIndex(
      (el) => el.id === hourId,
    );
    currentEmployee.hours.splice(curentHours, 1);
  }

  function addMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes * 60000);
  }
  function getTimeSlot(d: Date) {
    let initialDate = new Date(d); // Date initiale
    let dates = [];

    for (let i = 0; i <= 22; i++) {
      dates.push(addMinutes(initialDate, i * 30)); // Ajoute des dates espacées de 30 minutes
    }

    return dates;
  }

  return {
    schedule,
    addHoursOfDay,
    getTimeSlot,
  };
});
