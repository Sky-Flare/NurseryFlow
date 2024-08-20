import { ref } from 'vue';
import { Hour, useScheduleStore } from '@/store/scheduleStore';
import { storeToRefs } from 'pinia';
import { Days } from '@/store/employeeStore';

export const currentDrag = ref<{
    itemID: string;
    start: string;
    end: string;
    day: Days;
    isStart: string;
    isEnd: string;
    active: string;
    currentDate: string;
    hourId: string;
}>();

export const useDragAndDrop = () => {
    const ScheduleStore = useScheduleStore();
    const { schedule, employeeDisplay } = storeToRefs(ScheduleStore);

    const timeoutLeaveDrop = ref<ReturnType<typeof setInterval>>();

    function onLeave(event: DragEvent) {
        event.stopPropagation();
        event.preventDefault();
        if (!currentDrag.value) {
            return;
        }

        clearTimeout(timeoutLeaveDrop.value);

        const { itemID } = currentDrag.value;
        const { start } = currentDrag.value;
        const { end } = currentDrag.value;
        const { day } = currentDrag.value;

        if (!day) {
            return;
        }
        timeoutLeaveDrop.value = setTimeout(() => {
            let currentEmployee;
            if (employeeDisplay.value) {
                currentEmployee = schedule.value?.[day]?.employee?.find((el: Hour) => el.name === itemID) as Hour;
            } else {
                currentEmployee = schedule.value?.[day]?.children?.find((el: Hour) => el.name === itemID) as Hour;
            }
            const currentTime = currentEmployee.hours.find((c) => c.id === parseInt(currentDrag.value?.hourId ?? ''));
            if (currentTime) {
                currentTime.start = new Date(start);
                currentTime.end = new Date(end);
            }

            currentDrag.value = undefined;
        }, 300);
    }

    function totalHours(start: Date, end: Date) {
        return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }
    function onDrop(evt: DragEvent, currentTime: Date, drop = false) {
        if (!currentDrag.value) {
            evt.preventDefault();
            evt.stopPropagation();
            return;
        }

        if (currentTime.getDay() !== new Date(currentDrag.value.start).getDay()) {
            return;
        }
        clearTimeout(timeoutLeaveDrop.value);

        const { itemID } = currentDrag.value;
        const { start } = currentDrag.value;
        const { end } = currentDrag.value;
        const { day } = currentDrag.value;
        const { isStart } = currentDrag.value;
        const { isEnd } = currentDrag.value;
        const { currentDate } = currentDrag.value;
        const { hourId } = currentDrag.value;

        let currentEmployee;

        if (employeeDisplay.value) {
            currentEmployee = schedule.value?.[day]?.employee?.find((el: Hour) => el.name === itemID) as Hour;
        } else {
            currentEmployee = schedule.value?.[day]?.children?.find((el: Hour) => el.name === itemID) as Hour;
        }
        const currentHour = currentEmployee.hours.find((cE) => cE.id === parseInt(hourId));

        if (!currentHour) {
            return;
        }
        const newCurrentTime = new Date(currentTime);

        if (isStart === 'true') {
            //prevent change same hour
            if (newCurrentTime.getTime() >= new Date(new Date(currentDrag.value.end).getTime()).getTime()) {
                currentHour.start = newCurrentTime;
                currentHour.end = new Date(new Date(newCurrentTime).getTime() + 30 * 60000);
                currentHour.total = totalHours(currentHour.start, currentHour.end);
                return;
            }
            //prevent change other hours
            const elToDelete: Hour['hours'] = [];
            currentEmployee.hours
                .filter((h) => h.id !== parseInt(hourId))
                .forEach((el) => {
                    if (newCurrentTime.getTime() < el.end.getTime() + 30 * 60000 && newCurrentTime.getTime() > el.start.getTime()) {
                        elToDelete.push(el);
                    }
                });
            if (elToDelete.length > 0) {
                currentEmployee.hours = currentEmployee.hours.filter((el) => !elToDelete.includes(el));
                currentHour.id = elToDelete[0].id < currentHour.id ? elToDelete[0].id : currentHour.id;
                currentHour.start = elToDelete[0].start;
                currentHour.total = totalHours(currentHour.start, currentHour.end);
                currentDrag.value = undefined;
                return;
            }
            currentHour.start = newCurrentTime;
            currentHour.total = totalHours(currentHour.start, currentHour.end);
        } else if (isEnd === 'true') {
            //prevent change same hour
            if (newCurrentTime.getTime() <= new Date(currentDrag.value.start).getTime()) {
                currentHour.start = new Date(newCurrentTime.getTime() - 30 * 60000);
                currentHour.end = newCurrentTime;
                currentHour.total = totalHours(currentHour.start, currentHour.end);
                return;
            }
            //prevent change other hours
            const elToDelete: Hour['hours'] = [];

            currentEmployee.hours
                .filter((h) => h.id !== parseInt(hourId))
                .forEach((el) => {
                    if (newCurrentTime.getTime() > el.start.getTime() - 30 * 60000 && newCurrentTime.getTime() < el.end.getTime()) {
                        elToDelete.push(el);
                    }
                });
            if (elToDelete.length > 0) {
                currentEmployee.hours = currentEmployee.hours.filter((el) => !elToDelete.includes(el));
                currentHour.id = elToDelete[0].id < currentHour.id ? elToDelete[0].id : currentHour.id;
                currentHour.end = elToDelete[0].end;
                currentDrag.value = undefined;
                currentHour.total = totalHours(currentHour.start, currentHour.end);

                return;
            }
            currentHour.total = totalHours(currentHour.start, currentHour.end);

            currentHour.end = new Date(newCurrentTime.getTime() + 30 * 60000);
        } else {
            const diffHours = new Date(currentDate).getTime() - new Date(newCurrentTime).getTime();
            const newStart = new Date(new Date(start).getTime() - diffHours);
            const newEnd = new Date(new Date(end).getTime() - diffHours);
            const elToDelete: Hour['hours'] = [];

            currentEmployee.hours
                .filter((h) => h.id !== parseInt(hourId))
                .forEach((el) => {
                    // if slide to the left (hours decrease)
                    if (diffHours > 0) {
                        if (newStart.getTime() <= el.end.getTime() && newStart.getTime() > el.start.getTime()) {
                            elToDelete.push(el);
                        }
                        // if slide to the right (hours increase)
                    } else if (diffHours < 0) {
                        if (newEnd.getTime() >= el.start.getTime() + 30 * 60000 && newEnd.getTime() < el.end.getTime()) {
                            elToDelete.push(el);
                        }
                    }
                });
            if (elToDelete.length > 0) {
                currentEmployee.hours = currentEmployee.hours.filter((el) => !elToDelete.includes(el));
                currentHour.id = elToDelete[0].id < currentHour.id ? elToDelete[0].id : currentHour.id;
                currentHour.start = diffHours > 0 ? elToDelete[0].start : newStart;
                currentHour.end = diffHours < 0 ? elToDelete[0].end : newEnd;
                currentDrag.value = undefined;
                currentHour.total = totalHours(currentHour.start, currentHour.end);

                return;
            }
            currentHour.total = totalHours(currentHour.start, currentHour.end);

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