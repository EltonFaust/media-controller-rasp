import { sync } from 'vuex-router-sync';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import VueDragscroll from 'vue-dragscroll';

import 'simple-keyboard/build/css/index.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

import App from './App.vue';
import router from './router';
import store from './store/index';

// import fooMixin from './mixns/foo';
// import barDirective from './directives/bar';
// import * as filters from './filters';

Vue.component('media-controls', () => import(/* webpackChunkName: "component-media-controls" */ '@/components/MediaControls.vue'));
Vue.component('nav-actions', () => import(/* webpackChunkName: "component-nav-actions" */ '@/components/NavActions.vue'));
Vue.component('center-content', () => import(/* webpackChunkName: "component-center-content" */ '@/components/CenterContent.vue'));
// Vue.mixin(fooMixin)
// Vue.directive('bar', barDirective);

// Object.keys(filters).forEach((key) => {
//     Vue.filter(key, filters[key]);
// });

Vue.mixin({
    beforeRouteUpdate(to, from, next) {
        const { asyncData } = this.$options;

        if (asyncData) {
            asyncData({ store: this.$store, route: to }).then(next);
        } else {
            next();
        }
    },
});

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(VueDragscroll);

sync(store, router);

const app = new Vue({
    router,
    store,
    render: h => h(App),
});

router.onReady(() => {
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to);
        const prevMatched = router.getMatchedComponents(from);
        let diffed = false;

        const activated = matched.filter((c, i) => {
            if (diffed) {
                return diffed;
            }

            diffed = (prevMatched[i] !== c);

            if (!diffed && c.forceFetchNoMatched) {
                // diff route same view, force fetch data
                diffed = (to.name !== from.name);
            }

            return diffed;
        });

        const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _);

        if (!asyncDataHooks.length) {
            return next();
        }

        Promise.all(asyncDataHooks.map(hook => hook({ store, route: to }))).then(next);

        return true;
    });

    app.$mount('#app');
    router.replace('#');
});
