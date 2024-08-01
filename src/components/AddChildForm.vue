<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

import { Child, Days, HoursArray, useChildStore } from "@/store/childStore";
import { StatusEmployeeOrChild } from "@/store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const props = defineProps<{ child?: Child }>();
const open = defineModel<boolean>("open");
const { toast } = useToast();
const days: Days[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const { updateChild, addChild, getStatusChild } = useChildStore();

// Génération des options de temps
const timeOptions: string[] = [""];
const startHour = 7;
const endHour = 18;

for (let hour = startHour; hour <= endHour; hour++) {
  timeOptions.push(`${hour}:30`);
  if (hour !== endHour) {
    timeOptions.push(`${hour + 1}:00`);
  }
}

// Correction pour ajouter 18:30 si nécessaire
if (!timeOptions.includes("18:30")) {
  timeOptions.push("18:30");
}
const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(2).max(50),
    hours: z.record(
      z.string(),
      z.object({
        start: z.string(),
        end: z.string(),
        total: z.number(),
      }),
    ),
    status: z.nativeEnum(StatusEmployeeOrChild),
  }),
);

const { handleSubmit, values, errors } = useForm({
  validationSchema: formSchema,
  initialValues: {
    username: props.child?.name ?? "",
    hours: Object.fromEntries(
      days.map((day) => [
        day,
        {
          start: props.child?.hours?.[day]?.start ?? "7:30",
          end: props.child?.hours?.[day]?.end ?? "18:30",
          total: props.child?.total ?? 0,
        },
      ]),
    ),
    status: props.child?.status ?? StatusEmployeeOrChild.WORKING,
  },
});

const generateTimeSlots = (start: string, end: string) => {
  // Convertir les heures et minutes en nombres
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  // Initialiser le tableau de créneaux avec des 0
  const slots = Array(21).fill(0);
  console.log(slots);
  // Calculer les indices de début et de fin dans le tableau
  const startIndex = (startHour - 7) * 2 + startMinute / 30 - 1;
  const endIndex = (endHour - 7) * 2 + endMinute / 30 - 1;

  // Remplir les créneaux avec des 1 entre startIndex et endIndex
  for (let i = startIndex; i < endIndex; i++) {
    slots[i] = 1;
  }

  return slots;
};

const onSubmit = handleSubmit((values) => {
  const updatedHours = {} as Record<string, number[]>;
  days.forEach((day) => {
    const { start, end } = values.hours[day];
    console.log(day, start, end);
    updatedHours[day] = generateTimeSlots(start, end);
  });
  const finalHours: Record<Days, HoursArray> = values.hours;
  for (const [key, value] of Object.entries(values.hours)) {
    finalHours[key].start = value.start;
    finalHours[key].end = value.end;
    finalHours[key].total = totalHoursPerDays(key);
  }
  const child: Omit<Child, "id"> = {
    name: values.username,
    hours: finalHours,
    total: totalHoursPerWeek.value,
    status: values.status,
  };

  if (props.child) {
    updateChild({ ...child, id: props.child.id });
  } else {
    addChild(child);
  }
  console.log(child);
  toast({
    title: props.child ? "Profil de l'enfant modifié" : "Enfant ajouté",
    description: `Nom: ${child.name}, Total d'heures: ${totalHoursPerWeek.value}`,
  });
  open.value = false;
});

const totalHoursPerDays = (d: Days) => {
  if (values.hours?.[d]) {
    const { start, end } = values.hours?.[d];
    if (start && end) {
      const [startHour, startMinute] = start.split(":").map(Number);
      const [endHour, endMinute] = end.split(":").map(Number);
      return endHour - startHour + (endMinute - startMinute) / 60;
    }
    return "";
  }
  return "";
};

const totalHoursPerWeek = computed(() => {
  let total = 0;
  for (const day of days) {
    const start = values.hours?.[day]?.start;
    const end = values.hours?.[day]?.end;
    if (start && end) {
      const [startHour, startMinute] = start.split(":").map(Number);
      const [endHour, endMinute] = end.split(":").map(Number);
      total += endHour - startHour + (endMinute - startMinute) / 60;
    }
  }
  return total;
});
</script>

<template>
  <Sheet v-model:open="open" :default-open="true">
    <SheetContent>
      <SheetTitle>
        {{ child ? "Changement profil" : "Création du profil" }}
      </SheetTitle>

      <SheetHeader>
        <SheetDescription>
          <form class="space-y-6" @submit="onSubmit">
            <FormField v-slot="{ componentField }" name="username">
              <FormItem>
                <FormLabel>Prenom</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Prenom"
                    v-bind="componentField"
                  />
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
                      <select
                        v-bind="field"
                        class="bg-background text-foreground"
                      >
                        <option
                          v-for="time in timeOptions"
                          :key="time"
                          :value="time"
                        >
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
                      <select
                        v-bind="field"
                        class="bg-background text-foreground"
                      >
                        <option
                          v-for="time in timeOptions"
                          :key="time"
                          :value="time"
                        >
                          {{ time }}
                        </option>
                      </select>
                    </FormControl>
                  </FormItem>
                </FormField>
                <div class="flex items-end">
                  {{ totalHoursPerDays(day) }} heures
                </div>
              </div>
            </div>

            <FormField v-slot="{ componentField }" name="status">
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Select a verified email to display"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        v-for="status in StatusEmployeeOrChild"
                        :value="status"
                      >
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
              <div class="pb-4">
                Total de la semaine {{ totalHoursPerWeek }} heures
              </div>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
</template>
