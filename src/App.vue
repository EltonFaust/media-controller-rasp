<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<style lang="scss">
$modal-header-padding: 10px;
$modal-inner-padding: 10px;

@import '~bootstrap/scss/bootstrap.scss';
@import '~bootstrap-vue/src/index.scss';

html, body, #app {
    height: 100%;
    user-select: none;
}

a {
    text-decoration: none !important;
}

@if ($production) {
    #app, a {
        cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=), none;
    }
}

.material-icons {
    font-size: inherit !important;
    vertical-align: middle;
    // line-height: $line-height-base !important;
}
</style>

<script>
export default {
    name: 'app',
    // computed() {
    // mounted() {
    //     console.log('aaa')
    // },
};
</script>
