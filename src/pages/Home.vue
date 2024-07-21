<script setup lang="ts">
import { ref, computed } from "vue";
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
function onLeave(evt) {
  clearInterval(interval.value);
  const itemID = evt.dataTransfer.getData("itemID");
  const start = evt.dataTransfer.getData("start");
  const end = evt.dataTransfer.getData("end");
  const day = evt.dataTransfer.getData("day");
  const isStart = evt.dataTransfer.getData("isStart");
  interval.value = setTimeout(() => {
    const currentItem = schedule.value[day]?.employee?.find(
      (el) => el.name === itemID
    );
    console.log(currentItem);
    currentItem.start = new Date(start);

    currentItem.end = new Date(end);

    console.log("onleav", evt, itemID, start, end, day);
  }, 300);
}

function startDrag(
  evt,
  item: (typeof schedule.value.monday.employee)[0],
  day: string,
  isDateBetween: { start: boolean; end: boolean; active: boolean },
  currentDate: Date
) {
  console.log("startDrag", evt, item);
  evt.dataTransfer.dropEffect = "move";
  evt.dataTransfer.effectAllowed = "move";
  evt.dataTransfer.setData("itemID", item.name);
  evt.dataTransfer.setData("start", item.start);
  evt.dataTransfer.setData("end", item.end);
  evt.dataTransfer.setData("day", day);
  evt.dataTransfer.setData("isStart", isDateBetween.start);
  evt.dataTransfer.setData("isEnd", isDateBetween.end);
  evt.dataTransfer.setData("active", isDateBetween.active);
  evt.dataTransfer.setData("currentDate", currentDate);
}
function onDrop(evt, currentTime: Date) {
  clearInterval(interval.value);

  const itemID = evt.dataTransfer.getData("itemID");
  const start = evt.dataTransfer.getData("start");
  const end = evt.dataTransfer.getData("end");
  const day = evt.dataTransfer.getData("day");
  const isStart = evt.dataTransfer.getData("isStart");
  const isEnd = evt.dataTransfer.getData("isEnd");
  const currentDate = evt.dataTransfer.getData("currentDate");

  const currentItem = schedule.value[day]?.employee?.find(
    (el) => el.name === itemID
  );
  const newCurrentTime = new Date(currentTime);
  if (isStart === "true") {
    currentItem.start = new Date(currentTime);
  } else if (isEnd === "true") {
    currentItem.end = new Date(currentTime);
  } else {
    const diffHours =
      new Date(currentDate).getTime() - new Date(newCurrentTime).getTime();
    console.log(Math.floor(diffHours / 1000 / 60)); // Conversion en minutes)
    currentItem.start = new Date(new Date(start).getTime() - diffHours);
    currentItem.end = new Date(new Date(end).getTime() - diffHours);
  }
}

const Monday = computed(() => {
  return list.value.filter((l) => l.day === "monday");
});
const Tuesday = computed(() => {
  return list.value.filter((l) => l.day === "tuesday");
});
const schedule = ref({
  monday: {
    date: new Date(`August 15, 2024 7:30:00`),
    employee: [
      {
        name: "marine",
        start: new Date("August 15, 2024 07:30:00"),
        end: new Date("August 15, 2024 16:30:00"),
      },
      {
        name: "fanny",
        start: new Date("August 15, 2024 10:00:00"),
        end: new Date("August 15, 2024 15:30:00"),
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
        start: new Date("August 15, 2024 10:00:00"),
        end: new Date("August 15, 2024 12:30:00"),
      },
      {
        number: 11,
        start: new Date("August 15, 2024 13:00:00"),
        end: new Date("August 15, 2024 17:30:00"),
      },
      {
        number: 6,
        start: new Date("August 15, 2024 18:00:00"),
        end: new Date("August 15, 2024 18:30:00"),
      },
    ],
  },
  tuesday: {
    date: new Date(`August 16, 2024 7:30:00`),
    employee: [
      {
        name: "marine",
        start: new Date("August 16, 2024 07:30:00"),
        end: new Date("August 16, 2024 12:00:00"),
      },
      {
        name: "fanny",
        start: new Date("August 16, 2024 12:00:00"),
        end: new Date("August 16, 2024 17:30:00"),
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
        start: new Date("August 16, 2024 11:00:00"),
        end: new Date("August 16, 2024 12:30:00"),
      },
      {
        number: 8,
        start: new Date("August 16, 2024 13:00:00"),
        end: new Date("August 16, 2024 16:30:00"),
      },
      {
        number: 4,
        start: new Date("August 16, 2024 17:00:00"),
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

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

function isDateBetween(
  date: Date,
  employee: { employee: string; start: Date; end: Date }
) {
  return {
    start: date.getTime() === employee.start.getTime(),
    end: date.getTime() === employee.end.getTime(),
    active: date >= employee.start && date <= employee.end,
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
          <div
            v-for="timeChild in currentDay.childs"
            class="w-full h-[15px] font-bold overflow-visible absolute -top-4"
            :class="[
              { 'bg-blue-400': isDateBetween(currentTime, timeChild).active },
              {
                'rounded-l-[8px]': isDateBetween(currentTime, timeChild).start,
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

          <!-- Time Bar -->
          <div
            class="absolute top-[-35px] text-xs -rotate-45"
            :class="indexTime % 2 === 1 ? 'text-xs' : 'text-[8px]'"
          >
            {{ indexTime % 2 === 1 ? `${currentTime.getHours()}` : 30 }}
          </div>
          <div
            class="absolute h-[calc(100%+15px)] top-[-15px] border"
            :class="indexTime % 2 === 1 ? 'border-black/30' : 'border-black/10'"
          ></div>

          <!-- Time -->
          <div
            v-for="timeEmployee in currentDay.employee"
            class="w-full h-[24px] relative overflow-visible"
            @dragstart="
              startDrag(
                $event,
                timeEmployee,
                key,
                isDateBetween(currentTime, timeEmployee),
                currentTime
              )
            "
            :draggable="isDateBetween(currentTime, timeEmployee).active"
            :class="[
              { 'bg-red-400': isDateBetween(currentTime, timeEmployee).active },
              {
                'rounded-l-[8px]': isDateBetween(currentTime, timeEmployee)
                  .start,
              },
              {
                'rounded-r-[8px]': isDateBetween(currentTime, timeEmployee).end,
              },
              {
                'hover:bg-red-500':
                  isDateBetween(currentTime, timeEmployee).start ||
                  isDateBetween(currentTime, timeEmployee).end,
              },
              isDateBetween(currentTime, timeEmployee).active
                ? `${timeEmployee.name}-${key} cursor-pointer`
                : ' ',
            ]"
          >
            <div
              class="capitalize pl-2 absolute left-0 z-[1] text-white"
              v-if="isDateBetween(currentTime, timeEmployee).start"
            >
              {{ timeEmployee.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
