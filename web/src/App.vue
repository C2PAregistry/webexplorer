<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/verification">Verification</router-link> |
      <router-link to="/search">Search</router-link>
    </nav>
    <router-view/>
    <FooterComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FooterComponent from './components/FooterComponent.vue'

export default defineComponent({
  name: 'App',
  components: {
    FooterComponent
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

nav {
  padding: 20px 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 5px;
}

nav a.router-link-exact-active {
  color: #42b983;
}

/* Main content area that grows to push footer down */
.router-view {
  flex: 1;
}
</style>
