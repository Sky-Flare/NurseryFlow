<template>
  <div class="pb-24">

    <h1 class="font-bold text-xl mb-8">Welcome</h1>
    <div class="flex flex-col items-center justify-center ">

      <div class="w-[90%] p-4 mb-8">
        <form @submit.prevent="onSubmitDays" class="add-form flex items-center justify-center flex-col">
          <div class="form-control flex flex-col items-center justify-center w-[20%] mb-4">
            <label class="mb-2">Nombre de jours 📆
            </label>
            <input type="number" class="border border-black rounded w-full" v-model="inputDays" name="name"
              placeholder="0" />
          </div>
          <div>Actuel : </div>
          <div v-if="days > 0" class="group text-lg h-[50px] flex flex-col items-center">
            <div class="flex">
              <span @click="deleteDays()"
                class="cursor-pointer transform transition duration-400 hover:font-bold hover:text-red-500 hover:scale-[1.5]">
                {{ days }}
              </span>
            </div>
            <strong class='group-hover:text-red-500 group-hover:block hidden'>⚠️ Supprimer le nombre de jours</strong>
          </div>
          <input type="submit" value="Nombre de jours" class="p-2 bg-green-500 rounded-2xl mt-2 cursor-pointer" />
        </form>
      </div>

      <div class="w-[90%] p-4 mb-8">
        <form @submit.prevent="onSubmitUsers" class="add-form flex items-center justify-center flex-col">
          <div class="form-control flex flex-col items-center justify-center w-[80%] mb-4">
            <label class="mb-2">👇👇Nom des personnes à la suite avec un espace ex : Lucas Yannick Jason👇👇</label>
            <textarea type="text" class="border border-black rounded w-full h-[5rem]" v-model="inputUsers" name="name"
              placeholder="Prenom" />
          </div>
          <span>Actuel : </span>
          <div v-if="users.length" class="group text-lg h-auto flex flex-col items-center">
            <div class="flex flex-wrap">
              <span v-for="user in users" @click="deleteUser(user.name)"
                class="cursor-pointer mx-2 transform transition duration-400 opacity-60 hover:opacity-100 hover:font-bold hover:text-red-500 hover:scale-[1.3]">
                <b> </b>
                😃 {{ user.name }}
                <b></b>
              </span>
            </div>
            <strong class='group-hover:text-red-500 group-hover:block hidden'>⚠️ Supprimer la personne</strong>
          </div>
          <input type="submit" value="Ajouter des personnes" class="p-2 bg-green-500 rounded-2xl mt-2 cursor-pointer" />
        </form>
      </div>

      <div class="w-[90%] p-4">
        <form @submit.prevent="onSubmitTasks" class="add-form flex items-center justify-center flex-col">
          <div class="form-control flex items-center justify-center w-[80%] mb-4">
            <div>
              <label for="taskName" class="mb-2">👇👇Nom de la tache👇👇</label>
              <input type="text" id="taskName" name="taskName" class="border border-black rounded w-full h-[2rem]"
                v-model="inputTasksName" placeholder="Nom de la tache" />
            </div>
            <div>
              <label for="taskNbUser" class="flex">Nombre de personnes pour cette tache 0️⃣1️⃣2️⃣3️⃣...</label>
              <input type="number" id="taskNbUser" name="taskNbUser" min="0" max="100" v-model="inputTasksNbUser"
                class="border border-black rounded w-12 h-[2rem]" placeholder="0">
            </div>
          </div>
          <span>Actuel : </span>
          <div v-if="tasks.length > 0" class="group text-lg h-auto flex flex-col items-center">
            <div class="flex flex-wrap">
              <span v-for="task in tasks" @click="deleteTask(task.name)"
                class="cursor-pointer mx-2 transform transition duration-400 opacity-60 hover:opacity-100 hover:font-bold hover:text-red-500 hover:scale-[1.3]">
                {{ task.name }}{{ task.nbUser }} ➡️ <b> </b>
              </span>
            </div>
            <strong class='group-hover:text-red-500 group-hover:block hidden'>⚠️ Supprimer la tache</strong>
          </div>
          <input type="submit" value="Ajouter une tache" class="p-2 bg-green-500 rounded-2xl mt-2 cursor-pointer" />
        </form>
      </div>
    </div>

    <div class="flex flex-wrap">
      <span v-for="user in users" :key="user.name" @click="userToview = user.name" class="mr-2 cursor-pointer"
        :class="user.tasks.length !== days ? 'text-red-400' : 'text-green-600'">
        {{ user.name }}+ {{ user.tasks.length }}</span>
    </div>
    <template v-if="users.length">
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
    </template>


    <div
      class="cursor-pointer rounded-full h-[100px] w-[100px] m-auto bg-green-500 flex items-center justify-center font-bold text-white text-2xl"
      @click="launch">GO</div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";

