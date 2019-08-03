<template>
    <div class="home">
        <b-container fluid class="actions">
            <b-row v-for="(group, gidx) of actionGroups" :key="gidx">
                <b-col xs="4" v-for="(item, iidx) of group" :key="iidx">
                    <router-link v-if="item !== null" :to="item.to" class="border rounded border-primary bg-primary text-white">
                        <div class="action-label">
                            <div class="item-icon"><i class="material-icons">{{ item.icon }}</i></div>
                            <div class="item-label">{{ item.label }}</div>
                        </div>
                    </router-link>
                </b-col>
            </b-row>
        </b-container>
        <div class="settings-button">
            <router-link tag="div" class="click-area" :to="{ name: 'settings' }"></router-link>
            <router-link tag="div" class="click-button" :to="{ name: 'settings' }"><i class="material-icons">settings</i></router-link>
        </div>
        <media-controls></media-controls>
        <div class="close-button">
            <div class="click-area" @click="close"></div>
            <div class="click-button" @click="close"><i class="material-icons">close</i></div>
        </div>
        <b-modal id="modal-close" title="Close app" @ok="confirmClose">
            <p class="my-4">Do you want to close the app?</p>
        </b-modal>
    </div>
</template>

<style lang="scss" scoped>
    .home {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .actions {
            flex: 1;
            display: flex;
            flex-direction: column;

            .row {
                flex: 50%;
                margin-left: -10px;
                margin-right: -10px;

                .col {
                    padding: 5px;

                    a {
                        display: flex;
                        height: 100%;
                        align-items: center;
                        text-align: center;

                        .action-label {
                            flex: 1;

                            .item-icon {
                                font-size: 2rem;
                            }
                        }
                    }
                }
            }
        }

        .settings-button {
            left: -45px;

            .click-button {
                right: 20px;
                top: 18px;
            }
        }
        .close-button {
            right: -45px;

            .click-button {
                left: 20px;
                top: 20px;
            }
        }

        .settings-button,
        .close-button {
            padding: 5px;
            position: fixed;
            bottom: -45px;
            font-size: 20px;
            line-height: 1;
            z-index: 1;

            .click-area {
                width: 80px;
                height: 80px;
                background-color: $primary;
                transform: rotate(45deg);
            }

            .click-button {
                position: absolute;
            }
        }
    }
</style>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
// import ipcRenderer from 'electron';

export default {
    name: 'home',
    data: () => (
        {
            actions: [
                { to: { name: 'note-drawn' }, label: 'Note', icon: 'note_add' },
                { to: { name: 'notes' }, label: 'Notes', icon: 'notes' },
                { to: { name: 'cameras' }, label: 'Cameras', icon: 'videocam' },
                null,
                null,
                null,
                // { to: { name: 'note-drawn' }, label: 'Note', icon: 'note_add' },
                // { to: { name: 'note-drawn' }, label: 'Note', icon: 'note_add' },
                // { to: { name: 'note-drawn' }, label: 'Note', icon: 'note_add' },
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
    methods: {
        close() {
            this.$bvModal.show('modal-close');
        },
        confirmClose() {
            window.close();
        },
        // clk() {
        //     // window.test();
        //     // alert(window.ipcRenderer.sendSync('synchronous-message', 'ping'));

        //     // window.ipcRenderer.on('asynchronous-reply', (event, arg) => {
        //     //     alert(arg);
        //     // });

        //     // window.ipcRenderer.send('asynchronous-message', 'ping');
        // },
    },

    // asyncData() {
    //     return new Promise((resolve) => {
    //         console.log('aaa');

    //         window.setTimeout(() => {
    //             console.log('bbb');
    //             resolve();
    //         }, 5000);
    //     });
    // },
};
</script>
