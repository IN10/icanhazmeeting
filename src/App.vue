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
            <modal />

            <div class="container rooms is-clearfix">
                <room />
            </div>
        </div>
    </main>
  </div>
</template>

<script>
import Clock from './components/Clock';
import Quote from './components/Quote';
import Modal from './components/Modal';
import Room from './components/Room';

export default {
    name: 'app',
    components: {
        Clock,
        Quote,
        Modal,
        Room,
    },
};
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
.rooms {
    margin-top: 1em;
}
</style>
