<template>
    <h2 class="subtitle">{{ currentQuote }}</h2>
</template>

<script>
import Config from '../config';

export default {
    name: 'quote',
    data() {
        return {
            timeOut: 30 * 1000,
            currentQuote: null,
        };
    },
    methods: {
        updateQuote() {
            this.currentQuote = Config.quotes[Math.floor(Math.random() * Config.quotes.length)];
            setTimeout(this.updateQuote, this.timeOut);
        },
    },

    mounted() {
        this.updateQuote();
    },
};
</script>

<style scoped>
    h2 {
        font-size: medium;
        font-style: italic;
    }
</style>
