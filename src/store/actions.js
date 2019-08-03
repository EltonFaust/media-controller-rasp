
import { ACTIONS, MUTATIONS } from './_types';

export default {
    [ACTIONS.FETCH_HOME_CONFIG]: ({ commit }) => new Promise((resolve) => {
        commit(MUTATIONS.SET_HOME_CONFIG);
        resolve();
    }),
};
