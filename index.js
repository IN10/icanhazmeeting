window.RoomTracker = {

    init: function() {

    }

};

if (document.readyState != 'loading'){
    RoomTracker.init();
} else {
    document.addEventListener('DOMContentLoaded', RoomTracker.init);
}
