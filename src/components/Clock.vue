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
            this.hours = now.getHours();
            this.minutes = now.getMinutes();
            setTimeout(this.updateTime, 5000);
        },
    },
    mounted() {
        this.updateTime();
    },
};
</script>
