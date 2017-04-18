<template>
    <div class="column is-4 room">
        <div class="room box">
            <article class="media">
                <div class="media-content">
                    <div class="content">
                        <p>
                            <!-- <span class="indicator tag">{{ room.status }}</span> -->
                            <strong class=name>{{ room.name }}</strong><br>
                            <small>{{ room.resourceID }}</small>
                            <!-- <span class="current">
                                <small class="status">{{ room.current.status }}</small>
                                <small class="duration is-pulled-right">{{ room.current.duration }}</small>
                            </span><br>
                            <span class="upcoming">
                                <small class="status">{{ room.upcoming.status }}</small>
                                <small class="duration is-pulled-right">{{ room.upcoming.duration }}</small>
                            </span> -->
                        </p>
                    </div>
                </div>
            </article>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'room',
        props: ['room'],
    };
</script>

<style scoped>
    .room {
        height: 7em;
        min-width: 20em;
        margin-bottom: 2em;
    }
</style>
