<template>
    <div class="container rooms is-clearfix">
        <div class="columns" v-for="row in rows">
            <room v-for="room in row" :key="room.id" v-bind:room="room"></room>
        </div>
    </div>
</template>

<script>
import Room from './Room';
import Config from '../config';
import Event from '../Event';

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
    mounted() {
        Event.$on('signInStatusChanged', (signedIn) => {
            // eslint-disable-next-line
            console.log('sign in status changed', signedIn);
        });
    },
};
</script>

<style scoped>
.rooms {
    margin-top: 1em;
}
</style>
