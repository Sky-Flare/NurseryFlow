import { ref } from "vue";
import { defineStore } from "pinia";
import { useEmployeeStore } from "@/store/index";
import { Days } from "@/store/childStore";

export type Hour = {
  name: string;
  id: number;
  hours: { id: number; start: Date; end: Date; total: number }[];
};

export const useScheduleStore = defineStore("schedule", () => {
  const { employees } = useEmployeeStore();

  const employeeDisplay = ref(true);

  const schedule = ref<
    Record<
      Partial<Days>,
      {
        date: Date;
        employee: Hour[];
        children: Hour[];
        totalChildren: {
          number: number;
          start: Date;
          end: Date;
        }[];
      }
    >
  >({
    Monday: {
      date: new Date(`August 12, 2024 7:30:00`),
      employee: [
        {
          name: "marine",
          id: 1,
          hours: [
            {
              id: 1,
              start: new Date("August 12, 2024 07:30:00"),
              end: new Date("August 12, 2024 12:30:00"),
              total: 5,
            },
            {
              id: 2,
              start: new Date("August 12, 2024 14:30:00"),
              end: new Date("August 12, 2024 18:30:00"),
              total: 4,
            },
          ],
        },
        {
          name: "fanny",
          id: 2,
          hours: [
            {
              id: 1,
              start: new Date("August 12, 2024 10:00:00"),
              end: new Date("August 12, 2024 15:30:00"),
              total: 5.5,
            },
          ],
        },
      ],
      children: [
        {
          name: "robin",
          id: 1,
          hours: [
            {
              id: 1,
              start: new Date("August 12, 2024 07:30:00"),
              end: new Date("August 12, 2024 12:30:00"),
              total: 5,
            },
          ],
        },
        {
          name: "fanny",
          id: 2,
          hours: [
            {
              id: 1,
              start: new Date("August 12, 2024 10:00:00"),
              end: new Date("August 12, 2024 15:30:00"),
              total: 5.5,
            },
          ],
        },
      ],
      totalChildren: [
        {
          number: 0,
          start: new Date("August 12, 2024 07:30:00"),
          end: new Date("August 12, 2024 09:30:00"),
        },
        {
          number: 4,
          start: new Date("August 12, 2024 09:30:00"),
          end: new Date("August 12, 2024 12:30:00"),
        },
        {
          number: 11,
          start: new Date("August 12, 2024 12:30:00"),
          end: new Date("August 12, 2024 17:30:00"),
        },
        {
          number: 6,
          start: new Date("August 12, 2024 17:30:00"),
          end: new Date("August 12, 2024 18:30:00"),
        },
      ],
    },
    Tuesday: {
      date: new Date(`August 13, 2024 7:30:00`),
      employee: [
        {
          name: "marine",
          id: 1,
          hours: [
            {
              id: 1,
              start: new Date("August 13, 2024 07:30:00"),
              end: new Date("August 13, 2024 12:00:00"),
              total: 4.5,
            },
          ],
        },
        {
          name: "fanny",
          id: 2,
          hours: [
            {
              id: 1,
              start: new Date("August 13, 2024 12:00:00"),
              end: new Date("August 13, 2024 17:30:00"),
              total: 5.5,
            },
          ],
        },
      ],
      children: [
        {
          name: "robin",
          id: 1,
          hours: [
            {
              id: 1,
              start: new Date("August 13, 2024 07:30:00"),
              end: new Date("August 13, 2024 12:30:00"),
              total: 5,
            },
          ],
        },
        {
          name: "fanny",
          id: 2,
          hours: [
            {
              id: 1,
              start: new Date("August 13, 2024 10:00:00"),
              end: new Date("August 13, 2024 15:30:00"),
              total: 5.5,
            },
          ],
        },
      ],
      totalChildren: [
        {
          number: 0,
          start: new Date("August 13, 2024 07:30:00"),
          end: new Date("August 13, 2024 09:30:00"),
        },
        {
          number: 4,
          start: new Date("August 13, 2024 09:30:00"),
          end: new Date("August 13, 2024 12:30:00"),
        },
        {
          number: 11,
          start: new Date("August 13, 2024 12:30:00"),
          end: new Date("August 13, 2024 17:30:00"),
        },
        {
          number: 6,
          start: new Date("August 13, 2024 17:30:00"),
          end: new Date("August 13, 2024 18:30:00"),
        },
      ],
    },
    Wednesday: {
      date: new Date(`August 14, 2024 7:30:00`),
      employee: [
        {
          name: "marine",
          id: 1,
          hours: [
            {
              id: 1,
              start: new Date("August 14, 2024 07:30:00"),
              end: new Date("August 14, 2024 12:00:00"),
              total: 4.5,
            },
          ],
        },
        {
          name: "fanny",
          id: 2,
          hours: [
            {
              id: 1,
              start: new Date("August 14, 2024 12:00:00"),
              end: new Date("August 14, 2024 17:30:00"),
              total: 5.5,
            },
          ],
        },
      ],
      children: [
        {
          name: "robin",
          id: 1,
          hours: [
            {
              id: 1,
              start: new Date("August 14, 2024 07:30:00"),
              end: new Date("August 14, 2024 12:30:00"),
              total: 5,
            },
          ],
        },
        {
          name: "fanny",
          id: 2,
          hours: [
            {
              id: 1,
              start: new Date("August 14, 2024 10:00:00"),
              end: new Date("August 14, 2024 15:30:00"),
              total: 5.5,
            },
          ],
        },
      ],
      totalChildren: [
        {
          number: 0,
          start: new Date("August 14, 2024 07:30:00"),
          end: new Date("August 14, 2024 09:30:00"),
        },
        {
          number: 4,
          start: new Date("August 14, 2024 09:30:00"),
          end: new Date("August 14, 2024 12:30:00"),
        },
        {
          number: 11,
          start: new Date("August 14, 2024 12:30:00"),
          end: new Date("August 14, 2024 17:30:00"),
        },
        {
          number: 6,
          start: new Date("August 14, 2024 17:30:00"),
          end: new Date("August 14, 2024 18:30:00"),
        },
      ],
    },
    Thursday: {
      date: new Date(`August 15, 2024 7:30:00`),
      employee: [
        {
          name: "marine",
          id: 1,
          hours: [
            {
              id: 1,
              start: new Date("August 15, 2024 07:30:00"),
              end: new Date("August 15, 2024 12:00:00"),
              total: 4.5,
            },
          ],
        },
        {
          name: "fanny",
          id: 2,
          hours: [
            {
              id: 1,
              start: new Date("August 15, 2024 12:00:00"),
              end: new Date("August 15, 2024 17:30:00"),
              total: 5.5,
            },
          ],
        },
      ],
      children: [
        {
          name: "robin",
          id: 1,
          hours: [
            {
              id: 1,
              start: new Date("August 15, 2024 07:30:00"),
              end: new Date("August 15, 2024 12:30:00"),
              total: 5,
            },
          ],
        },
        {
          name: "fanny",
          id: 2,
          hours: [
            {
              id: 1,
              start: new Date("August 15, 2024 10:00:00"),
              end: new Date("August 15, 2024 15:30:00"),
              total: 5.5,
            },
          ],
        },
      ],
      totalChildren: [
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
    Friday: {
      date: new Date(`August 16, 2024 7:30:00`),
      employee: [
        {
          name: "marine",
          id: 1,
          hours: [
            {
              id: 1,
              start: new Date("August 16, 2024 07:30:00"),
              end: new Date("August 16, 2024 12:00:00"),
              total: 4.5,
            },
          ],
        },
        {
          name: "fanny",
          id: 2,
          hours: [
            {
              id: 1,
              start: new Date("August 16, 2024 12:00:00"),
              end: new Date("August 16, 2024 17:30:00"),
              total: 5.5,
            },
          ],
        },
      ],
      children: [
        {
          name: "robin",
          id: 1,
          hours: [
            {
              id: 1,
              start: new Date("August 16, 2024 07:30:00"),
              end: new Date("August 16, 2024 12:30:00"),
              total: 5,
            },
          ],
        },
        {
          name: "fanny",
          id: 2,
          hours: [
            {
              id: 1,
              start: new Date("August 16, 2024 10:00:00"),
              end: new Date("August 16, 2024 15:30:00"),
              total: 5.5,
            },
          ],
        },
      ],
      totalChildren: [
        {
          number: 0,
          start: new Date("August 16, 2024 07:30:00"),
          end: new Date("August 16, 2024 09:30:00"),
        },
        {
          number: 4,
          start: new Date("August 16, 2024 09:30:00"),
          end: new Date("August 16, 2024 12:30:00"),
        },
        {
          number: 11,
          start: new Date("August 16, 2024 12:30:00"),
          end: new Date("August 16, 2024 17:30:00"),
        },
        {
          number: 6,
          start: new Date("August 16, 2024 17:30:00"),
          end: new Date("August 16, 2024 18:30:00"),
        },
      ],
    },
  });

  function addHoursOfDay(employee: Hour, day: Days, currentTime: number) {
    console.log(employee, day, currentTime);
    const currentEmployee = schedule.value[day]?.employee.find(
      (el) => el.name === employee.name,
    );
    currentEmployee?.hours.push({
      id: currentEmployee.hours.length + 1,
      start: new Date(currentTime),
      end: new Date(new Date(currentTime).getTime() + 60 * 60000),
      total: 1,
    });
  }

  function addEmployeeOfOneDay(id: number, day: Days) {
    const currentDay = schedule.value[day].date;
    const employee = employees.find((el) => el.id === id);
    const newHour = {
      name: employee?.name,
      id: employee?.id,
      hours: [
        {
          id: 1,
          start: currentDay,
          end: new Date(currentDay.getTime() + 120 * 60000),
          total: 2,
        },
      ],
    } as Hour;
    schedule.value[day].employee.push(newHour);
  }

  function deleteHour(day: Days, nameEmployee: string, hourId: number) {
    const currentEmployee = schedule.value[day]?.employee.find(
      (el) => el.name === nameEmployee,
    );
    const curentHours = currentEmployee?.hours.findIndex(
      (el) => el.id === hourId,
    );
    if (!curentHours) {
      return;
    }
    currentEmployee?.hours.splice(curentHours, 1);
  }

  function addMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes * 60000);
  }
  function getTimeSlot(d: Date) {
    let initialDate = new Date(d); // Date initiale
    let dates = [];

    for (let i = 0; i <= 22; i++) {
      dates.push(addMinutes(initialDate, i * 30));
    }

    return dates;
  }

  function toggleUserTypeDisplayed() {
    console.log("icic", employeeDisplay.value);
    employeeDisplay.value = !employeeDisplay.value;
    console.log("icic 2", employeeDisplay.value);
  }

  return {
    schedule,
    addHoursOfDay,
    getTimeSlot,
    addEmployeeOfOneDay,
    employeeDisplay,
    toggleUserTypeDisplayed,
    deleteHour,
  };
});
