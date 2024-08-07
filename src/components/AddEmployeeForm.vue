<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { Employee, StatusEmployeeOrChild, useEmployeeStore } from '@/store/employeeStore';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { computed } from 'vue';

const props = defineProps<{
    idEmployee?: number;
}>();
const open = defineModel<boolean>('open');
const { toast } = useToast();
const { getStatusEmployee, updateEmployee, addEmployee, employees } = useEmployeeStore();
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const formSchema = toTypedSchema(
    z.object({
        username: z.string().min(2).max(50),
        hours: z.number().min(0).max(48),
        days: z.array(z.string()),
        status: z.nativeEnum(StatusEmployeeOrChild),
    })
);
const currentEmployee = computed(() => employees.find((e) => e.id === props.idEmployee));
const { handleSubmit } = useForm({
    validationSchema: formSchema,
    initialValues: {
        username: currentEmployee.value?.name ?? '',
        hours: currentEmployee.value?.hoursPerWeek ?? 35,
        days: currentEmployee.value?.daysOff ?? [],
        status: currentEmployee.value?.status ?? StatusEmployeeOrChild.WORKING,
    },
});

const onSubmit = handleSubmit((values) => {
    const employee: Omit<Employee, 'id'> = {
        name: values.username,
        hoursPerWeek: values.hours,
        daysOff: values.days,
        status: values.status,
    };
    const daysSentence = values.days.length ? `, et est en congé les ${values.days.join(', ')}` : '';
    if (props.idEmployee) {
        toast({
            title: 'Employé modifié',
            description: `${values.username}, fait ${values.hours} heures ${daysSentence}`,
        });
        updateEmployee({ ...employee, id: props.idEmployee });
    } else {
        toast({
            title: 'Employé ajouté',
            description: `${values.username}, fait ${values.hours} heures ${daysSentence}`,
        });
        addEmployee(employee);
    }
    open.value = false;
});
</script>

<template>
    <Sheet v-model:open="open" :default-open="true">
        <SheetContent>
            <SheetTitle>
                {{ idEmployee ? 'Changement profil' : 'Création du profil' }}
            </SheetTitle>
            <SheetHeader>
                <SheetDescription>
                    <form class="my-8 space-y-6" @submit="onSubmit">
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
                        <div class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Jour de congés</div>
                        <FormField v-for="day in days" v-slot="{ value, handleChange }" :key="day" type="checkbox" :value="day" :unchecked-value="false" name="days">
                            <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox :checked="value?.includes(day)" @update:checked="handleChange" />
                                </FormControl>
                                <FormLabel class="font-normal">
                                    {{ day }}
                                </FormLabel>
                            </FormItem>
                        </FormField>
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
                                            <SelectItem v-for="s in StatusEmployeeOrChild" :key="s" :value="s">
                                                {{ getStatusEmployee(s).label }}
                                                {{ getStatusEmployee(s).icon }}
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <SheetFooter class="flex items-center justify-center sm:justify-center">
                            <Button type="submit"> Enregistrer </Button>
                        </SheetFooter>
                    </form>
                </SheetDescription>
            </SheetHeader>
        </SheetContent>
    </Sheet>

    <!--  <Dialog v-model:open="open" :default-open="true">-->
    <!--    <DialogScrollContent class="sm:max-w-[425px]">-->
    <!--      <DialogHeader>-->
    <!--        <DialogTitle>Information sur l'employé</DialogTitle>-->
    <!--        <DialogDescription> info ?? </DialogDescription>-->
    <!--      </DialogHeader>-->
    <!--      <form class="w-2/3 space-y-6" @submit="onSubmit">-->
    <!--        <FormField v-slot="{ componentField }" name="username">-->
    <!--          <FormItem>-->
    <!--            <FormLabel>Prenom</FormLabel>-->
    <!--            <FormControl>-->
    <!--              <Input type="text" placeholder="Prenom" v-bind="componentField" />-->
    <!--            </FormControl>-->
    <!--            <FormMessage />-->
    <!--          </FormItem>-->
    <!--        </FormField>-->
    <!--        <FormField v-slot="{ componentField }" name="hours">-->
    <!--          <FormItem>-->
    <!--            <FormLabel>Nombre d'heures par semaine</FormLabel>-->
    <!--            <FormControl>-->
    <!--              <Input type="number" placeholder="35" v-bind="componentField" />-->
    <!--            </FormControl>-->
    <!--            <FormMessage />-->
    <!--          </FormItem>-->
    <!--        </FormField>-->
    <!--        <div-->
    <!--          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"-->
    <!--        >-->
    <!--          Jour non travaillé-->
    <!--        </div>-->
    <!--        <FormField-->
    <!--          v-for="day in days"-->
    <!--          v-slot="{ value, handleChange }"-->
    <!--          :key="day"-->
    <!--          type="checkbox"-->
    <!--          :value="day"-->
    <!--          :unchecked-value="false"-->
    <!--          name="days"-->
    <!--        >-->
    <!--          <FormItem class="flex flex-row items-start space-x-3 space-y-0">-->
    <!--            <FormControl>-->
    <!--              <Checkbox-->
    <!--                :checked="value?.includes(day)"-->
    <!--                @update:checked="handleChange"-->
    <!--              />-->
    <!--            </FormControl>-->
    <!--            <FormLabel class="font-normal">-->
    <!--              {{ day }}-->
    <!--            </FormLabel>-->
    <!--          </FormItem>-->
    <!--        </FormField>-->
    <!--        <DialogFooter class="sm:justify-start">-->
    <!--          <Button type="submit"> Enregistrer </Button>-->
    <!--        </DialogFooter>-->
    <!--      </form>-->
    <!--    </DialogScrollContent>-->
    <!--  </Dialog>-->
</template>
