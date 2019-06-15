<template>
    <div class="home">
        <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
        <div>
            <button @click="clk">teste</button>
        </div>
        <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
// import ipcRenderer from 'electron';

export default {
    name: 'home',
    mounted() {
    },
    // components: {
    //     HelloWorld,
    // },
    methods: {
        clk() {
            // window.test();
            // alert(window.ipcRenderer.sendSync('synchronous-message', 'ping'));

            // window.ipcRenderer.on('asynchronous-reply', (event, arg) => {
            //     alert(arg);
            // });

            // window.ipcRenderer.send('asynchronous-message', 'ping');
        },
    },
};
</script>
