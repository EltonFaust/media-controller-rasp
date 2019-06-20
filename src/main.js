import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import 'simple-keyboard/build/css/index.css';

import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
