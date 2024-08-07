<script lang="ts" setup>
import { computed } from 'vue';
import { Hour } from '@/store/scheduleStore';

const props = defineProps<{
    currentTime: Date;
    timeChild: {
        number: number;
        start: Date;
        end: Date;
    };
    dayEmployees: Hour[];
}>();
const nomberEmployeePresent = computed(() => {
    let nb = 0;
    props.dayEmployees?.forEach((e) => {
        e.hours.forEach((h) => {
            if (props.currentTime >= h.start && props.currentTime < h.end) {
                nb++;
            }
        });
    });
    return nb;
});
const isok = computed(() => {
    if (props.timeChild.number <= 3) {
        return nomberEmployeePresent.value > 0;
    } else if (props.timeChild.number <= 13) {
        return nomberEmployeePresent.value > 1;
    } else {
        return nomberEmployeePresent.value > 3;
    }
});
const isDateBetween = computed(() => ({
    start: props.currentTime.getTime() === props.timeChild.start.getTime(),
    end: props.currentTime.getTime() === new Date(props.timeChild.end.getTime() - 30 * 60000).getTime(),
    active: props.currentTime >= props.timeChild.start && props.currentTime < props.timeChild.end,
}));
</script>

<template>
    <div
        v-if="timeChild.number && isDateBetween.active"
        class="w-full h-[15px] font-bold overflow-visible absolute -top-4"
        :class="[
            { 'bg-blue-400': isDateBetween.active },
            {
                'rounded-l-[8px]': isDateBetween.start,
            },
            {
                'rounded-r-[8px]': isDateBetween.end,
            },
        ]"
    >
        <div v-if="isDateBetween.start" class="capitalize pl-1 text-[10px] absolute left-0 z-[1] text-white">👶 {{ timeChild.number }}</div>
        <div v-if="!isok" class="capitalize text-black pl-1 text-[10px] absolute left-0 z-[1]">🚨</div>
    </div>
</template>
