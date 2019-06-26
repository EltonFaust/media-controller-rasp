<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<style lang="scss">
@import 'node_modules/bootstrap/scss/functions';
@import 'node_modules/bootstrap/scss/variables';

$body-bg: $black;
$body-color: $white;
$modal-content-color: $gray-900;

@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';

html, body, #app {
    height: 100%;
    user-select: none;
}

a {
    text-decoration: none !important;
}

#app, a {
    cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=), none;
}

.material-icons {
    font-size: inherit !important;
    vertical-align: middle;
    // line-height: $line-height-base !important;
}

</style>
