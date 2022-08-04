<template>
  <h1>Task</h1>
  <div class="cursor-pointer" @click="launch">GO</div>
  <div>
    <form @submit.prevent="onSubmit" class="add-form">
      <div class="form-control">
        <label>Name</label>
        <input type="text" v-model="name" name="name" placeholder="Enter Your Name" />
      </div>
      <input type="submit" value="Save Information" class="btn btn-block" />
    </form>
  </div>
  <div class="flex flex-wrap">
    <span v-for="user in users" :key="user.name" @click="userToview = user.name" class="mr-2 cursor-pointer"
      :class="user.tasks.length !== days ? 'text-red-400' : 'text-green-600'">
      {{ user.name }}+ {{ user.tasks.length }}</span>
  </div>
  <div class="flex flex-col border-2 mb-2" v-for="day in days" :key="day" :day="day">
    Jour {{ day }}
    <div class="flex justify-between">
      <div class="flex flex-col" v-for="(task, idxTask) in tasks" :key="idxTask" :task="task">
        <span class="font-bold">{{ task.name }}</span>
        <div class="flex flex-col">
          <div v-for="(user, idxUser) in getUsers(day, task)" :key="idxUser" @click="userToview = user.name"
            class="cursor-pointer" :class="
              userToview === user.name
                ? 'opacity-100	bg-orange-500	'
                : 'opacity-80'
            ">
            {{ user.name }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="cursor-pointer" @click="launch">GO</div>
</template>

<script setup lang="ts">
import { ref, computed } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";

interface user {
  name: string;
  tasks: { day: number; name: string }[];
}

const tasks = [
  {
    name: "sandwichs",
    nbUser: 3,
  },
  {
    name: "poubelles",
    nbUser: 3,
  },
  {
    name: "petit dej",
    nbUser: 3,
  },
  {
    name: "vaisselle pti dej",
    nbUser: 4,
  },
  {
    name: "table",
    nbUser: 4,
  },
  {
    name: "repas",
    nbUser: 4,
  },
  {
    name: "vaisselle soir",
    nbUser: 4,
  },
];
const userToview = ref();
const days = ref(12);
let users = ref<user[]>([]);
const name = ref("");

function onSubmit() {
  console.log(name.value);

  const newUser: user = { name: name.value, tasks: [] };

  users.value.push(newUser);

  name.value = "";
}
const persPerTask = computed(() => {
  return Math.round(users.value.length / tasks.length);
});
function launch() {

  setUser();
  if (checkUsersToTasks()) {
    //Pour chaque jours
    for (let day = 0; day <= days.value - 1; day++) {
      // let array: user[] = users.value;
      let array: user[] = fisherYatesShuffle(users.value);

      //Pour chaque taches 
      tasks.forEach((task) => {

        let nbUsersTask = 0;

        array.forEach((user) => {
          const lastTask = user.tasks.find((t) => t.day === day - 1);
          if (
            (nbUsersTask < task.nbUser &&
              lastTask?.name !== task.name &&
              countSameTask(user, task.name) < Math.ceil(((tasks.length * days.value) / users.value.length))) ||
            (nbUsersTask < task.nbUser)
          ) {
            const foundTask = user.tasks.find((element) => element.day === day);
            // console.log("found", foundTask); 

            if (foundTask === undefined) {
              // console.log("in if");

              const taskCreat = { name: task.name, day: day };
              // console.log("taskCreat", taskCreat);

              user.tasks.push(taskCreat);
              nbUsersTask++;
            } else {
              // console.log("not found ", user);
            }
          }
        });
      });
    }
  }
}

function checkUsersToTasks() {
  let nbUserTotal = 0;
  tasks.forEach((task) => {
    nbUserTotal = nbUserTotal + task.nbUser;
  });
  if (nbUserTotal !== users.value.length) {
    alert(
      "Nombre de user par tache pas identique au nombre de user total. Nb users : " +
      users.value.length +
      "Nb users total taches " +
      nbUserTotal
    );
  }
  return nbUserTotal === users.value.length;
}

function fisherYatesShuffle(arr: user[]) {
  let array: user[] = arr.slice();

  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)); //random index
    [array[i], array[j]] = [array[j], array[i]]; // swap
  }
  return array;
}

