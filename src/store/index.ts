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

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hoursPerDay = 9;

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

    const childrenPerHour = ref<number[][]>([
        [3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4],
        [3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4],
        [3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4],
        [3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4],
        [14, 14, 14, 14, 3, 4, 4, 4, 4, 4, 4],
    ]);
    const schedule = ref<(Employee | null)[][][]>([]);

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
            default:
                return '';
        }
    }

    function removeEmployee(name: string) {
        employees.value = employees.value.filter((emp) => emp.name !== name);
    }

    function updateEmployee(e: Employee) {
        const index = employees.value.findIndex((emp) => emp.id === e.id);
        employees.value[index] = e;
    }

    function setChildrenPerHour(childs: number[][]) {
        childrenPerHour.value = childs;
    }

    function generateSchedule() {
        const schdl: (Employee | null)[][][] = Array.from({ length: days.length }, () =>
            Array(hoursPerDay)
                .fill(null)
                .map(() => [])
        );

        const employeesNeededPerHour = childrenPerHour.value.map((day) =>
            day.map((children) => {
                if (children <= 3) {
                    return 1;
                }
                if (children >= 4 && children <= 13) {
                    return 2;
                }
                return 3; // 14 enfants ou plus
            })
        );

        // Répartir les heures de chaque employé de manière équilibrée sur les jours de travail
        const employeeHoursRemaining = new Map<Employee, number>();
        employees.value.forEach((employee) => employeeHoursRemaining.set(employee, employee.hoursPerWeek));

        for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
            let previousHourIndex = -1; // Pour suivre l'heure précédente

            for (let hourIndex = 0; hourIndex < hoursPerDay; hourIndex++) {
                const neededEmployees = employeesNeededPerHour[dayIndex][hourIndex];
                const availableEmployees = employees.value.filter(
                    (employee) =>
                        !employee.daysOff.includes(days[dayIndex]) &&
                        employeeHoursRemaining.get(employee)! > 0 &&
                        // Vérifier qu'il n'y a pas déjà un horaire fractionné avec cet employé le même jour
                        !schdl[dayIndex].slice(previousHourIndex + 1, hourIndex).some((hours) => hours.some((emp) => emp !== null && emp !== undefined && emp.name === employee.name))
                );

                // Ajouter les employés nécessaires pour cette heure
                for (let i = 0; i < neededEmployees; i++) {
                    if (availableEmployees.length === 0) {
                        break;
                    }

                    // Trouver l'employé avec le plus d'heures restantes
                    let selectedEmployee = availableEmployees[0];
                    for (const employee of availableEmployees) {
                        if (employeeHoursRemaining.get(employee)! > employeeHoursRemaining.get(selectedEmployee)!) {
                            selectedEmployee = employee;
                        }
                    }

                    schdl[dayIndex][hourIndex].push(selectedEmployee);
                    employeeHoursRemaining.set(selectedEmployee, employeeHoursRemaining.get(selectedEmployee)! - 1);
                    // Enlever cet employé de la liste des disponibles pour cette heure
                    availableEmployees.splice(availableEmployees.indexOf(selectedEmployee), 1);
                }

                // Mettre à jour l'index de l'heure précédente
                if (neededEmployees > 0) {
                    previousHourIndex = hourIndex;
                }
            }
        }

        // Distribuer les heures restantes de manière équilibrée
        for (let [employee, remainingHours] of employeeHoursRemaining) {
            if (remainingHours > 0) {
                for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
                    if (employee.daysOff.includes(days[dayIndex])) {
                        continue;
                    }

                    for (let hourIndex = 0; hourIndex < hoursPerDay; hourIndex++) {
                        if (remainingHours > 0 && !schdl[dayIndex][hourIndex].includes(employee)) {
                            schdl[dayIndex][hourIndex].push(employee);
                            remainingHours--;
                        }
                    }
                }
            }
        }

        schedule.value = schdl;
    }

    return {
        employees,
        childrenPerHour,
        schedule,
        addEmployee,
        removeEmployee,
        setChildrenPerHour,
        generateSchedule,
        updateEmployee,
        getStatusEmployee,
    };
});
