<script setup lang="ts">
import { ArrayElement } from "@/store";
import { ref, computed } from "vue";
import { Days } from "@/store/childStore";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
const list = ref([
  {
    id: 1,
    active: false,
    day: "monday",
    name: "marine",
    start: "7:30",
    end: "18:30",
  },
  { id: 2, active: true, day: "monday" },
  { id: 3, active: false, day: "monday" },
  { id: 4, active: false, day: "tuesday" },
  { id: 5, active: false, day: "tuesday" },
  { id: 6, active: false, day: "tuesday" },
]);
const interval = ref();
function onLeave(event, direct: boolean) {
  event.stopPropagation();
  event.preventDefault();
  clearInterval(interval.value);
  // if (!evt.dataTransfer) {
  //   return;
  // }
  const itemID = currentDrag.value.itemID;
  const start = currentDrag.value.start;
  const end = currentDrag.value.end;
  const day = currentDrag.value.day;
  const isStart = currentDrag.value.isStart;
  interval.value = setTimeout(
    () => {
      const currentItem = schedule.value[day]?.employee?.find(
        (el) => el.name === itemID,
      );
      const currentTime = currentItem.hours.find(
        (c) => c.id === parseInt(currentDrag.value?.hourId),
      );
      currentTime.start = new Date(start);

      currentTime.end = new Date(end);
    },
    direct ? 0 : 300,
  );
}
const currentDrag = ref<{
  itemID: string;
  start: string;
  end: string;
  day: string;
  isStart: string;
  isEnd: string;
  active: string;
  currentDate: string;
  hourId: string;
}>();
function startDrag(
  evt: DragEvent,
  hours: ArrayElement<
    ArrayElement<typeof schedule.value.Monday.employee>["hours"]
  >,
  employee: ArrayElement<typeof schedule.value.Monday.employee>,
  day: string,
  isDateBetween: { start: boolean; end: boolean; active: boolean },
  currentDate: Date,
) {
  currentDrag.value = {
    itemID: employee.name,
    start: hours.start.toString(),
    end: hours.end.toString(),
    day: day,
    isStart: isDateBetween.start.toString(),
    isEnd: isDateBetween.end.toString(),
    active: isDateBetween.active.toString(),
    currentDate: currentDate.toString(),
    hourId: hours.id.toString(),
  };
}
function onDrop(evt: DragEvent, currentTime: Date) {
  if (!currentDrag.value) {
    return;
  }
  clearInterval(interval.value);

  const itemID = currentDrag.value.itemID;
  const start = currentDrag.value.start;
  const end = currentDrag.value.end;
  const day = currentDrag.value.day;
  const isStart = currentDrag.value.isStart;
  const isEnd = currentDrag.value.isEnd;
  const currentDate = currentDrag.value.currentDate;
  const hourId = currentDrag.value.hourId;

  const currentEmployee = schedule.value[day]?.employee?.find(
    (el: ArrayElement<typeof schedule.value.Monday.employee>) =>
      el.name === itemID,
  ) as ArrayElement<typeof schedule.value.Monday.employee>;
  const currentItem = currentEmployee.hours.find(
    (cE) => cE.id === parseInt(hourId),
  );

  if (!currentItem) {
    return;
  }
  const newCurrentTime = new Date(currentTime);
  if (isStart === "true") {
    if (newCurrentTime.getTime() >= new Date(currentDrag.value.end).getTime()) {
      currentItem.start = newCurrentTime;
      currentItem.end = new Date(newCurrentTime.getTime() + 30 * 60000);
      return;
    }
    currentEmployee.hours
      .filter((h) => h.id !== parseInt(hourId))
      .forEach((el) => {
        if (newCurrentTime.getTime() < el.end.getTime()) {
          el.end = newCurrentTime;
          return;
        }
      });
    currentItem.start = newCurrentTime;
  } else if (isEnd === "true") {
    if (
      newCurrentTime.getTime() <= new Date(currentDrag.value.start).getTime()
    ) {
      currentItem.start = new Date(newCurrentTime.getTime() - 30 * 60000);
      currentItem.end = newCurrentTime;
      return;
    }
    currentEmployee.hours
      .filter((h) => h.id !== parseInt(hourId))
      .forEach((el) => {
        if (newCurrentTime.getTime() > el.start.getTime()) {
          el.start = new Date(newCurrentTime.getTime() + 30 * 60000);
          return;
        }
      });
    currentItem.end = new Date(newCurrentTime.getTime() + 30 * 60000);
  } else {
    const diffHours =
      new Date(currentDate).getTime() - new Date(newCurrentTime).getTime();
    currentItem.start = new Date(new Date(start).getTime() - diffHours);
    currentItem.end = new Date(new Date(end).getTime() - diffHours);
  }
}

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

