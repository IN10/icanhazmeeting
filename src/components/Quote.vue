<template>
    <h2 class="subtitle">{{ currentQuote }}</h2>
</template>

<script>
export default {
    name: 'quote',
    data() {
        const quotes = [
            'People who enjoy meetings should not be in charge of anything.',
            'Meetings are indispensable when you don\'t want to do anything.',
            'Has anyone ever said, \'I wish I could go to more meetings today?',
        ];
        return {
            timeOut: 30 * 1000,
            quotes,
            currentQuote: quotes[0],
        };
    },
    methods: {
        updateQuote() {
            this.currentQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
            setTimeout(this.updateQuote, this.timeOut);
        },
    },

    mounted() {
        setTimeout(this.updateQuote, this.timeOut);
    },
};
</script>

<style scoped>
    h2 {
        font-size: medium;
        font-style: italic;
    }
</style>
