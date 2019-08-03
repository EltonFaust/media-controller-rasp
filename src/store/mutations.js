import Vue from 'vue';

import { MUTATIONS } from './_types';
// import { ACTION_MODES, MUTATIONS } from './_types';

export default {
    [MUTATIONS.SET_HOME_CONFIG]: (state, config) => {
        Vue.set(state.home, 'minLines', config.min_lines);
        // state. =
    },
};
