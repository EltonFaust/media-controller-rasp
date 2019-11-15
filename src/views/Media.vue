<template>
    <div class="page-media">
        <nav-actions></nav-actions>
        <center-content>
            <template v-if="$store.state.media.serverAddress.length">
                <template v-if="!$store.state.media.isConfigured">
                    <div>Access on any device to configure you media server</div>
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
                    aa
                </template>
            </template>
            <template v-else>
                <button class="btn btn-primary" @click="startServer">Start server</button>
            </template>
        </center-content>
    </div>
</template>

<style lang="scss" scoped>
    .page-media {
        height: 100%;
        display: flex;
        flex-direction: column;

        .center-content {
            flex: 1;

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
                if (!this.$store.state.media.isConfigured) {
                    const address = this.$store.state.media.serverAddress[0];

                    if (address) {
                        this.createQrCodeFor(address);
                    }

                    this.$store.dispatch(ACTIONS.WAIT_MEDIA_CONFIGURE);
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
        if (!this.$store.state.media.isConfigured) {
            const address = this.$store.state.media.serverAddress[0];

            if (address) {
                this.createQrCodeFor(address);
            }
        }
    },
};
</script>
