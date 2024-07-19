<template>
  <div class="flex items-center gap-4 mb-2">
    <h2 class="text-xl font-semibold">Liste des enfants</h2>
    <Button
      @click="openEditForm = true"
      class="rounded-full w-[20px] h-[20px] flex items-center justify-center p-0"
    >
      <font-awesome-icon :icon="['fas', 'plus']" />
    </Button>
  </div>

  <div class="flex gap-2 flex-wrap">
    <Card
      v-for="child in children"
      :key="child.name"
      @click="
        childToEdit = child;
        openEditForm = true;
      "
    >
      <CardHeader>
        <CardTitle class="capitalize">{{ child.name }}</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-for="(item, key) in child.hours" class="block">
          {{ key }} : {{ item.start }} - {{ item.end }}
        </div>
      </CardContent>
      <CardFooter>
        <CardDescription> Total : {{ child.total }} </CardDescription>
      </CardFooter>
    </Card>
  </div>
  <AddChildForm
    :key="childToEdit?.id ?? new Date().getTime()"
    v-model:open="openEditForm"
    :child="childToEdit"
  />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { Child, Employee, useStore } from "../store/childStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/components/lib/utils";
import AddChildForm from "@/components/AddChildForm.vue";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const store = useStore();
const children = computed(() => store.children);
const openEditForm = ref(false);
const childToEdit = ref<Child>();
watch(openEditForm, (v) => {
  if (!v) {
    childToEdit.value = undefined;
  }
});
</script>

<style scoped>
/* Ajoute des styles ici */
</style>
