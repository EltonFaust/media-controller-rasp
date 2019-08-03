import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions';
import mutations from './mutations';
import getters from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        home: {
            minLines: 2,
            itemsByLine: 3,
            showMediaControls: true,
            actions: [],
        },
    },
    actions,
    mutations,
    getters,
});
