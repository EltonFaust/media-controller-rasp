<template>
    <div id="app">
        <div class="loading" v-if="$store.state.isLoading">
            <center-content>
                <div><b-spinner></b-spinner></div>
                <div class="message">Loading...</div>
            </center-content>
        </div>
        <router-view class="page-content" :class="{ 'is-loading': $store.state.isLoading }"/>
    </div>
</template>

<style lang="scss" scoped>
    #app {
        > .loading {
            position: absolute;
            background: rgba($black, 0.9);
            color: $white;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 100;

            .message {
                margin-top: 10px;
                font-size: 30px;
            }
        }

        > .page-content {
            &.is-loading {
                overflow: hidden;
            }
        }
    }
</style>

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
    &, &:active {
        color: $highlight-secondary;
    }

    &.highlight {
        background-color: $highlight-primary;
        border-color: $highlight-primary;
    }

    &.highlight-outline {
        background-color: $highlight-secondary;
        color: $highlight-primary;
        border-color: $highlight-primary;
    }
}

.bg-highlight {
    background-color: $highlight-primary;
    color: $highlight-secondary;
}

.text-highlight {
    color: $highlight-primary;
}

.border-highlight {
    border-color: $highlight-primary;
}

.border-highlighter {
    border-color: darken($highlight-primary, 10%);
}

@if ($production) {
    #app, a {
        &, &:hover, &:active {
            cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=), none !important;
        }
    }
}

.material-icons {
    font-size: inherit !important;
    vertical-align: middle;
    // line-height: $line-height-base !important;
}

.btn.btn-fab {;
    position: fixed;
    bottom: 10px;
    right: 10px;;
    z-index: 50;
    display: inline-block;
    padding: .7rem;
    font-size: 1.1rem;
    line-height: 1;
    border-radius: 50%;
    text-align: center;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5), 3px 3px 3px rgba(0, 0, 0, 0.25);
    cursor: default;
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
