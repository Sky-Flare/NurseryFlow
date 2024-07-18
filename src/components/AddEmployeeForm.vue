<script setup lang="ts">
import { h, onMounted, watch } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { ref } from "vue";
import { Employee, useStore } from "@/store";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const props = defineProps<{
  edit?: Employee;
}>();
const open = defineModel<boolean>("open");
const { toast } = useToast();
const store = useStore();
const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(2).max(50),
    hours: z.number().min(0).max(48),
    days: z.array(z.string()),
  })
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    username: props.edit?.name ?? "",
    hours: props.edit?.hoursPerWeek ?? 35,
    days: props.edit?.daysOff ?? [],
  },
});

const onSubmit = handleSubmit((values) => {
  if (props.edit) {
    toast({
      title: "Employé modifié",
      description: `${values.username}, fait ${values.hours} heures, et ne travail pas les ${values.days}`,
    });
    store.updateEmployee({
      name: values.username,
      hoursPerWeek: values.hours,
      daysOff: values.days,
    });
  } else {
    toast({
      title: "Employé ajouté",
      description: `${values.username}, fait ${values.hours} heures, et ne travail pas les ${values.days}`,
    });
    store.addEmployee({
      name: values.username,
      hoursPerWeek: values.hours,
      daysOff: values.days,
    });
  }
  open.value = false;
});
</script>

<template>
  <Dialog v-model:open="open" :default-open="true">
    <DialogScrollContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Information sur l'employé</DialogTitle>
        <DialogDescription> info ?? </DialogDescription>
      </DialogHeader>
      <form class="w-2/3 space-y-6" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="username">
          <FormItem>
            <FormLabel>Prenom</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Prenom" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="hours">
          <FormItem>
            <FormLabel>Nombre d'heures par semaine</FormLabel>
            <FormControl>
              <Input type="number" placeholder="35" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <div
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Jour non travaillé
        </div>
        <FormField
          v-for="day in days"
          v-slot="{ value, handleChange }"
          :key="day"
          type="checkbox"
          :value="day"
          :unchecked-value="false"
          name="days"
        >
          <FormItem class="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                :checked="value?.includes(day)"
                @update:checked="handleChange"
              />
            </FormControl>
            <FormLabel class="font-normal">
              {{ day }}
            </FormLabel>
          </FormItem>
        </FormField>
        <DialogFooter class="sm:justify-start">
          <Button type="submit"> Enregistrer </Button>
        </DialogFooter>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>
