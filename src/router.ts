import * as VueRouter from "vue-router";
import EmployeeList from "./components/EmployeeList.vue";
import Childrenlist from "./components/ChildrenList.vue";
import Home from "./pages/Home.vue";

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
    },
    { path: "/employee", component: EmployeeList, name: "employee" },
    { path: "/children", component: Childrenlist, name: "children" },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});
