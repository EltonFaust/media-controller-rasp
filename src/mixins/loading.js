
import { MUTATIONS } from '@/store/_types';

export default {
    methods: {
        setAsLoading(isLoading) {
            this.$store.commit(MUTATIONS.SET_AS_LOADING, isLoading);
        },
        waitLoadingFor(promise) {
            this.setAsLoading(true);
            promise.then(() => this.setAsLoading(false)).catch(() => this.setAsLoading(false));
        },
    },
};
