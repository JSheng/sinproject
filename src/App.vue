<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import BaseVue from './baseclass/base-vue';
@Component
export default class App extends BaseVue {

  mounted() {
    const stateStr = sessionStorage.getItem("cacheState");
    if (stateStr){
      this.$store.replaceState(Object.assign(this.$store.state,JSON.parse(stateStr)));
    }
    if (window.addEventListener) { // 所有主流浏览器，除了 IE 8 及更早版本
        window.removeEventListener("beforeunload", this.saveState);
        window.addEventListener('beforeunload',this.saveState);
    /// @ts-ignore
    } else if (window.attachEvent) { // IE 8 及更早版本
        /// @ts-ignore
        window.detachEvent('beforeunload',this.saveState);
        /// @ts-ignore
        window.attachEvent('beforeunload',this.saveState);
    }
  }

  saveState() {
      const cacheState = this.$store.state;
      delete cacheState['$http'];
      debugger;
      sessionStorage.setItem('cacheState', JSON.stringify(cacheState))
  }
}
</script>

<style lang="scss">
html,body{
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width:100%;
  height:100%;
}
</style>
