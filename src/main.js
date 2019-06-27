import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import 'simple-keyboard/build/css/index.css';

import App from './App.vue';
import router from './router';

// import fooMixin from './mixns/foo';
// import barDirective from './directives/bar';
// import * as filters from './filters';

// Vue.component('baz', () => import('./components/Baz.vue'));
// Vue.mixin(fooMixin)
// Vue.directive('bar', barDirective);

// Object.keys(filters).forEach((key) => {
//     Vue.filter(key, filters[key]);
// });

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
