<script setup lang="ts">
import { computed } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/toast';
import { DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';

import { Child, Days, HoursArray, useChildStore } from '@/store/childStore';
import { StatusEmployeeOrChild } from '@/store/employeeStore';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const props = defineProps<{ child?: Child }>();
const open = defineModel<boolean>('open');
const { toast } = useToast();
const days: Days[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const { updateChild, addChild, getStatusChild } = useChildStore();

const timeOptions: string[] = [''];
const startHour = 7;
const endHour = 18;

for (let hour = startHour; hour <= endHour; hour++) {
    timeOptions.push(`${hour}:30`);
    if (hour !== endHour) {
        timeOptions.push(`${hour + 1}:00`);
    }
}

if (!timeOptions.includes('18:30')) {
    timeOptions.push('18:30');
}
const formSchema = toTypedSchema(
    z.object({
        username: z.string().min(2).max(50),
        hours: z.record(
            z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
            z.object({
                start: z.string(),
                end: z.string(),
                total: z.union([z.number(), z.string()]),
            })
        ),
        status: z.nativeEnum(StatusEmployeeOrChild),
    })
);

const { handleSubmit, values, errors } = useForm({
    validationSchema: formSchema,
    initialValues: {
        username: props.child?.name ?? '',
        hours: Object.fromEntries(
            days.map((day) => [
                day,
                {
                    start: props.child?.hours?.[day]?.start ?? '7:30',
                    end: props.child?.hours?.[day]?.end ?? '18:30',
                    total: props.child?.total ?? 0,
                },
            ])
        ) as Record<Days, HoursArray>,
        status: props.child?.status ?? StatusEmployeeOrChild.WORKING,
    },
});
const generateTimeSlots = (start: string, end: string) => {
    const [startHourSlot, startMinute] = start.split(':').map(Number);
    const [endHourSlot, endMinute] = end.split(':').map(Number);
    const slots = Array(21).fill(0);
    const startIndex = (startHourSlot - 7) * 2 + startMinute / 30 - 1;
    const endIndex = (endHourSlot - 7) * 2 + endMinute / 30 - 1;
    for (let i = startIndex; i < endIndex; i++) {
        slots[i] = 1;
    }

    return slots as number[];
};
const onSubmit = handleSubmit((currentValues) => {
    const updatedHours = {} as Record<string, number[]>;
    days.forEach((day: Days) => {
        if (!currentValues.hours[day]) {
            return;
        }
        const { start, end } = currentValues.hours[day];
        updatedHours[day] = generateTimeSlots(start, end);
    });
    const finalHours: Record<Days, HoursArray> = currentValues.hours as Record<Days, HoursArray>;
    for (const [key, value] of Object.entries(currentValues.hours as Record<Days, HoursArray>) as [Days, HoursArray][]) {
        if (!finalHours[key]) {
            return;
        }
        finalHours[key].start = value.start;
        finalHours[key].end = value.end;
        finalHours[key].total = totalHoursPerDays(key);
    }
    if (!currentValues.username || !currentValues.status) {
        return;
    }
    const child: Omit<Child, 'id'> = {
        name: currentValues.username,
        hours: finalHours,
        total: totalHoursPerWeek.value,
        status: currentValues.status,
    };

    if (props.child) {
        updateChild({ ...child, id: props.child.id });
    } else {
        addChild(child);
    }
    toast({
        title: props.child ? "Profil de l'enfant modifié" : 'Enfant ajouté',
        description: `Nom: ${child.name}, Total d'heures: ${totalHoursPerWeek.value}`,
    });
    open.value = false;
});

const totalHoursPerDays = (d: Days) => {
    if (values.hours?.[d]) {
        const { start, end } = values.hours[d];
        if (start && end) {
            const [valueStartH, startMinute] = start.split(':').map(Number);
            const [valueEndHour, endMinute] = end.split(':').map(Number);
            return valueEndHour - valueStartH + (endMinute - startMinute) / 60;
        }
        return '';
    }
    return '';
};

const totalHoursPerWeek = computed(() => {
    let total = 0;
    for (const day of days) {
        const start = values.hours?.[day]?.start;
        const end = values.hours?.[day]?.end;
        if (start && end) {
            const [currentStartHour, startMinute] = start.split(':').map(Number);
            const [currentEndHour, endMinute] = end.split(':').map(Number);
            total += currentEndHour - currentStartHour + (endMinute - startMinute) / 60;
        }
    }
    return total;
});
</script>

<template>
    <Sheet v-model:open="open" :default-open="true">
        <SheetContent>
            <SheetTitle>
                {{ child ? 'Changement profil' : 'Création du profil' }}
            </SheetTitle>

            <SheetHeader>
                <SheetDescription>
                    <form class="space-y-6" @submit="onSubmit">
                        <FormField v-slot="{ componentField }" name="username">
                            <FormItem>
                                <FormLabel>Prenom</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Prenom" v-bind="componentField" />
                                </FormControl>
                                <FormMessage>{{ errors.username }}</FormMessage>
                            </FormItem>
                        </FormField>

                        <div v-for="day in days" :key="day">
                            <div>{{ day }}</div>
                            <div class="flex space-x-4 items-center">
                                <FormField v-slot="{ field }" :name="`hours.${day}.start`">
                                    <FormItem>
                                        <FormLabel class="pr-2">Début</FormLabel>
                                        <FormControl>
                                            <select v-bind="field" class="bg-background text-foreground">
                                                <option v-for="time in timeOptions" :key="time" :value="time">
                                                    {{ time }}
                                                </option>
                                            </select>
                                        </FormControl>
                                    </FormItem>
                                </FormField>
                                <FormField v-slot="{ field }" :name="`hours.${day}.end`">
                                    <FormItem>
                                        <FormLabel class="pr-2">Fin</FormLabel>
                                        <FormControl>
                                            <select v-bind="field" class="bg-background text-foreground">
                                                <option v-for="time in timeOptions" :key="time" :value="time">
                                                    {{ time }}
                                                </option>
                                            </select>
                                        </FormControl>
                                    </FormItem>
                                </FormField>
                                <div class="flex items-end">{{ totalHoursPerDays(day) }} heures</div>
                            </div>
                        </div>

                        <FormField v-slot="{ componentField }" name="status">
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select v-bind="componentField">
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a verified email to display" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem v-for="status in StatusEmployeeOrChild" :key="status" :value="status">
                                                {{ getStatusChild(status).label }}
                                                {{ getStatusChild(status).icon }}
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <DialogFooter class="block">
                            <div class="pb-4">Total de la semaine {{ totalHoursPerWeek }} heures</div>
                            <Button type="submit">Enregistrer</Button>
                        </DialogFooter>
                    </form>
                </SheetDescription>
            </SheetHeader>
        </SheetContent>
    </Sheet>
</template>
