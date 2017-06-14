<template>
    <div class="notification is-success" v-if="text">
        <span>{{ text }}</span>
    </div>
</template>

<script>
import Event from '../Event';

export default {
    name: 'notification',
    data() {
        return {
            text: null,
        };
    },
    mounted() {
        Event.$on('claimed', this.roomClaimed);
    },
    methods: {
        roomClaimed(data) {
            // Construct the text content of the notification
            const end = new Date(data.end);
            const hours = `0${end.getHours()}`.slice(-2);
            const minutes = `0${end.getMinutes()}`.slice(-2);
            this.text = `${data.name} is voor jou gereserveerd tot ${hours}:${minutes}`;

            // Show the notification for 20 seconds
            setTimeout(() => { this.text = null; }, 20 * 1000);
        },
    },
};
</script>

<style scope>
    .notification {
        margin-top: 1em;
    }
</style>
