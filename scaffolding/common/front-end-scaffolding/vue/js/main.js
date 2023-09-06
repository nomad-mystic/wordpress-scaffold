// DOCS: https://vuejs.org/guide/introduction.html

import { createApp } from 'vue'
import TestComponent from './components/TestComponent.vue';

// Add your components here
const vueComponents = {
    TestComponent,
};

// Initialize your Vue components and root properties
const app = createApp({
    components: vueComponents,
});

// Add to DOM
app.mount('#app');
