<template>
    <b-container class="nav-actions">
        <b-row>
            <b-col class="text-left"><b-link :to="{ name: 'home' }"><i class="material-icons">arrow_back</i> Home</b-link></b-col>
            <b-col class="text-right"><slot></slot></b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    name: 'NavActions',
};
</script>

<style lang="scss" scoped>
    .nav-actions {
        padding: 3px 10px;

        .row {
            margin-right: -10px;
            margin-left: -10px;

            a {
                color: $white;
            }
        }
    }
</style>
