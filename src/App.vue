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

html, body, #app {
    height: 100%;
    overflow: hidden;
    user-select: none;
}
a {
    text-decoration: none !important;
}

.material-icons {
    font-size: inherit !important;
    // line-height: $line-height-base !important;
}
.btn .material-icons {
    vertical-align: middle;
}

</style>
