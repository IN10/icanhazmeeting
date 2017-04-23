<template>
    <div class="notification is-success" v-if="live">
        {{ name }} is voor jou gereserveerd tot {{ hours }}:{{ minutes }}
    </div>
</template>

<script>
import Event from '../Event';

export default {
    name: 'notification',
    data() {
        return { name: null, hours: null, minutes: null, live: false };
    },
    mounted() {
        Event.$on('claimed', this.triggerNotification);
    },
    methods: {
        triggerNotification(data) {
            this.name = data.name;

            const end = new Date(data.end);
            this.hours = `0${end.getHours()}`.slice(-2);
            this.minutes = `0${end.getMinutes()}`.slice(-2);

            this.live = true;
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
