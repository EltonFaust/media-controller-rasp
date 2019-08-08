import Vue from 'vue';

import { MUTATIONS } from './_types';
// import { ACTION_MODES, MUTATIONS } from './_types';

export default {
    [MUTATIONS.SET_SETTINGS]: (state, config) => {
        Vue.set(state.home, 'minLines', config.home_min_lines);
        // state. =
    },
    [MUTATIONS.SET_HOME_ACTIONS]: (state, config) => {
        Vue.set(state.home, 'minLines', config.home_min_lines);
        // state. =
    },
};
