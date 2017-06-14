<template>
    <button v-if="shouldDisplay"
            class="button is-small" v-bind:class="displayClass"
            @click="claim">
                {{ claimDuration }} min reserveren
            </button>
</template>

<script>
import Event from '../Event';
import Config from '../config';

export default {
    name: 'claim',
    props: ['free', 'duration', 'resourceID', 'roomName'],
    data() {
        return {
            // Basic state machine for the button, initial -> processing
            processingState: 'initial',
        };
    },

    computed: {
        claimDuration() {
            return Math.min(this.duration - 1, 30);
        },

        displayClass() {
            if (this.processingState === 'initial') {
                return 'is-primary';
            }
            return 'is-loading is-warning';
        },

        shouldDisplay() {
            return this.free && this.claimDuration > 0;
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
            }).execute((response) => {
                const event = response.error ? 'claim-failed' : 'claimed';
                Event.$emit(event, { name: this.roomName, end });
                this.processingState = 'initial';
            });
        },
    },
};
</script>
