<template>
    <div class="column is-4 room">
        <div class="room box">
            <article class="media">
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong class=name>{{ config.name }}</strong>
                            <span class="is-pulled-right indicator tag" v-bind:class="indicatorClass">{{ durationDescription }} {{ statusText }}</span>
                        </p>
                        <p>
                            <claim v-bind:free="free" v-bind:duration="duration"
                                   v-bind:resourceID="config.resourceID" v-bind:roomName="config.name" />
                        </p>
                    </div>
                </div>
            </article>
        </div>
    </div>
</template>

<script>
import Event from '../Event';
import Claim from './Claim';

export default {
    name: 'room',
    props: ['config'],
    components: {
        Claim,
    },

    data() {
        return {
            freebusy: [],
        };
    },

    mounted() {
        Event.$on('signedIn', this.getFreeBusyInformation);
        Event.$on('claimed', this.getFreeBusyInformation);
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
                this.freebusy = response.result.calendars[this.config.resourceID].busy;
                setTimeout(this.getFreeBusyInformation, 15 * 1000);
            });
        },
    },

    computed: {
        /**
         * Whether the room is currently free
         * @return {boolean} true if free, false otherwise
         */
        free() {
            if (this.freebusy.length === 0) {
                return true;
            }

            const now = new Date();
            const start = new Date(this.freebusy[0].start);
            const end = new Date(this.freebusy[0].end);

            return (now < start || now > end);
        },

        /**
         * How long the current status will last, in minutes
         * @return {integer}
         */
        duration() {
            let duration = null;
            const now = new Date();
            if (this.freebusy.length === 0) {
                const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                duration = tomorrow - now;
            } else {
                const start = new Date(this.freebusy[0].start);
                if (now < start) {
                    duration = start - now;
                } else {
                    const end = new Date(this.freebusy[0].end);
                    duration = end - now;
                }
            }
            return Math.floor(duration / 60 / 1000);
        },

        /**
         * Human-readable textual description of current occupancy status
         * @return {string}
         */
        statusText() {
            return this.free ? 'vrij' : 'bezet';
        },

        /**
         * Duration description for human consumption
         * @return {string} either "X min" or "Hele dag"
         */
        durationDescription() {
            if (this.freebusy.length === 0) {
                return 'Hele dag';
            }

            if (this.duration > 60) {
                return '1+ uur';
            } else if (this.duration === 60) {
                return '1 uur';
            }

            return `${this.duration} min`;
        },

        /**
         * Class switcher for the indicator, green when free, red otherwise
         * @return {string}
         */
        indicatorClass() {
            return this.free ? 'is-success' : 'is-danger';
        },
    },
};
</script>

<style scoped>
.room {
    min-height: 7em;
}
</style>