function getMondayDate(d: Date) {
  let initialDate = new Date(d); // Date initiale
  let dates = [];

  for (let i = 0; i <= 22; i++) {
    dates.push(addMinutes(initialDate, i * 30)); // Ajoute des dates espacées de 30 minutes
  }

  return dates;
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

function deleteHour(day: Days, nameEmployee: string, hourId: number) {
  const currentEmployee = schedule.value[day].employee.find(
    (el) => el.name === nameEmployee,
  );
  const curentHours = currentEmployee.hours.findIndex((el) => el.id === hourId);
  currentEmployee.hours.splice(curentHours, 1);
}
function isDateBetween(date: Date, hours: { start: Date; end: Date }) {
  return {
    start: date.getTime() === hours.start.getTime(),
    end:
      date.getTime() === new Date(hours.end.getTime() - 30 * 60000).getTime(),
    active: date >= hours.start && date < hours.end,
  };
}
</script>
<template>
  <div class="flex flex-col gap-[70px] pt-12">
    <div class="flex" v-for="(currentDay, key) in schedule">
      <div class="pr-8">{{ key }}</div>
      <div class="flex w-full max-w-[1000px]">
        <div
          v-for="(currentTime, indexTime) in getMondayDate(currentDay.date)"
          class="w-[12%] flex flex-col gap-2 relative pt-2 group"
          :data-date="currentTime"
          @drop="onDrop($event, currentTime)"
          @dragover.prevent="onDrop($event, currentTime)"
          @dragenter.prevent
          @dragleave.prevent="onLeave($event)"
        >
          <!-- Childs -->
          <template v-for="timeChild in currentDay.childs">
            <div
              class="w-full h-[15px] font-bold overflow-visible absolute -top-4"
              v-if="
                timeChild.number && isDateBetween(currentTime, timeChild).active
              "
              :class="[
                { 'bg-blue-400': isDateBetween(currentTime, timeChild).active },
                {
                  'rounded-l-[8px]': isDateBetween(currentTime, timeChild)
                    .start,
                },
                {
                  'rounded-r-[8px]': isDateBetween(currentTime, timeChild).end,
                },
              ]"
            >
              <div
                class="capitalize pl-1 text-[10px] absolute left-0 z-[1] text-white"
                v-if="isDateBetween(currentTime, timeChild).start"
              >
                👶 {{ timeChild.number }}
              </div>
            </div>
          </template>

          <!-- Time Bar -->
          <div
            class="absolute top-[-35px] text-xs -rotate-45"
            :class="indexTime % 2 === 1 ? 'text-xs' : 'text-[8px]'"
          >
            {{ indexTime % 2 === 1 ? `${currentTime.getHours()}` : 30 }}
          </div>
          <div
            class="absolute h-[calc(100%+15px)] top-[-15px] border border-foreground"
            :class="indexTime % 2 === 1 ? ' opacity-30' : 'opacity-10'"
          ></div>

          <!-- Time -->
          <template v-for="dayEmployee in currentDay.employee">
            <div
              v-for="timeEmployee in dayEmployee.hours"
              class="w-full h-[24px] relative overflow-visible"
              @dragstart="
                startDrag(
                  $event,
                  timeEmployee,
                  dayEmployee,
                  key,
                  isDateBetween(currentTime, timeEmployee),
                  currentTime,
                )
              "
              :draggable="isDateBetween(currentTime, timeEmployee).active"
              :class="[
                {
                  'bg-red-400': isDateBetween(currentTime, timeEmployee).active,
                },
                {
                  'rounded-l-[8px]': isDateBetween(currentTime, timeEmployee)
                    .start,
                },
                {
                  'rounded-r-[8px]': isDateBetween(currentTime, timeEmployee)
                    .end,
                },
                {
                  'hover:bg-red-500 !cursor-ew-resize':
                    isDateBetween(currentTime, timeEmployee).start ||
                    isDateBetween(currentTime, timeEmployee).end,
                },
                isDateBetween(currentTime, timeEmployee).active
                  ? `${dayEmployee.name}-${key} cursor-grab active:cursor-grabbing`
                  : ' ',
              ]"
            >
              <div
                class="capitalize pl-2 absolute left-0 z-[1] text-white"
                v-if="isDateBetween(currentTime, timeEmployee).start"
              >
                {{ dayEmployee.name }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
