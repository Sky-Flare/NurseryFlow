import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./index.css"; // Assurez-vous que Tailwind CSS est importé ici
import { router } from "./router"; // Si vous avez un routeur, sinon ignorez cette ligne

import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */

/* import specific icons */
import { all as allRegular } from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";
import EmployeeList from "./components/EmployeeList.vue";
import Childrenlist from "./components/ChildrenList.vue";
import Home from "./pages/Home.vue";

/* add icons to the library */
library.add(faPlus, faCircleHalfStroke);

createApp(App).use(router).use(createPinia()).mount("#app");
