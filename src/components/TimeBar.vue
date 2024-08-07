<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
    currentTime: Date;
    indexTime: number;
}>();
const odd = computed(() => props.indexTime % 2 === 1);
</script>

<template>
    <div class="absolute top-[-35px] text-xs -rotate-45" :class="odd ? 'text-xs' : 'text-[8px]'">
        {{ odd ? `${currentTime.getHours()}` : 30 }}
    </div>
    <div class="absolute h-[calc(100%+15px)] top-[-15px] border border-foreground" :class="odd ? ' opacity-30' : 'opacity-10'"></div>
</template>
