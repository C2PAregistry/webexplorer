<template>
  <div class="home">
    <h1>The Open Registry for C2PA Content</h1>
    <p>Searchable. Open. Platform-Neutral.</p>
    <div class="search-container">
      <input type="text" placeholder="Search for content..." v-model="searchQuery" />
      <button @click="search">Search</button>
    </div>
    <div class="project-explanation">
      <h2>Our Mission</h2>
      <p>In a world of increasing AI-generated content and media manipulation, C2PARegistry.com provides a public registry for the metadata history and relationships of C2PA-compliant digital assets.</p>
      <p>Our goal is not to verify the content itself, but to connect and expose the relationships between provenance records across tools and platforms — reducing fragmentation, avoiding metadata silos, and advancing the C2PA mission of transparency and trust. By acting as a shared lookup and registration hub, we help bring C2PA to mainstream adoption, ensuring that content authenticity becomes a common standard across the internet.</p>
    </div>
    <div class="partners-section">
      <h2>Members of the C2PA Coalition</h2>
      <p class="coalition-subtitle">C2PARegistry is the neutral layer linking content creation platforms.</p>
      <div class="logo-carousel">
        <div class="logo-container">
          <!-- First set of logos -->
          <div class="logo-item" v-for="(logo, index) in logos" :key="`first-${index}`">
            <div class="logo-placeholder">{{ logo.name }}</div>
          </div>
          <!-- Duplicate set for seamless loop -->
          <div class="logo-item" v-for="(logo, index) in logos" :key="`second-${index}`">
            <div class="logo-placeholder">{{ logo.name }}</div>
          </div>
        </div>
      </div>
      <p class="disclaimer-text">We are not affiliated with these organizations but exist to support the global adoption of the C2PA standard.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'HomeView',
  setup() {
    const router = useRouter()
    const searchQuery = ref('')
    const logos = ref([
      { name: 'Adobe', url: '#' },
      { name: 'Microsoft', url: '#' },
      { name: 'Google', url: '#' },
      { name: 'Meta', url: '#' },
      { name: 'OpenAI', url: '#' },
      { name: 'NVIDIA', url: '#' },
      { name: 'Samsung', url: '#' },
      { name: 'Canon', url: '#' }
    ])

    const search = () => {
      router.push({
        path: '/search',
        query: { q: searchQuery.value }
      })
    }

    return {
      searchQuery,
      logos,
      search
    }
  }
})
</script>

<style scoped>
.home {
  text-align: center;
  padding: 1rem 2rem 1rem 2rem;
}

.project-explanation {
  margin: 2rem 0;
  text-align: left;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.project-explanation h2 {
  text-align: center;
}

.project-explanation p {
  text-align: justify;
}

.search-container {
  margin: 2rem 0;
}

input {
  padding: 0.5rem;
  margin-right: 0.5rem;
  width: 400px;
  max-width: 80vw;
}

button {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.partners-section {
  margin-top: 3rem;
  padding: 2rem 0;
  background-color: #f8f9fa;
  border-radius: 12px;
}

.partners-section h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1.5rem;
}

.coalition-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  font-style: italic;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.4;
}

.logo-carousel {
  overflow: hidden;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.logo-container {
  display: flex;
  animation: scroll 20s linear infinite;
  width: calc(200px * 16); /* Adjust based on number of logos * 2 */
}

.logo-item {
  flex-shrink: 0;
  width: 200px;
  height: 80px;
  margin: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-placeholder {
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  font-weight: 600;
  color: #495057;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  width: 100%;
  text-align: center;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-placeholder:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-200px * 8 - 160px)); /* Move by half the width */
  }
}

/* Duplicate logos for seamless loop */
.logo-container::after {
  content: '';
  display: flex;
  flex-shrink: 0;
}

.disclaimer-text {
  margin-top: 2rem;
  margin-bottom: 0;
  font-size: 0.9rem;
  color: #868e96;
  font-style: italic;
  text-align: center;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.4;
}
</style> 