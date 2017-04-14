window.RoomTracker = {

    tickTimer: null,

    init: function() {
        RoomTracker.createRooms();
        RoomTracker.displayClock();
        RoomTracker.loginWithGoogle();
        RoomTracker.showQuote();

        document.querySelector('.rooms').addEventListener('click', RoomTracker.claimRoom);
    },

    /**
     * Populate the user interface with blocks for all configured rooms
     * @param  {Array} rooms
     */
    createRooms: function() {
        var root = document.querySelector('.rooms');
        var template = document.querySelector('#room_template');

        config.rooms.forEach(function(row) {
            // Create row to hold these rooms
            var target = document.createElement('div');
            target.classList.add('columns');
            root.appendChild(target);

            // Add rooms
            row.forEach(function(room){
                var el = template.cloneNode(true);
                el.id = "";
                el.querySelector('.room').id = room.id;
                el.querySelector('.room .name').innerHTML = room.name;
                target.appendChild(el);
            });
        });

        template.remove();
    },

    /**
     * Load vacancy information for all rooms
     */
    getRoomData: function() {
        // Flatten the rows out of the rooms
        var rooms = [].concat.apply([], config.rooms);

        var now = new Date();
        var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
        return gapi.client.calendar.freebusy.query({
            maxResults: 100,
            timeMin: now,
            timeMax: tomorrow,
            items: rooms.map(function(room){ return {id: room.resourceID}; }),
        });
    },


    /**
     * Run the main process to refresh data on a timer
     */
    tick: function() {
        console.log('tick');

        // Reset the timer (allows firing tick() manually)
        clearTimeout(RoomTracker.tickTimer);

        // Update the rooms
        RoomTracker.getRoomData().then(RoomTracker.updateUI);

        // Restart the timer
        RoomTracker.tickTimer = setTimeout(RoomTracker.tick, 15*1000);
    },

    /**
     * Update the main table with the new data
     */
    updateUI: function(response) {

        // Flatten the rows out of the rooms
        var rooms = [].concat.apply([], config.rooms);

        rooms.forEach(function(room) {
            // Parse and setup datastructures
            var el = document.getElementById(room.id);
            var data = response.result.calendars[room.resourceID];
            var events = data.busy;

            // References to the output locations
            var currentStatus = el.querySelector('.current .status');
            var currentDuration = el.querySelector('.current .duration');
            var upcomingStatus = el.querySelector('.upcoming .status');
            var upcomingDuration = el.querySelector('.upcoming .duration');

            // Clear the room!
            el.querySelectorAll('.indicator, .current .status, .current .duration, .upcoming .status, .upcoming .duration').forEach(function(cell){
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
                upcomingDuration.innerHTML = RoomTracker.humanTimeDiff(start, end);
                return;
            }

            // Currently occupied, show that in the first column
            RoomTracker.setIndicator(el, false);
            currentStatus.innerHTML = 'Bezet tot '+RoomTracker.printTime(end)+' uur';
            currentDuration.innerHTML = RoomTracker.humanTimeDiff(now, end);

            // If there are no further events planned, the rest of the day is free
            if (events.length == 1) {
                upcomingStatus.innerHTML = 'De rest van de dag beschikbaar';
                return;
            }

            // Otherwise, show the time until the second event
            var secondStart = new Date(events[1].start);
            upcomingStatus.innerHTML = 'Daarna vrij tot '+RoomTracker.printTime(secondStart)+' uur';
            upcomingDuration.innerHTML = RoomTracker.humanTimeDiff(now, secondStart);
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

        var hours = Math.floor(inMinutes / 60);
        var minutes = inMinutes % 60;
        if (minutes == 0) {
            return hours + ' uur ';
        }
        return hours + ' uur ' + minutes + ' min';
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
                scope: "https://www.googleapis.com/auth/calendar",
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

    /**
     * Show and update a real-time clock in the top-right of the screen
     */
    displayClock: function() {
        document.getElementById('time').innerHTML = RoomTracker.printTime(new Date());
        setTimeout(RoomTracker.displayClock, 5000);
    },

    /**
     * Show a different quote every 5 minutes
     */
    showQuote: function() {
        var random_quote = config.quotes[Math.floor(Math.random()*config.quotes.length)];
        document.getElementById('quote').innerHTML = random_quote
        setTimeout(RoomTracker.showQuote, 60*1000);
    },

    /**
     * Event handler for claiming an available room
     * @param  {Event} event
     */
    claimRoom: function(event) {
        console.log(event);
        // Only operate when buttons are clicked
        var button = event.target;
        if (!button.classList.contains('claim')) {
            return;
        }
        event.preventDefault();

        // Set loading state
        button.classList = "button is-loading is-warning";

        // Find room settings
        var el = event.path.filter(function(el){ return el.classList && el.classList.contains('room'); })[0];
        var room_id = el.id;
        var rooms = [].concat.apply([], config.rooms);
        var room = rooms.filter(function(room) { return room.id == room_id })[0];

        // Create event specification
        var now = new Date();
        var end = new Date();
        end.setMinutes(now.getMinutes() + 30);
        var request = gapi.client.calendar.events.insert({
          'calendarId': config.claimCalendar,
          'location': room.name,
          'attendees': [room.resourceID],
          'summary': 'Quick meeting',
          'start': {'dateTime': now.toISOString(), 'timeZone': 'Europe/Amsterdam'},
          'end': {'dateTime': end.toISOString(), 'timeZone': 'Europe/Amsterdam'},
        });

        // Create the event
        request.execute(function(event) {
            // Add an one second timeout for extra effect
            setTimeout(function() {
                // Set completed state
                button.classList = "button is-success";
                button.innerHTML = "Geclaimd!";
            }, 1000);
        });
    }
};

// Initialize when the DOM is ready
if (document.readyState != 'loading'){
    RoomTracker.init();
} else {
    document.addEventListener('DOMContentLoaded', RoomTracker.init);
}
