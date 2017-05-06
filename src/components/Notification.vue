<template>
    <div class="notification" v-bind:class="displayClass" v-if="showNotification">
        <span>{{ text }}</span>
        <button class="button is-pulled-right" @click="undoAction">Ongedaan maken</button>
    </div>
</template>

<script>
import Event from '../Event';

export default {
    name: 'notification',
    data() {
        return {
            showNotification: false,
            text: '',
            displayClass: 'success',
            undoAction: () => {},
        };
    },
    mounted() {
        Event.$on('claimed', this.roomClaimed);
    },
    methods: {
        roomClaimed(data) {
            this.displayClass = 'is-success';

            // Construct the text content of the notification
            const end = new Date(data.end);
            const hours = `0${end.getHours()}`.slice(-2);
            const minutes = `0${end.getMinutes()}`.slice(-2);
            this.text = `${data.name} is voor jou gereserveerd tot ${hours}:${minutes}`;

            // Show the notification for 20 seconds
            this.showNotification = true;
            setTimeout(() => { this.live = false; }, 20 * 1000);
        },
    },
};
</script>

<style scope>
    .notification {
        margin-top: 1em;
    }
</style>
