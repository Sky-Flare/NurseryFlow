import { ref } from "vue";
import { defineStore } from "pinia";
import { StatusEmployeeOrChild, useEmployeeStore } from "@/store/index";
import { Days, useChildStore } from "@/store/childStore";

export type Hour = {
  name: string;
  id: number;
  hours: { id: number; start: Date; end: Date; total: number }[];
};

export const useScheduleStore = defineStore("schedule", () => {
  const { employees } = useEmployeeStore();
  const { children } = useChildStore();

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

  function generateSchedule(date: Date) {
    const schedule = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ].reduce((acc, day, index) => {
      const currentDate = new Date(date);
      currentDate.setDate(date.getDate() + index);
      acc[day] = {
        date: currentDate,
        employee: [],
        children: [],
        totalChildren: [],
      };
      return acc;
    }, {});

    const childrenToWork = children.filter(
      (c) => c.status === StatusEmployeeOrChild.WORKING,
    );

    childrenToWork.forEach((child) => {
      for (const [key, value] of Object.entries(child.hours)) {
        const currentDate = new Date(schedule[key].date);
        if (value.start && value.end) {
          const [startHour, startMinute] = value.start.split(":")?.map(Number);
          const [endHour, endMinute] = value.end.split(":")?.map(Number);
          schedule[key].children.push({
            name: child.name,
            id: child.id,
            hours: [
              {
                start: new Date(
                  new Date(currentDate).setHours(startHour, startMinute),
                ),
                end: new Date(
                  new Date(currentDate).setHours(endHour, endMinute),
                ),
              },
            ],
          });
        }
      }
    });

    for (const [key, value] of Object.entries(schedule)) {
      console.log(key);
      const d = new Date(value.date);
      d.setHours(7);
      d.setMinutes(30);
      d.setSeconds(0);
      const slots = getTimeSlot(d).map((s) => {
        return { date: s, children: [] };
      });
      slots.forEach((slot) => {
        value.children.forEach((child) => {
          if (
            !slot.children.includes(child) &&
            slot.date.getTime() >= child.hours[0].start.getTime() &&
            slot.date.getTime() < child.hours[0].end.getTime()
          ) {
            slot.children.push(child);
          }
        });
      });
      console.log("slot", slots);
      let currentNbChild = 0;
      let currentStart: Date | null = null;
      const totalChild = [];
      slots.forEach((s, index) => {
        if (
          currentNbChild !== 0 &&
          currentStart &&
          currentNbChild !== s.children.length
        ) {
          totalChild.push({
            number: currentNbChild,
            start: currentStart,
            end: s.date,
          });
          currentNbChild = s.children.length;
          currentStart = s.date;
        } else if (s.children.length) {
          if (!currentStart) {
            currentStart = s.date;
          }
          currentNbChild = s.children.length;
        }
      });
      console.log(totalChild);
    }

    console.log(schedule);
    //todo add children
    //todo calcul totalChildren
  }

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
  generateSchedule(new Date("Mon Jul 29 2024"));
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
