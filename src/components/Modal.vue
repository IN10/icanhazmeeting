<template>
    <div class="modal is-active" v-if="isActive">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Aanmelden bij Google Calendar</p>
            </header>
            <section class="modal-card-body">
                <p>
                    Om de vergaderruimtes te tonen, hebben we toestemming nodig om je Google Calendar te lezen.
                </p>
            </section>
            <footer class="modal-card-foot">
                <a class="button is-primary" @click="authenticate">Aanmelden met Google Calendar</a>
            </footer>
        </div>
    </div>
</template>

<script>
import Config from '../config';
import Event from '../Event';

export default {
    name: 'modal',

    data() {
        return {
            isActive: true,
        };
    },

    mounted() {
        /* global gapi */
        gapi.load('client:auth2', () => {
            gapi.client.init({
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                clientId: Config.oauth_client_id,
                scope: 'https://www.googleapis.com/auth/calendar',
            }).then(() => {
                const callback = (isSignedIn) => {
                    this.isActive = !isSignedIn;
                    if (isSignedIn) {
                        Event.$emit('signedIn');
                    }
                };
                gapi.auth2.getAuthInstance().isSignedIn.listen(callback);
                callback(gapi.auth2.getAuthInstance().isSignedIn.get());
            });
        });
    },

    methods: {
        authenticate() {
            gapi.auth2.getAuthInstance().signIn();
        },
    },
};
</script>
