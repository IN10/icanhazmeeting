<template>
    <div class="column is-3 room">
        <div class="room box">
            <article class="media">
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong class=name>{{ config.name }}</strong>
                            <span class="is-pulled-right indicator tag" v-bind:class="indicatorClass">{{ duration }}</span>
                        </p>
                    </div>
                </div>
            </article>
        </div>
    </div>
</template>

<script>
import Event from '../Event';

export default {
    name: 'room',
    props: ['config'],

    data() {
        return {
            freebusy: [],
        };
    },

    mounted() {
        Event.$on('signedIn', this.getFreeBusyInformation);
    },

    methods: {
        getFreeBusyInformation() {
            const now = new Date();
            const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

            /* global gapi */
            gapi.client.calendar.freebusy.query({
                timeMin: now,
                timeMax: tomorrow,
                items: [{ id: this.config.resourceID }],
            }).then((response) => {
                this.events = response.result.calendars[this.config.resourceID];
                setTimeout(this.getFreeBusyInformation, 15 * 1000);
            });
        },
    },

    computed: {
        // The status indicator of a
        duration() {
            if (this.freebusy.length === 0) {
                return 'Hele dag';
            }

            const now = new Date();
            const start = new Date(this.freebusy[0].start);
            const end = new Date(this.freebusy[0].end);
            let minutes = null;

            if (now < start) {
                minutes = Math.floor((start - now) / 1000 / 60);
            } else {
                minutes = Math.floor((end - now) / 1000 / 60);
            }
            return `${minutes} min`;
        },

        indicatorClass() {
            if (this.freebusy.length === 0) {
                return 'is-success';
            }

            const now = new Date();
            const start = new Date(this.freebusy[0].start);
            const end = new Date(this.freebusy[0].end);

            if (now > start && now < end) {
                return 'is-danger';
            }
            return 'is-success';
        },
    },
};
</script>

<style scoped>
.indicator {
    width: 6em;
}
</style>
