<template>
    <div class="modal is-active" v-if="isActive">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Aanmelden bij Google Calendar</p>
            </header>
            <section class="modal-card-body">
                <p>
                    Om de vergaderruimtes te tonen, hebben we toestemming nodig om je Google Calendar te lezen.
                </p>
            </section>
            <footer class="modal-card-foot">
                <a class="button is-primary">Aanmelden met Google Calendar</a>
            </footer>
        </div>
    </div>
</template>

<script>
export default {
    name: 'modal',
    data() {
        return {
            isActive: true,
        };
    },
};
</script>
