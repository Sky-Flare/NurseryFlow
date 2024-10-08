import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './index.css'; // Assurez-vous que Tailwind CSS est importé ici
import { router } from './router'; // Si vous avez un routeur, sinon ignorez cette ligne

import { library } from '@fortawesome/fontawesome-svg-core';

/* import font awesome icon component */

/* import specific icons */
import { faBaby, faPlus, faSortNumericDesc, faSpinner, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { faCircleHalfStroke, faSortAlphaAsc, faSortAlphaDesc, faSortNumericAsc, faUserPlus } from '@fortawesome/free-solid-svg-icons';

/* add icons to the library */
library.add(faPlus, faTrash, faCircleHalfStroke, faSortAlphaAsc, faSortAlphaDesc, faSortNumericAsc, faSortNumericDesc, faUserPlus, faBaby, faUser, faSpinner);

createApp(App).use(router).use(createPinia()).mount('#app');
