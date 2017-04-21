<template>
    <div class="column is-4 room">
        <div class="room box">
            <article class="media">
                <div class="media-content">
                    <div class="content">
                        <p>
                            <span class="indicator tag" v-bind:class="indicatorClass">{{ status }}</span>
                            <strong class=name>{{ config.name }}</strong><br>
                            <span class="current">
                                <small class="status">{{ current.status }}</small>
                                <small class="duration is-pulled-right">{{ current.duration }}</small>
                            </span><br>
                            <span class="upcoming">
                                <small class="status">{{ upcoming.status }}</small>
                                <small class="duration is-pulled-right">{{ upcoming.duration }}</small>
                            </span>
                        </p>
                    </div>
                </div>
            </article>
        </div>
    </div>
</template>o

<script>
    export default {
        name: 'room',
        props: ['config', 'freebusy'],

        computed: {
            // The status indicator of a
            status() {
                if (this.freebusy.length === 0) {
                    return 'Vrij';
                }

                const now = new Date();
                const start = new Date(this.freebusy[0].start);
                const end = new Date(this.freebusy[0].end);

                if (now > start && now < end) {
                    return 'Bezet';
                }
                return 'Vrij';
            },

            indicatorClass() {
                if (this.status === 'Vrij') {
                    return 'is-success';
                }
                return 'is-danger';
            },

            current() {
                return { status: 'leeg', duration: 5 };
            },
            upcoming() {
                return { status: 'leeg', duration: 5 };
            },
        },
    };
</script>

<style scoped>
    .room {
        height: 7em;
        min-width: 20em;
        margin-bottom: 2em;
    }
</style>
