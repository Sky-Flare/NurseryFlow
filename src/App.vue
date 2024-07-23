<template>
  <div class="container px-4">
    <Toaster />

    <div class="flex justify-between items-center py-4">
      <NavigationMenu v-model="currentTrigger">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              :class="navigationMenuTriggerStyle()"
              class="cursor-pointer gap-1"
              @click="$router.push('/')"
            >
              <img class="h-8 w-" src="/assets/img/baby.svg" />
              <h1 class="font-bold">Garderie</h1>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem data-active="true" active="true">
            <NavigationMenuLink
              data-active="true"
              :active="true"
              :class="navigationMenuTriggerStyle()"
              class="cursor-pointer"
              @click="$router.push('/employee')"
              :style="
                $route.name === 'employee'
                  ? 'color: hsl(var(--accent-foreground)); background-color: hsl(var(--accent));'
                  : ''
              "
            >
              Employés
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              :class="navigationMenuTriggerStyle()"
              class="cursor-pointer"
              @click="$router.push('/children')"
              :style="
                $route.name === 'children'
                  ? 'color: hsl(var(--accent-foreground)); background-color: hsl(var(--accent));'
                  : ''
              "
            >
              Enfants
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div class="cursor-pointer" @click="changeTheme">
        <font-awesome-icon :icon="['fas', 'circle-half-stroke']" />
      </div>
    </div>
    <div>
      <Separator />
      <div class="py-6">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Toaster } from "@/components/ui/toast";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { computed, ref, watch } from "vue";
import Test from "@/components/test.vue";

const currentTrigger = ref("");
function changeTheme() {
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "light" : "dark",
  );
  document.body.classList.toggle("dark");
}
localStorage.getItem("theme") === "dark" &&
  document.body.classList.toggle("dark");
</script>

<style scoped></style>
