window.RoomTracker = {

    init: function() {
        RoomTracker.loginWithGoogle();
    },


    /**
     * Load vacancy information for all rooms
     */
    getRoomData: function() {
        var now = new Date();
        var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
        return gapi.client.calendar.freebusy.query({
            maxResults: 100,
            timeMin: now,
            timeMax: tomorrow,
            items: config.rooms.map(function(room){ return {id: room.resourceID}; }),
        });
    },

    /**
     * Update the main table with the new data
     */
    updateTable: function(response) {
        console.log('Got freebusy response', response);

        config.rooms.forEach(function(room) {

            // Get data, some utility variables
            var row = document.getElementById(room.id);
            var data = response.result.calendars[room.resourceID];
            var events = data.busy;
            var now = new Date();

            // Clear the room! (eh, row!)
            RoomTracker.clearRow(row);

            // If no data is given, show a warning
            if (!data) {
                RoomTracker.setRowUnknown(row);
                return;
            }

            // If no events are added, the room is free for the rest of the day
            if (events.length == 0) {
                RoomTracker.setIndicator(row, true);
                row.querySelector('.current_status').innerHTML = 'De rest van de dag beschikbaar';
                return;
            }

            // Process the first event into the now column
            RoomTracker.setRowNowInformation(row, events[0]);
        });
    },

    /**
     * Utility function to clear the contents of a row except the name of the room
     * @param  {DOMElement} row
     */
    clearRow: function(row) {
        row.querySelectorAll('.indicator, .current_status, .current_duration, .upcoming_status, .upcoming_duration').forEach(function(cell){
            cell.innerHTML = '&nbsp;';
        });
    },

    /**
     * Set a room to display an "missing data" status
     * @param {DOMElement} row
     */
    setRowUnknown: function(row) {
        row.querySelector('.indicator').innerHTML = '<span class="tag is-medium">Onbekend</span>';
        row.querySelector('.current_status').innerHTML = 'Geen informatie beschikbaar';
    },

    setRowNowInformation: function(row, event) {
        var now = new Date();
        var start = new Date(event.start);
        var end = new Date(event.end);

        if (now > start && now < end) {
            RoomTracker.setIndicator(row, false);
            row.querySelector('.current_status').innerHTML = 'Bezet tot '+RoomTracker.printTime(start)+' uur';
            row.querySelector('.current_duration').innerHTML = RoomTracker.diffInMinutes(now, start)+' minuten';
        }
        else {
            RoomTracker.setIndicator(row, true);
            row.querySelector('.current_status').innerHTML = 'Vrij tot '+RoomTracker.printTime(start)+' uur';
            row.querySelector('.current_duration').innerHTML = RoomTracker.diffInMinutes(now, start)+' minuten';
        }
    },

    /**
     * Pretty print the hour part of a date
     * @param  {Date} date
     * @return {String}
     */
    printTime: function(date) {
        return ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
    },

    /**
     * Return the difference in minutes between two dates
     * @param  {Date} a
     * @param  {Date} b
     * @return {integer}
     */
    diffInMinutes: function(a, b) {
        return Math.round(Math.abs(a - b) / 60000);
    },

    /**
     * Toggle the indicator tag on a row
     * @param {DOMElement} row
     * @param {boolean} free
     */
    setIndicator(row, free) {
        if (free) {
            row.querySelector('.indicator').innerHTML = '<span class="tag is-medium is-success">Vrij</span>';
        }
        else {
            row.querySelector('.indicator').innerHTML = '<span class="tag is-medium is-danger">Bezet</span>';
        }
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
                RoomTracker.getRoomData().then(RoomTracker.updateTable);
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
