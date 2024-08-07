import { ref } from 'vue';
import { defineStore } from 'pinia';
export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
export enum StatusEmployeeOrChild {
    SICK = 'sick',
    VACATION = 'vacation',
    WORKING = 'working',
}
export type Employee = {
    id: number;
    name: string;
    hoursPerWeek: number;
    daysOff: string[];
    status: StatusEmployeeOrChild;
};
export type Days = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
export type HoursArray = { start: string; end: string };

export interface Child {
    name: string;
    hours: Record<Days, HoursArray>;
}

export const useEmployeeStore = defineStore('employee', () => {
    const employees = ref<Employee[]>([
        {
            name: 'marine',
            hoursPerWeek: 35,
            daysOff: ['Wednesday'],
            status: StatusEmployeeOrChild.WORKING,
            id: 1,
        },
        {
            name: 'fanny',
            hoursPerWeek: 35,
            daysOff: ['Monday'],
            status: StatusEmployeeOrChild.WORKING,
            id: 2,
        },
        {
            name: 'roxanne',
            hoursPerWeek: 35,
            daysOff: ['Tuesday'],
            status: StatusEmployeeOrChild.WORKING,
            id: 3,
        },
        {
            name: 'Sandrine',
            hoursPerWeek: 35,
            daysOff: ['Friday'],
            status: StatusEmployeeOrChild.WORKING,
            id: 4,
        },
        {
            name: 'Sophie',
            hoursPerWeek: 20,
            daysOff: [],
            status: StatusEmployeeOrChild.WORKING,
            id: 1722459857100,
        },
        {
            name: 'Lise',
            hoursPerWeek: 15,
            daysOff: ['Thursday'],
            status: StatusEmployeeOrChild.WORKING,
            id: 1722459876115,
        },
    ]);

    function addEmployee(employee: Omit<Employee, 'id'>) {
        employees.value.push({ ...employee, id: new Date().getTime() });
    }

    function getStatusEmployee(status: StatusEmployeeOrChild) {
        switch (status) {
            case StatusEmployeeOrChild.SICK:
                return { label: 'Malade', icon: '🤒️' };
            case StatusEmployeeOrChild.WORKING:
                return { label: 'Travail', icon: '💼‍️' };
            case StatusEmployeeOrChild.VACATION:
                return { label: 'Vacances', icon: '🏝️' };
        }
    }

    function removeEmployee(name: string) {
        employees.value = employees.value.filter((emp) => emp.name !== name);
    }

    function updateEmployee(e: Employee) {
        const index = employees.value.findIndex((emp) => emp.id === e.id);
        employees.value[index] = e;
    }

    return {
        employees,
        addEmployee,
        removeEmployee,
        updateEmployee,
        getStatusEmployee,
    };
});
