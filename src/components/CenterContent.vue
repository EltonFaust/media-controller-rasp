<template>
    <div class="center-content">
        <div class="inner-content">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.center-content {
    display: flex;
    width: 100%;
    height: 100%;

    > .inner-content {
        flex: 1 1 100%;
        align-self: center;
        text-align: center;
    }

    &.text-left > .inner-content {
        text-align: left;
    }
}
</style>
