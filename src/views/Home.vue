<template>
    <div class="home">
        <b-container fluid class="actions">
            <b-row v-for="(group, gidx) of actionGroups" :key="gidx">
                <b-col xs="4" v-for="(item, iidx) of group" :key="iidx">
                    <router-link :to="item.to" class="border rounded border-primary bg-primary text-white">
                        <div class="action-label">
                            <div></div>
                            <div>{{ item.label }}</div>
                        </div>
                    </router-link>
                </b-col>
            </b-row>
        </b-container>
        <b-container class="text-center">
            blabla
        </b-container>
        <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
        <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    </div>
</template>

<style lang="scss">
    .home {
        display: flex;
        flex-direction: column;
        height: 100%;

        .actions {
            flex: 1;
            display: flex;
            flex-direction: column;

            .row {
                flex: 50%;
                margin-left: -10px;
                margin-right: -10px;

                .col {
                    padding: 10px;

                    a {
                        display: flex;
                        height: 100%;
                        align-items: center;
                        text-align: center;

                        .action-label {
                            flex: 1;
                        }
                    }
                }
            }
        }
    }
</style>

<script>
import 'material-design-icons-iconfont/dist/material-design-icons.css';
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
// import ipcRenderer from 'electron';

export default {
    name: 'home',
    data: () => (
        {
            actions: [
                { to: { name: 'note-drawn' }, label: 'Nota' },
                { to: { name: 'notes' }, label: 'Notas' },
                { to: { name: 'note-drawn' }, label: 'Nota' },
                { to: { name: 'note-drawn' }, label: 'Nota' },
                { to: { name: 'note-drawn' }, label: 'Nota' },
                { to: { name: 'note-drawn' }, label: 'Nota' },
            ],
        }
    ),
    computed: {
        actionGroups() {
            const groups = [];

            this.actions.forEach((item, idx) => {
                if (idx % 3 === 0) {
                    groups.push([]);
                }

                groups[groups.length - 1].push(item);
            });

            return groups;
        },
    },
    // components: {
    //     HelloWorld,
    // },
    methods: {
        // clk() {
        //     // window.test();
        //     // alert(window.ipcRenderer.sendSync('synchronous-message', 'ping'));

        //     // window.ipcRenderer.on('asynchronous-reply', (event, arg) => {
        //     //     alert(arg);
        //     // });

        //     // window.ipcRenderer.send('asynchronous-message', 'ping');
        // },
    },
};
</script>