interface user {
  name: string;
  tasks: { day: number; name: string }[];
}
interface task {
  name: string;
  nbUser: number;
}

onMounted(() => {
  tasks.value = JSON.parse(localStorage.getItem('tasks') ?? '[]');
  users.value = JSON.parse(localStorage.getItem('users') ?? '[]');
  days.value = JSON.parse(localStorage.getItem('days') ?? '0');
});

const userToview = ref();
const days = ref(0);
const users = ref<user[]>([]);
const tasks = ref<task[]>([]);
const inputUsers = ref("");
const inputTasksName = ref("");
const inputTasksNbUser = ref(0);
const inputDays = ref(0);

function onSubmitUsers() {
  if (!inputUsers.value) {
    return;
  }
  const arrayUsers = inputUsers.value.split(' ');
  users.value = [];
  arrayUsers.forEach((u) => {
    if (u.trim() !== '') {
      const newUser: user = { name: u, tasks: [] };
      users.value.push(newUser);
    }
  })
  localStorage.setItem('users', JSON.stringify(users.value));

}
function onSubmitTasks() {
  if (!inputTasksName.value || !inputTasksNbUser.value) {
    return;
  }
  tasks.value.push({ name: inputTasksName.value, nbUser: inputTasksNbUser.value });
  localStorage.setItem('tasks', JSON.stringify(tasks.value));
  inputTasksName.value = "";
  inputTasksNbUser.value = 0;
}
function onSubmitDays() {
  if (!inputDays.value) {
    return;
  }

  days.value = inputDays.value;
  localStorage.setItem('days', JSON.stringify(days.value));
}
const persPerTask = computed(() => {
  return Math.round(users.value.length / tasks.value.length);
});
function launch() {

  if (checkUsersToTasks()) {
    //Pour chaque jours
    for (let day = 0; day <= days.value - 1; day++) {
      // let array: user[] = users.value;


      //Pour chaque taches 
      tasks.value.forEach((task) => {
        let array: user[] = fisherYatesShuffle(users.value);
        let nbUsersTask = 0;

        array.forEach((user) => {
          const lastTask = user.tasks.find((t) => t.day === day - 1);
          if (
            (nbUsersTask < task.nbUser &&
              lastTask?.name !== task.name &&
              countSameTask(user, task.name) < Math.ceil(((tasks.value.length * days.value) / users.value.length))) ||
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
  tasks.value.forEach((task) => {
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

function deleteUser(name: string) {
  users.value.splice(users.value.findIndex((u) => u.name === name), 1)
  if (users.value.length > 0) {
    localStorage.setItem('users', JSON.stringify(users.value));
  } else {
    localStorage.removeItem('users');
  }
}
function deleteTask(name: string) {
  tasks.value.splice(tasks.value.findIndex((t) => t.name === name), 1)
  if (tasks.value.length > 0) {
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
  } else {
    localStorage.removeItem('tasks');
  }
}
function deleteDays() {
  days.value = 0;
  localStorage.removeItem('days');
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
// const tasks: task = [
// {
//   name: "sandwichs",
//   nbUser: 3,
// },
// {
//   name: "poubelles",
//   nbUser: 3,
// },
// {
//   name: "petit dej",
//   nbUser: 3,
// },
// {
//   name: "vaisselle pti dej",
//   nbUser: 4,
// },
// {
//   name: "table",
//   nbUser: 4,
// },
// {
//   name: "repas",
//   nbUser: 4,
// },
// {
//   name: "vaisselle soir",
//   nbUser: 4,
// },
// ];
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
