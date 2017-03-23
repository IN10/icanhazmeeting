window.RoomTracker = {

    init: function() {
        RoomTracker.createRows(config.rooms);
        RoomTracker.loginWithGoogle();
    },

    /**
     * Populate the table with all configured rooms
     * @param  {Array} rooms
     */
    createRows: function(rooms) {
        var template = document.querySelector('table tbody tr');

        rooms.forEach(function(room) {
            var row = template.cloneNode(true);
            row.id = room.id;
            row.querySelector('.name').innerHTML = room.name;
            document.querySelector('table tbody').appendChild(row);
        });

        template.remove();
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

            // Parse and setup datastructures
            var row = document.getElementById(room.id);
            var data = response.result.calendars[room.resourceID];
            var events = data.busy;

            // References to the cells of the row
            var currentStatus = row.querySelector('.current_status');
            var currentDuration = row.querySelector('.current_duration');
            var upcomingStatus = row.querySelector('.upcoming_status');

            // Clear the room! (eh, row!)
            row.querySelectorAll('.indicator, .current_status, .current_duration, .upcoming_status, .upcoming_duration').forEach(function(cell){
                cell.innerHTML = '&nbsp;';
            });

            // If no data is given, show a warning
            if (!data) {
                RoomTracker.setIndicator(row, null);
                currentStatus.innerHTML = 'Geen informatie beschikbaar';
                return;
            }

            // If no events are added, the room is free for the rest of the day
            if (events.length == 0) {
                RoomTracker.setIndicator(row, true);
                currentStatus.innerHTML = 'De rest van de dag beschikbaar';
                return;
            }

            // If currently free, show that and the upcoming event
            var now = new Date();
            var start = new Date(events[0].start);
            var end = new Date(events[0].end);
            if (now < start) {
                RoomTracker.setIndicator(row, true);
                currentStatus.innerHTML = 'Vrij tot '+RoomTracker.printTime(start)+' uur';
                currentDuration.innerHTML = RoomTracker.diffInMinutes(now, start)+' minuten';
                upcomingStatus.innerHTML = 'Bezet tot '+RoomTracker.printTime(end)+' uur';
                return;
            }

            // Currently occupied, show that in the first column
            RoomTracker.setIndicator(row, false);
            currentStatus.innerHTML = 'Bezet tot '+RoomTracker.printTime(end)+' uur';
            currentDuration.innerHTML = RoomTracker.diffInMinutes(now, end)+' minuten';

            // If there are no further events planned, the rest of the day is free
            if (events.length == 1) {
                upcomingStatus.innerHTML = 'De rest van de dag beschikbaar';
            }

            // Otherwise, show the time until the second event
            var secondStart = new Date(events[1].start);
            upcomingStatus.innerHTML = 'Vrij tot '+RoomTracker.printTime(secondStart)+' uur';
        });
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
        var indicator = row.querySelector('.indicator');
        if (free === null) {
            indicator.innerHTML = '<span class="tag is-medium">Onbekend</span>';
        }
        else if (free === true) {
            indicator.innerHTML = '<span class="tag is-medium is-success">Vrij</span>';
        }
        else {
            indicator.innerHTML = '<span class="tag is-medium is-danger">Bezet</span>';
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

// Initialize when the DOM is ready
if (document.readyState != 'loading'){
    RoomTracker.init();
} else {
    document.addEventListener('DOMContentLoaded', RoomTracker.init);
}
