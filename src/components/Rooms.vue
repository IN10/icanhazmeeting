<template>
    <div class="container rooms is-clearfix">
        <div class="columns" v-for="row in rows">
            <room v-for="room in row" :key="room.id" v-bind:config="room"></room>
        </div>
    </div>
</template>

<script>
import Room from './Room';
import Config from '../config';

export default {
    name: 'rooms',
    components: {
        Room,
    },
    data() {
        return {
            rows: Config.rooms,
        };
    },
};
</script>

<style scoped>
.rooms {
    margin-top: 1em;
}
</style>
