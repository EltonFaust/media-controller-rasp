<template>
    <b-container class="nav-actions">
        <b-row>
            <b-col class="text-left">
                <b-link @click="$router.back()">
                    <i class="material-icons">arrow_back</i> Back
                </b-link>
            </b-col>

            <b-col class="text-center" v-if="hasCentralAction">
                <slot name="central"></slot>
            </b-col>

            <b-col class="text-right" v-if="hasAdditionalAction">
                <slot></slot>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    name: 'NavActions',
    computed: {
        hasCentralAction() {
            return typeof this.$slots.central !== 'undefined';
        },
        hasAdditionalAction() {
            return typeof this.$slots.default !== 'undefined';
        },
    },
};
</script>

<style lang="scss" scoped>
    .nav-actions {
        padding: 3px 10px;

        > .row {
            margin-right: -10px;
            margin-left: -10px;

            a {
                color: $body-color;
            }
        }
    }
</style>
