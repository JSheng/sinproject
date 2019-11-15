<template>
  <div class=".view-fix" id="app">
    <Main/>
  </div>
</template>

<script>
import Main from '@/components/layout/main.vue'

export default {
  name: 'app',
  components: {
    Main
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
