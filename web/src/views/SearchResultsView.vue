<template>
  <div class="search-results">
    <h1>Search Results</h1>
    <div class="search-section">
      <div class="search-container">
        <input
          v-model="searchQuery"
          @keyup.enter="search"
          type="text"
          placeholder="Search by name or source URL..."
          class="search-input"
        />
        <button @click="search" class="search-btn">Search</button>
      </div>
    </div>
    <div class="results-section">
      <div class="table-container">
        <table class="results-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>SOURCE URL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedResults" :key="item.publicId">
              <td>
                <router-link :to="`/content/${item.publicId}`" class="content-link">{{ item.name }}</router-link>
              </td>
              <td>
                <a :href="item.sourceUrl" target="_blank" class="source-link">{{ item.sourceUrl }}</a>
              </td>
            </tr>
            <tr v-if="paginatedResults.length === 0">
              <td colspan="2" class="no-results">No results found.</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="pagination" v-if="totalPages > 1">
        <button @click="prevPage" :disabled="page === 1" class="pagination-btn">Prev</button>
        <span class="page-info">Page {{ page }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page === totalPages" class="pagination-btn">Next</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface SearchResult {
  publicId: string;
  name: string;
  sourceUrl: string;
}

// Backend API base URL
const API_BASE = 'http://91.99.113.226:3000'

async function fetchEntries(): Promise<SearchResult[]> {
  try {
    const response = await fetch(`${API_BASE}/entry`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json() as { id: number; name: string; reference: string }[]
    return data.map(item => ({
      publicId: String(item.id),
      name: item.name,
      sourceUrl: item.reference,
    }))
  } catch (err) {
    console.error('Failed to fetch entries', err)
    return []
  }
}

export default defineComponent({
  name: 'SearchResultsView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const searchQuery = ref((route.query.q as string) || '')
    const results = ref<SearchResult[]>([])
    const page = ref(1)
    const pageSize = 5

    const filteredResults = computed(() => {
      if (!searchQuery.value) return results.value
      return results.value.filter(item =>
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.sourceUrl.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    const totalPages = computed(() => Math.ceil(filteredResults.value.length / pageSize))
    const paginatedResults = computed(() => {
      const start = (page.value - 1) * pageSize
      return filteredResults.value.slice(start, start + pageSize)
    })

    const search = () => {
      page.value = 1
      router.replace({ path: '/search', query: { q: searchQuery.value } })
    }
    const prevPage = () => {
      if (page.value > 1) page.value--
    }
    const nextPage = () => {
      if (page.value < totalPages.value) page.value++
    }

    onMounted(async () => {
      results.value = await fetchEntries()
    })

    return {
      searchQuery,
      paginatedResults,
      page,
      totalPages,
      search,
      prevPage,
      nextPage
    }
  }
})
</script>

<style scoped>
.search-results {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  line-height: 1.6;
}

.search-results h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.search-section {
  margin-bottom: 3rem;
}

.search-container {
  display: flex;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e1e1e1;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #42b983;
}

.search-btn {
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.search-btn:hover {
  background-color: #369870;
}

.results-section {
  text-align: left;
}

.table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e1e1e1;
  margin-bottom: 2rem;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.results-table th {
  background: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  font-size: 0.9rem;
  border-bottom: 2px solid #e1e1e1;
}

.results-table td {
  padding: 1rem;
  border-bottom: 1px solid #e1e1e1;
  color: #555;
  font-size: 0.9rem;
}

.results-table tr:last-child td {
  border-bottom: none;
}

.content-link {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.content-link:hover {
  color: #369870;
  text-decoration: underline;
}

.source-link {
  color: #666;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.3s ease;
  word-break: break-all;
}

.source-link:hover {
  color: #42b983;
  text-decoration: underline;
}

.no-results {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 2rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  color: #2c3e50;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #42b983;
  color: white;
  border-color: #42b983;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #555;
  font-size: 0.9rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .search-results {
    padding: 1rem;
  }
  
  .search-results h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .search-container {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .search-btn {
    padding: 0.75rem;
  }
  
  .pagination {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .pagination-btn {
    width: 100%;
    max-width: 120px;
  }
}
</style> 