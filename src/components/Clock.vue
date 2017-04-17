<template>
    <span class="is-pulled-right">{{ hours }}:{{ minutes }}</span>
</template>

<script>
export default {
    name: 'clock',
    data() {
        const now = new Date();
        return {
            hours: now.getHours(),
            minutes: now.getMinutes(),
        };
    },
    methods: {
        updateTime() {
            const now = new Date();
            this.hours = `0${now.getHours()}`.slice(-2);
            this.minutes = `0${now.getMinutes()}`.slice(-2);

            setTimeout(this.updateTime, 5000);
        },
    },
    mounted() {
        this.updateTime();
    },
};
</script>
