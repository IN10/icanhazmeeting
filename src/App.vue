<template>
  <div id="app">
      <header class="hero is-warning is-bold">
        <div class="hero-body">
            <div class="container">
                <h1 class="title">
                    I can haz meeting?

                    <clock />
                </h1>
                <quote />
            </div>
        </div>
    </header>

    <main>
        <div class="container">
            <notification />
            <modal />
            <rooms />
        </div>
    </main>
  </div>
</template>

<script>
import Clock from './components/Clock';
import Quote from './components/Quote';
import Modal from './components/Modal';
import Rooms from './components/Rooms';
import Notification from './components/Notification';

export default {
    name: 'app',
    components: {
        Clock,
        Quote,
        Modal,
        Rooms,
        Notification,
    },
};
</script>

<style lang="scss">
    @import './node_modules/bulma/bulma.sass';
</style>
