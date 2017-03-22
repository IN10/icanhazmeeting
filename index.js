window.RoomTracker = {

    key: config.google.apikey,

    init: function() {

    }

};

if (document.readyState != 'loading'){
    RoomTracker.init();
} else {
    document.addEventListener('DOMContentLoaded', RoomTracker.init);
}
