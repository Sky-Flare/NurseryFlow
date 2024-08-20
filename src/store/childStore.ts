import { ref } from 'vue';
import { defineStore } from 'pinia';
import { StatusEmployeeOrChild } from '@/store/employeeStore';

export interface Employee {
    name: string;
    hoursPerWeek: number;
    daysOff: string[];
}
export type Days = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type HoursArray = { start: string; end: string; total: number | string };

export type Child = {
    id: number;
    name: string;
    hours: Record<Days, HoursArray>;
    total: number;
    status: StatusEmployeeOrChild;
};

export const useChildStore = defineStore('child', () => {
    const children = ref<Child[]>(JSON.parse(localStorage.getItem('children') ?? '[]') as Child[]);

    function addChild(c: Omit<Child, 'id'>) {
        children.value.push({ ...c, id: children.value.length });
    }

    function updateChild(e: Child) {
        const index = children.value.findIndex((c) => c.id === e.id);
        children.value[index] = e;
    }

    function getStatusChild(status: StatusEmployeeOrChild) {
        switch (status) {
            case StatusEmployeeOrChild.SICK:
                return { label: 'Malade', icon: '🤒️' };
            case StatusEmployeeOrChild.WORKING:
                return { label: 'Créche', icon: '🚼️' };
            case StatusEmployeeOrChild.VACATION:
                return { label: 'Vacances', icon: '🏝️' };
        }
    }

    return {
        children,
        addChild,
        updateChild,
        getStatusChild,
    };
});
