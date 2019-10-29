<template>
    <div class="page-media">
        <nav-actions></nav-actions>
        <div>
            <img :src="qrCodeSrc"/>
            <hr>
            Configure
            <button class="btn" @click="startServer">aaa</button>
            <hr>

        </div>
    </div>
</template>

<style lang="scss" scoped>
    .page-media {
        height: 100%;
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
        };
    },
    methods: {
        startServer() {
            this.$store.dispatch(ACTIONS.START_MEDIA_SERVER).then(() => {
                QRCode.toDataURL('http://localhost:8888', { errorCorrectionLevel: 'H', width: 180 }, (err, url) => {
                    this.qrCodeSrc = url;
                });
            });
        },
    },
    mounted() {
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
