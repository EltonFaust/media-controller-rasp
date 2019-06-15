<template>
    <div class="note-drawn">
        <b-container fluid class="go-back">
            <router-link to="/">&lt; go back</router-link>
        </b-container>
        <b-container fluid class="drawning-area" id="note-drawning"></b-container>
        <b-container fluid class="drawn-options text-center">
            <b-button variant="success">Save</b-button>
            <b-button variant="warning">Discard</b-button>
        </b-container>
    </div>
</template>

<style lang="scss">
    .note-drawn {
        display: flex;
        flex-direction: column;
        height: 100%;

        .drawning-area {
            flex: 1;

            canvas {
                width: 100%;
                height: 100%;
            }
        }
    }
</style>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';

import * as CanvasFreeDrawing from 'canvas-free-drawing';

export default {
    name: 'note-drawn',
    data() {
        return {
            drawn: null,
        };
    },
    mounted() {
        const el = document.querySelector('.note-drawn .drawning-area');
        // alert('JSON.stringify(CanvasFreeDrawing)');
        // console.log(CanvasFreeDrawing);
        // alert(JSON.stringify(CanvasFreeDrawing));
        // initialize
        this.drawn = new CanvasFreeDrawing.default({
            elementId: 'note-drawning',
            width: el.offsetWidth,
            height: el.offsetHeight - 5,
        });

        // set properties
        this.drawn.setLineWidth(10); // in px
        this.drawn.setBackground([0, 0, 0]); // in RGB
        this.drawn.setStrokeColor([255, 255, 255]); // in RGB
    },
    // components: {
    //     HelloWorld,
    // },
    // methods: {
    //     clk() {
    //         // window.test();
    //         alert(window.ipcRenderer.sendSync('synchronous-message', 'ping'));

    //         window.ipcRenderer.on('asynchronous-reply', (event, arg) => {
    //             alert(arg);
    //         });

    //         window.ipcRenderer.send('asynchronous-message', 'ping');
    //     },
    // },
};
</script>