function countSameTask(user: user, taskSearch: string) {
  let i = 0;
  user.tasks.forEach((task) => {
    if (task.name === taskSearch) {
      i++;
    }
  });
  return i;
}
/* const x = (task.nbUser * 100) / users.value.length;
console.log("x", task.name, Math.ceil((days.value / 100) * x)); */
/* countSamecalTask(user, task.name) <=
              Math.ceil((days.value / 100) * x) && */
/*    user.tasks.length < day + 1 && */
/*    (user.tasks || user.tasks[day - 1].name !== task.name) && */
/*

Du 16 au 29
12 jours
25 personnes
Peparation des sandwichs
Preparation des petit dej
Vaissele du pt dej
Table du soir
Repas du soir
Vaisselle du soir

*/

function getUsers(day: number, task: { name: string; nbUser: number }) {

  return users.value.filter((user) => {
    return user.tasks.find(
      (taskUsr) => taskUsr.name === task.name && taskUsr.day === day - 1
    );
  });
}

function setUser() {
  users.value = [];
  users.value.push({
    name: "lulu",
    tasks: [],
  });
  users.value.push({
    name: "thom",
    tasks: [],
  });
  users.value.push({
    name: "benj",
    tasks: [],
  });
  users.value.push({
    name: "erica",
    tasks: [],
  });
  users.value.push({
    name: "mat",
    tasks: [],
  });
  users.value.push({
    name: "roger",
    tasks: [],
  });
  users.value.push({
    name: "marcel",
    tasks: [],
  });

  users.value.push({
    name: "michel",
    tasks: [],
  });
  users.value.push({
    name: "tartenpion",
    tasks: [],
  });
  users.value.push({
    name: "amy",
    tasks: [],
  });
  users.value.push({
    name: "porcinet",
    tasks: [],
  });
  users.value.push({ name: "martin", tasks: [] });
  users.value.push({ name: "loulou", tasks: [] });
  users.value.push({ name: "mastu", tasks: [] });
  users.value.push({ name: "amixem", tasks: [] });
  users.value.push({ name: "squezi", tasks: [] });
  users.value.push({ name: "astrid", tasks: [] });
  users.value.push({ name: "lola", tasks: [] });
  users.value.push({ name: "clementine", tasks: [] });
  users.value.push({ name: "anna", tasks: [] });
  users.value.push({ name: "roxan", tasks: [] });
  users.value.push({ name: "estelle", tasks: [] });
  users.value.push({ name: "mathilde", tasks: [] });
  users.value.push({ name: "tim", tasks: [] });
  users.value.push({ name: "tom", tasks: [] });
  /*users.value.push({ name: "tchou", tasks: [] });
  users.value.push({ name: "lili", tasks: [] });
  users.value.push({ name: "max", tasks: [] });
  users.value.push({ name: "toms", tasks: [] });
  users.value.push({ name: "tchous", tasks: [] });
  users.value.push({ name: "lilis", tasks: [] });
  users.value.push({ name: "maxs", tasks: [] }); */
}
/* while (nbUsersTask < task.nbUser && securit < 50) {
          console.log("while", array);
          securit++;
          let i = 0;
          const user = users.value.find((el) => el.name === array[i].name);

          if (user && countSameTask(user, task.name) < 3) {
            const taskDay = user?.tasks.find((t) => t.day === day);
            console.log("in if", user);

            if ((taskDay && taskDay?.name !== "") || !taskDay) {
              console.log("in task");
              const taskToAd = { name: task.name, day: day };
              array[i].tasks.push(taskToAd);
              nbUsersTask++;
              console.log("taskDay.name");

              array.splice(
                array.findIndex((el) => el.name === array[i].name),
                1
              );

              i < array.length ? i++ : (i = 0);
            } else {
              console.log("not found ", array[i]);
            }
          } else {
            i < array.length ? i++ : (i = 0);
          }
        }
           array.forEach((user) => {*/
</script>
