<template>
    <div id="app">
        <!-- <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/note-drawn">Nota</router-link>
        </div> -->
        <router-view/>
    </div>
</template>

<style lang="scss">
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';

html, body, #app {
    height: 100%;
    overflow: hidden;
    user-select: none;
    background-color: black;
    color: white;
}
#app {
//     font-family: 'Avenir', Helvetica, Arial, sans-serif;
//     -webkit-font-smoothing: antialiased;
//     -moz-osx-font-smoothing: grayscale;
//     text-align: center;
//     color: #2c3e50;
}
// #nav {
//     padding: 30px;
//     a {
//         font-weight: bold;
//         color: #2c3e50;
//         &.router-link-exact-active {
//             color: #42b983;
//         }
//     }
// }
</style>
