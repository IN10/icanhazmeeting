window.RoomTracker = {

    init: function() {
        RoomTracker.loginWithGoogle();
    },


    /**
     * Load vacancy information for all rooms
     */
    updateRooms: function() {
        console.log('Doing stuff!');
    },

    /**
     * Handle the Google OAuth 2.0 authorization flow
     */
    loginWithGoogle: function() {
        var modal = document.querySelector('.modal');

        var signInCallback = function(isSignedIn) {
            console.log('Signed in', isSignedIn);
            if (isSignedIn) {
                modal.classList.remove('is-active');
                RoomTracker.updateRooms();
            }
            else {
                modal.classList.add('is-active');
            }
        };

        gapi.load('client:auth2', function() {
            gapi.client.init({
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
                clientId: config.oauth.client_id,
                scope: "https://www.googleapis.com/auth/calendar.readonly",
            }).then(function () {
                // Setup sign-in callback and trigger it (if previously logged-in)
                gapi.auth2.getAuthInstance().isSignedIn.listen(signInCallback);
                signInCallback(gapi.auth2.getAuthInstance().isSignedIn.get());
                // Button to start sign-in process
                document.querySelector('.modal a.button').addEventListener('click', function (event) {
                    gapi.auth2.getAuthInstance().signIn();
                });
            });
        });
    },
};

if (document.readyState != 'loading'){
    RoomTracker.init();
} else {
    document.addEventListener('DOMContentLoaded', RoomTracker.init);
}
