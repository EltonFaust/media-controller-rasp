<template>
    <div class="page-media">
        <nav-actions></nav-actions>
        <div class="configure">
            <template v-if="$store.state.media.serverAddress.length">
                <div>
                    <img :src="qrCodeSrc"/>
                </div>
                <div>
                    <div class="address" v-for="address of $store.state.media.serverAddress" :key="address">
                        {{ address }}/configure
                        <i class="material-icons" v-if="qrCodeFor != address" @click="createQrCodeFor(address)">add_to_home_screen</i>
                    </div>
                </div>
            </template>
            <template v-else>
                <button class="btn btn-primary" @click="startServer">Configure</button>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .page-media {
        height: 100%;

        .configure {
            text-align: center;

            .address {
                padding: 5px;
            }
        }
    }
</style>

<script>
import * as QRCode from 'qrcode';
// import * as PlexAPI from 'plex-api';
import { ACTIONS } from '@/store/_types';

export default {
    name: 'media',
    data() {
        return {
            qrCodeSrc: null,
            qrCodeFor: null,
        };
    },
    methods: {
        startServer() {
            this.$store.dispatch(ACTIONS.START_MEDIA_SERVER).then(() => {
                const address = this.$store.state.media.serverAddress[0];

                if (address) {
                    this.createQrCodeFor(address);
                }
            });
        },
        createQrCodeFor(address) {
            this.qrCodeFor = address;

            QRCode.toDataURL(`${address}/configure`, { errorCorrectionLevel: 'H', width: 180 }, (err, url) => {
                this.qrCodeSrc = url;
            });
        },
    },
    mounted() {
        const address = this.$store.state.media.serverAddress[0];

        if (address) {
            this.createQrCodeFor(address);
        }
        // QRCode.toDataURL('http://localhost:8888', { errorCorrectionLevel: 'H', width: 180 }, (err, url) => {
        //     this.qrCodeSrc = url;
        // });

        // const client = new PlexAPI({
        //     hostname: 'localhost',
        //     token: '',
        //     options: {
        //         product: 'MediaController',
        //         deviceName: 'RaspberryMediaController',
        //     },
        // });

        // client.query('/').then((result) => {
        //     console.log('%s running Plex Media Server v%s', result.MediaContainer.friendlyName, result.MediaContainer.version);
        //     // array of children, such as Directory or Server items
        //     // will have the .uri-property attached
        //     console.log(result);
        //     // console.log(result._children);
        // }, (err) => {
        //     console.error('Could not connect to server', err);
        // });
        // window.ipcRenderer.once('note-list-drawns-reply', (event, notes) => {
        //     this.notes = notes;
        // });

        // window.ipcRenderer.send('note-list-drawns');
    },
};
</script>
