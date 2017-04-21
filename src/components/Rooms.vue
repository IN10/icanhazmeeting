<template>
    <div class="container rooms is-clearfix">
        <div class="columns" v-for="row in rows">
            <room v-for="room in row" :key="room.id" v-bind:config="room" v-bind:freebusy="freebusy[room.resourceID].busy"></room>
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
            freebusy: {},
        };
    },
    mounted() {
        Event.$on('signInStatusChanged', this.updateRooms);
    },

    methods: {
        updateRooms(signedIn) {
            if (!signedIn) {
                return;
            }

            // Flatten the rows out of the rooms
            const rooms = [].concat(...Config.rooms);

            const now = new Date();
            const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            /* global gapi */
            gapi.client.calendar.freebusy.query({
                maxResults: 100,
                timeMin: now,
                timeMax: tomorrow,
                items: rooms.map(room => ({ id: room.resourceID })),
            }).then((response) => {
                this.freebusy = response.result.calendars;
                setTimeout(this.updateRooms, 15 * 1000);
            });
        },
    },
};
</script>

<style scoped>
.rooms {
    margin-top: 1em;
}
</style>
