<template>
    <button v-if="free"
            class="button is-small" v-bind:class="displayClass"
            @click="claim">
                {{ claimDuration }} min reserveren
            </button>
</template>

<script>
import Config from '../config';

export default {
    name: 'claim',
    props: ['free', 'duration', 'resourceID'],
    data() {
        return {
            // Basic state machine for the button, initial -> processing
            processingState: 'initial',
        };
    },

    computed: {
        claimDuration() {
            return Math.min(this.duration, 30);
        },

        displayClass() {
            if (this.processingState === 'initial') {
                return 'is-light';
            }
            return 'is-loading is-warning';
        },
    },

    methods: {
        /**
         * Create an event in this room in the available duration
         */
        claim() {
            // Only work when not processing already
            if (this.processingState !== 'initial') {
                return;
            }

            this.processingState = 'processing';

            // Determine start and end of desired meeting
            const start = new Date();
            const end = new Date(start.getTime() + (this.claimDuration * 60 * 1000));

            // Claim meeting
            /* global gapi */
            gapi.client.calendar.events.insert({
                calendarId: Config.meeting_calendar,
                resource: {
                    summary: 'I can haz meeting!',
                    description: 'Meeting ingeschoten via https://icanhazmeeting.public.in10projecten.nl',
                    start: { dateTime: start.toISOString() },
                    end: { dateTime: end.toISOString() },
                    attendees: [{ email: this.resourceID }],
                },
            }).execute(() => {
                this.$emit('claimed');
                this.processingState = 'initial';
            });
        },
    },
};
</script>
