<template>
  <div class="home">
    <h1>The Open Registry for C2PA Content</h1>
    <p>Queryable. Open. Platform-Neutral.</p>
    <div class="project-explanation">
      <h2>Our Mission</h2>
      <p>In a world of increasing AI-generated content and media manipulation, C2PARegistry.com provides a public registry for the metadata history and relationships of C2PA-compliant digital assets.</p>
      <p>Our goal is not to verify the content itself, but to connect and expose the relationships between provenance records across tools and platforms — reducing fragmentation, avoiding metadata silos, and advancing the C2PA mission of transparency and trust. By acting as a shared lookup and registration hub, we help bring C2PA to mainstream adoption, ensuring that content authenticity becomes a common standard across the internet.</p>
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