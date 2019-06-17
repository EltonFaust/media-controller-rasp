<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<style lang="scss">
$body-bg: #000;
$body-color: #fff;

@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';
@import 'node_modules/bootstrap/scss/variables';

.material-icons {
    font-size: inherit !important;
    // line-height: $line-height-base !important;
}

html, body, #app {
    height: 100%;
    overflow: hidden;
    user-select: none;
}
a {
    text-decoration: none !important;
}
</style>
