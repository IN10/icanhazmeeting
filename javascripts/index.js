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
        var template = document.querySelector('.room');

        rooms.forEach(function(room) {
            var el = template.cloneNode(true);
            el.id = room.id;
            el.querySelector('.name').innerHTML = room.name;
            document.querySelector('.rooms').appendChild(el);
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
     * Run the main process to refresh data on a 30 second timer
     */
    tick: function() {
        console.log('tick');
        RoomTracker.getRoomData().then(RoomTracker.updateTable);
        setTimeout(RoomTracker.tick, 30*1000);
    },

    /**
     * Update the main table with the new data
     */
    updateTable: function(response) {
        console.log('Got freebusy response', response);

        config.rooms.forEach(function(room) {

            // Parse and setup datastructures
            var el = document.getElementById(room.id);
            var data = response.result.calendars[room.resourceID];
            var events = data.busy;

            // References to the output locations
            var currentStatus = el.querySelector('.current .status');
            var currentDuration = el.querySelector('.current .duration');
            var upcomingStatus = el.querySelector('.upcoming .status');

            // Clear the room!
            el.querySelectorAll('.indicator, .current .status, .current .duration, .upcoming .status').forEach(function(cell){
                cell.innerHTML = '&nbsp;';
            });

            // If no data is given, show a warning
            if (!data) {
                RoomTracker.setIndicator(el, null);
                currentStatus.innerHTML = 'Geen informatie beschikbaar';
                return;
            }

            // If no events are added, the room is free for the rest of the day
            if (events.length == 0) {
                RoomTracker.setIndicator(el, true);
                currentStatus.innerHTML = 'De rest van de dag beschikbaar';
                return;
            }

            // If currently free, show that and the upcoming event
            var now = new Date();
            var start = new Date(events[0].start);
            var end = new Date(events[0].end);
            if (now < start) {
                RoomTracker.setIndicator(el, true);
                currentStatus.innerHTML = 'Vrij tot '+RoomTracker.printTime(start)+' uur';
                currentDuration.innerHTML = RoomTracker.humanTimeDiff(now, start);
                upcomingStatus.innerHTML = 'Daarna bezet tot '+RoomTracker.printTime(end)+' uur';
                return;
            }

            // Currently occupied, show that in the first column
            RoomTracker.setIndicator(el, false);
            currentStatus.innerHTML = 'Bezet tot '+RoomTracker.printTime(end)+' uur';
            currentDuration.innerHTML = RoomTracker.humanTimeDiff(now, end);

            // If there are no further events planned, the rest of the day is free
            if (events.length == 1) {
                upcomingStatus.innerHTML = 'De rest van de dag beschikbaar';
            }

            // Otherwise, show the time until the second event
            var secondStart = new Date(events[1].start);
            upcomingStatus.innerHTML = 'Daarna vrij tot '+RoomTracker.printTime(secondStart)+' uur';
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
    humanTimeDiff: function(a, b) {
        var inMinutes = Math.round(Math.abs(a - b) / 60000);
        if (inMinutes <  60) {
            return inMinutes + ' min';
        }
        else {
            var hours = Math.floor(inMinutes / 60);
            var minutes = inMinutes % 60;
            return hours + ' uur ' + minutes + ' min';
        }
    },

    /**
     * Toggle the indicator tag on a row
     * @param {DOMElement} row
     * @param {boolean} free
     */
    setIndicator(el, free) {
        var indicator = el.querySelector('.indicator');
        if (free === null) {
            indicator.outerHTML = '<span class="indicator tag">Onbekend</span>';
        }
        else if (free === true) {
            indicator.outerHTML = '<span class="indicator tag is-success">Vrij</span>';
        }
        else {
            indicator.outerHTML = '<span class="indicator tag is-danger">Bezet</span>';
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
                RoomTracker.tick();
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
