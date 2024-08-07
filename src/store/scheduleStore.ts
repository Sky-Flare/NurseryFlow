import { ref } from 'vue';
import { defineStore } from 'pinia';
import { ArrayElement, Employee, StatusEmployeeOrChild, useEmployeeStore } from '@/store/employeeStore';
import { Child, Days, useChildStore } from '@/store/childStore';

export type Hour = {
    name: string;
    id: number;
    hours: { id: number; start: Date; end: Date; total: number }[];
};
type TotalChildren = {
    number: number;
    start: Date;
    end: Date;
};

export type ScheduleItem = {
    date: Date;
    employee: Hour[];
    children: Hour[];
    totalChildren: TotalChildren[];
};

type Slot = {
    date: Date;
    children: Hour[];
    employeesNeeded: number;
    employees: PreparedEmployee[];
};

type PreparedEmployee = Employee & { average: number; countingHours: number };

export const useScheduleStore = defineStore('schedule', () => {
    const { employees } = useEmployeeStore();
    const { children } = useChildStore();
    const generateScheduleLoading = ref(false);
    const employeeDisplay = ref(true);

    const schedule = ref<Record<Days, ScheduleItem>>();

    const generateSchedule = (date: Date) => {
        generateScheduleLoading.value = true;

        const schdl = initializeSchedule(date);
        const childrenToWork = filterWorkingChildren(children);
        const employeeToWork = prepareEmployeesForWork(employees);

        assignChildrenToSchedule(childrenToWork, schdl);
        assignEmployeesToSlots(schdl, employeeToWork);
        balanceEmployeeHours(schdl, employeeToWork);

        schedule.value = schdl;
        generateScheduleLoading.value = false;
    };

    function initializeSchedule(date: Date): Record<Days, ScheduleItem> {
        return (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as Days[]).reduce(
            (acc, day, index) => {
                const currentDate = new Date(new Date(new Date(date)).setHours(7, 30));
                currentDate.setDate(currentDate.getDate() + index);
                acc[day] = {
                    date: currentDate,
                    employee: [],
                    children: [],
                    totalChildren: [],
                };
                return acc;
            },
            {} as Record<Days, ScheduleItem>
        );
    }

    function filterWorkingChildren(curentChildren: Child[]): Child[] {
        return curentChildren.filter((c) => c.status === StatusEmployeeOrChild.WORKING);
    }

    function prepareEmployeesForWork(currentEmployees: Employee[]): PreparedEmployee[] {
        return currentEmployees
            .filter((emp) => emp.status === StatusEmployeeOrChild.WORKING)
            .map((e) => {
                const average = e.hoursPerWeek / (5 - (e.daysOff?.length ?? 0));
                return { ...e, average, countingHours: e.hoursPerWeek };
            });
    }

    function assignChildrenToSchedule(childrenToWork: Child[], schdl: Record<Days, ScheduleItem>) {
        childrenToWork.forEach((child) => {
            for (const [key, value] of Object.entries(child.hours)) {
                const currentDate = new Date(schdl[key as Days].date);
                if (value?.start && value?.end) {
                    const [startHour, startMinute] = value.start.split(':').map(Number);
                    const [endHour, endMinute] = value.end.split(':').map(Number);
                    schdl[key as Days].children.push({
                        name: child.name,
                        id: child.id,
                        hours: [
                            {
                                id: 0,
                                start: new Date(new Date(currentDate).setHours(startHour, startMinute)),
                                end: new Date(new Date(currentDate).setHours(endHour, endMinute)),
                                total: endHour - startHour + (endMinute - startMinute) / 60,
                            },
                        ],
                    });
                }
            }
        });
    }

    function assignEmployeesToSlots(schdl: Record<Days, ScheduleItem>, employeeToWork: PreparedEmployee[]) {
        let indexSchedule = 0;
        for (const [key, currentDay] of Object.entries(schdl)) {
            assignEmployeesForDay(currentDay, employeeToWork, key as Days, indexSchedule);
            indexSchedule++;
        }
    }

    function assignEmployeesForDay(currentDay: ScheduleItem, employeeToWork: PreparedEmployee[], day: Days, indexSchedule: number) {
        const slots = getTimeSlot(new Date(new Date(currentDay.date).setHours(7, 30, 0)), 22).map((s) => ({
            date: s,
            children: [],
            employeesNeeded: 0,
            employees: [],
        })) as unknown as Slot[];

        let currentNbChild = 0;
        let currentStart: Date | null = null;
        const totalChild: TotalChildren[] = [];
        slots.forEach((slot, indexSlot) => {
            currentDay.children.forEach((child) => {
                if (!slot.children.includes(child) && slot.date.getTime() >= child.hours[0].start.getTime() && slot.date.getTime() < child.hours[0].end.getTime()) {
                    slot.children.push(child);
                }
            });

            if (currentNbChild !== 0 && currentStart && currentNbChild !== slot.children.length) {
                totalChild.push({
                    number: currentNbChild,
                    start: currentStart,
                    end: slot.date,
                });
                currentNbChild = slot.children.length;
                currentStart = slot.date;
            } else if (slot.children.length) {
                if (!currentStart) {
                    currentStart = slot.date;
                }
                currentNbChild = slot.children.length;
            }

            slot.employeesNeeded = slot.children.length === 0 ? 0 : slot.children.length <= 3 ? 1 : slot.children.length >= 4 && slot.children.length <= 13 ? 2 : 3;

            for (let i = 0; i < slot.employeesNeeded; i++) {
                assignEmployeeToSlot(slot, slots, employeeToWork, day, indexSchedule, indexSlot);
            }
        });

        finalizeEmployeeAssignments(slots, currentDay);
        currentDay.totalChildren = totalChild;
    }

    function assignEmployeeToSlot(slot: Slot, slots: Slot[], employeeToWork: PreparedEmployee[], day: Days, indexSchedule: number, indexSlot: number) {
        const availableEmployee = employeeToWork.filter(
            (hE) => !hE.daysOff?.includes(day) && hE.countingHours > 0 && !slot.employees.includes(hE) && hE.hoursPerWeek - hE.countingHours < hE.average * (indexSchedule + 1)
        );

        const employeeAlreadyInPreviousSlotAvailable = slots[indexSlot - 1]?.employees?.filter(
            (eAiPs) => eAiPs.countingHours > 0 && !slot.employees.includes(eAiPs) && eAiPs.hoursPerWeek - eAiPs.countingHours < eAiPs.average * (indexSchedule + 1)
        );

        if (employeeAlreadyInPreviousSlotAvailable?.length) {
            slot.employees.push(employeeAlreadyInPreviousSlotAvailable[0]);
            employeeAlreadyInPreviousSlotAvailable[0].countingHours -= 0.5;
        } else if (availableEmployee.length) {
            slot.employees.push(availableEmployee[0]);
            availableEmployee[0].countingHours -= 0.5;
        }
    }

    function finalizeEmployeeAssignments(slots: Slot[], currentDay: ScheduleItem) {
        slots.forEach((slot, indexSlot) => {
            slot.employees.forEach((employee) => {
                const currentEmployeeAlreadyOnDay = currentDay.employee?.filter((ce) => ce.id === employee.id);
                if (currentEmployeeAlreadyOnDay?.length) {
                    const employeeInNextSlot = slots[indexSlot + 1]?.employees?.filter((e) => e.id === employee.id);
                    if (!employeeInNextSlot?.length) {
                        const currentEmployeeDay = currentDay.employee?.find((e) => e.id === employee.id);
                        if (currentEmployeeDay) {
                            currentEmployeeDay.hours[0].end = new Date(slots[indexSlot + 1].date);
                            currentEmployeeDay.hours[0].total = (new Date(slots[indexSlot + 1].date).getTime() - currentEmployeeDay.hours[0].start.getTime()) / (1000 * 60) / 60;
                        }
                    }
                } else {
                    currentDay.employee.push({
                        name: employee.name,
                        id: employee.id,
                        hours: [
                            {
                                id: 1,
                                start: slot.date,
                                end: slot.date,
                                total: 1,
                            },
                        ],
                    });
                }
            });

            const filterIds = new Set(slots?.[indexSlot + 1]?.employees?.map((person) => person.id));
            currentDay.employee
                .filter((person) => !filterIds.has(person.id) && person.hours[0].start === person.hours[0].end)
                .forEach((em) => {
                    em.hours[0].end = new Date(slots[indexSlot + 1].date);
                    em.hours[0].total = (new Date(slots[indexSlot + 1].date).getTime() - em.hours[0].start.getTime()) / (1000 * 60) / 60;
                });
        });
    }

    function balanceEmployeeHours(schdl: Record<Days, ScheduleItem>, employeeToWork: PreparedEmployee[]) {
        employeeToWork.forEach((e) => {
            if (e.countingHours !== 0) {
                while (e.countingHours !== 0) {
                    const t = Object.entries(schdl).map((s) => ({
                        day: s[0],
                        employee: s[1].employee.find((ce) => e.id === ce.id),
                    }));
                    if (!t) {
                        return;
                    }
                    const tSorted = (JSON.parse(JSON.stringify(t)) as { day: Days; employee: ArrayElement<ScheduleItem['employee']> }[])
                        .sort((a, b) => {
                            if (!('employee' in a) && b.employee?.hours.length) {
                                return -1;
                            }
                            if (a.employee?.hours.length && !('employee' in b)) {
                                return 1;
                            }
                            if (!('employee' in a) && !('employee' in b)) {
                                return 0;
                            }

                            const totalHoursA = a.employee?.hours.reduce((sum, hour) => sum + hour.total, 0);
                            const totalHoursB = b.employee?.hours.reduce((sum, hour) => sum + hour.total, 0);

                            return totalHoursA - totalHoursB;
                        })
                        .filter((s) => !e.daysOff.includes(s.day));
                    const currentEmployee = schdl[tSorted[0].day]?.employee.find((yyyy) => yyyy.id === e.id);
                    if (!currentEmployee) {
                        const currentDateDay = schdl[tSorted[0].day]?.date;
                        schdl[tSorted[0].day].employee.push({
                            name: e.name,
                            id: e.id,
                            hours: [
                                {
                                    id: 1,
                                    start: new Date(new Date(currentDateDay).setHours(10, 30)),
                                    end: new Date(new Date(currentDateDay).setHours(11, 0)),
                                    total: 0.5,
                                },
                            ],
                        });
                        e.countingHours -= 0.5;
                    } else {
                        const previousHours = (new Date(currentEmployee.hours[0].start).getTime() - new Date(new Date(currentEmployee.hours[0].start).setHours(7, 30)).getTime()) / (1000 * 60) / 60;
                        const nextHours = (new Date(new Date(currentEmployee?.hours[0].end).setHours(18, 30)).getTime() - new Date(currentEmployee.hours[0].end).getTime()) / (1000 * 60) / 60;
                        if (currentEmployee?.hours[0].start) {
                            if (previousHours > nextHours) {
                                currentEmployee.hours[0].start = new Date(new Date(currentEmployee?.hours[0].start).getTime() - 30 * 60000);
                            } else {
                                currentEmployee.hours[0].end = new Date(new Date(currentEmployee?.hours[0].end).getTime() + 30 * 60000);
                            }
                            currentEmployee.hours[0].total += 0.5;
                            e.countingHours -= 0.5;
                        }
                    }
                }
            }
        });
    }

    function addHoursOfDay(employee: Hour, day: Days, currentTime: number) {
        const currentEmployee = schedule.value?.[day]?.employee.find((el) => el.name === employee.name);
        currentEmployee?.hours.push({
            id: currentEmployee.hours.length + 1,
            start: new Date(currentTime),
            end: new Date(new Date(currentTime).getTime() + 60 * 60000),
            total: 1,
        });
    }

    function addEmployeeOfOneDay(id: number, day: Days) {
        const currentDay = schedule.value?.[day].date;
        if (!currentDay) {
            return;
        }
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
        schedule.value?.[day].employee.push(newHour);
    }

    function deleteHour(day: Days, nameEmployee: string, hourId: number) {
        const currentEmployee = schedule.value?.[day]?.employee.find((el) => el.name === nameEmployee);
        const curentHours = currentEmployee?.hours.findIndex((el) => el.id === hourId + 1);
        if (!curentHours) {
            return;
        }
        currentEmployee?.hours.splice(curentHours, 1);
    }

    function addMinutes(date: Date, minutes: number) {
        return new Date(date.getTime() + minutes * 60000);
    }
    function getTimeSlot(d: Date, slot = 22) {
        const initialDate = new Date(d); // Date initiale
        const dates = [];

        for (let i = 0; i <= slot; i++) {
            dates.push(addMinutes(initialDate, i * 30));
        }

        return dates;
    }

    function toggleUserTypeDisplayed() {
        employeeDisplay.value = !employeeDisplay.value;
    }

    return {
        schedule,
        addHoursOfDay,
        getTimeSlot,
        addEmployeeOfOneDay,
        employeeDisplay,
        toggleUserTypeDisplayed,
        generateSchedule,
        deleteHour,
        generateScheduleLoading,
    };
});
