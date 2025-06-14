<template>
  <div class="home">
    <h1>Welcome to Araxa</h1>
    <p>This is the home page of the Araxa project.</p>
    <div class="project-explanation">
      <h2>Project Purpose</h2>
      <p>Araxa is a C2PA-like Global Registry that serves as an independent, publicly verifiable record of digital content provenance. It allows creators to assert ownership and provide verifiable evidence of their content's origin, even if the content itself doesn't natively carry C2PA credentials.</p>
    </div>
    <div class="search-container">
      <input type="text" placeholder="Search for content..." v-model="searchQuery" />
      <button @click="search">Search</button>
    </div>
    <div class="recent-verifications">
      <h2>Recent Verifications</h2>
      <ul>
        <li v-for="(item, index) in recentVerifications" :key="index">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'HomeView',
  setup() {
    const searchQuery = ref('')
    const recentVerifications = ref(['Verification 1', 'Verification 2', 'Verification 3'])

    const search = () => {
      // Implement search functionality here
      console.log('Searching for:', searchQuery.value)
    }

    return {
      searchQuery,
      recentVerifications,
      search
    }
  }
})
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}

.project-explanation {
  margin: 2rem 0;
  text-align: left;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.search-container {
  margin: 2rem 0;
}

input {
  padding: 0.5rem;
  margin-right: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.recent-verifications {
  margin-top: 2rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0.5rem 0;
}
</style> 