import { ref } from "vue";
import { useScheduleStore } from "@/store/scheduleStore";
import { ArrayElement } from "@/store/index";

export const currentDrag = ref<{
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

export const useDragAndDrop = () => {
  const { schedule } = useScheduleStore();

  const interval = ref();

  function onLeave(event: DragEvent) {
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
    interval.value = setTimeout(() => {
      const currentItem = schedule[day]?.employee?.find(
        (el) => el.name === itemID,
      );
      const currentTime = currentItem.hours.find(
        (c) => c.id === parseInt(currentDrag.value?.hourId),
      );
      currentTime.start = new Date(start);

      currentTime.end = new Date(end);
      currentDrag.value = undefined;
    }, 300);
  }

  function onDrop(evt: DragEvent, currentTime: Date, drop = false) {
    if (!currentDrag.value) {
      evt.preventDefault();
      evt.stopPropagation();
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
    console.log(itemID, start, hourId, day);
    const currentEmployee = schedule[day]?.employee?.find(
      (el: ArrayElement<typeof schedule.Monday.employee>) => el.name === itemID,
    ) as ArrayElement<typeof schedule.Monday.employee>;
    console.log("currentEmployee", currentEmployee);
    const currentHour = currentEmployee.hours.find(
      (cE) => cE.id === parseInt(hourId),
    );

    if (!currentHour) {
      return;
    }
    const newCurrentTime = new Date(currentTime);
    const newEndHour = new Date(
      new Date(currentHour.end).getTime() - 30 * 60000,
    );

    if (isStart === "true") {
      console.log('isStart === "true"');
      //prevent change same hour
      if (
        newCurrentTime.getTime() >=
        new Date(new Date(currentDrag.value.end).getTime()).getTime()
      ) {
        currentHour.start = newCurrentTime;
        currentHour.end = new Date(
          new Date(newCurrentTime).getTime() + 30 * 60000,
        );
        return;
      }
      //prevent change other hours
      currentEmployee.hours
        .filter((h) => h.id !== parseInt(hourId))
        .forEach((el) => {
          if (
            newCurrentTime.getTime() < el.end.getTime() + 30 * 60000 &&
            newCurrentTime.getTime() > el.start.getTime()
          ) {
            el.end = newCurrentTime;
          }
        });
      currentHour.start = newCurrentTime;
    } else if (isEnd === "true") {
      //prevent change same hour
      if (
        newCurrentTime.getTime() <= new Date(currentDrag.value.start).getTime()
      ) {
        currentHour.start = new Date(newCurrentTime.getTime() - 30 * 60000);
        currentHour.end = newCurrentTime;
        return;
      }
      //prevent change other hours
      currentEmployee.hours
        .filter((h) => h.id !== parseInt(hourId))
        .forEach((el) => {
          if (
            newCurrentTime.getTime() > el.start.getTime() - 30 * 60000 &&
            newCurrentTime.getTime() < el.end.getTime()
          ) {
            el.start = new Date(new Date(currentHour.end).getTime());
          }
        });
      currentHour.end = currentTime;
    } else {
      const diffHours =
        new Date(currentDate).getTime() - new Date(newCurrentTime).getTime();
      const newStart = new Date(new Date(start).getTime() - diffHours);
      const newEnd = new Date(new Date(end).getTime() - diffHours);
      currentEmployee.hours
        .filter((h) => h.id !== parseInt(hourId))
        .forEach((el) => {
          // if slide to the left (hours decrease)
          if (diffHours > 0) {
            if (
              newStart.getTime() <= el.end.getTime() &&
              newStart.getTime() > el.start.getTime()
            ) {
              el.end = newStart;
            }
            // if slide to the right (hours increase)
          } else if (diffHours < 0) {
            if (
              newEnd.getTime() >= el.start.getTime() + 30 * 60000 &&
              newEnd.getTime() < el.end.getTime()
            ) {
              el.start = new Date(newEnd.getTime());
            }
          }
        });

      currentHour.start = newStart;
      currentHour.end = newEnd;
    }
    if (drop) {
      currentDrag.value = undefined;
    }
  }

  return {
    onLeave,
    onDrop,
  };
};
