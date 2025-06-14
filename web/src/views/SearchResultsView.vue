<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center py-8">
    <div class="w-full max-w-3xl bg-white rounded-xl shadow-md p-8">
      <h1 class="text-2xl font-bold text-indigo-700 mb-4 text-center">Search Results</h1>
      <div class="mb-4 flex flex-col md:flex-row gap-2">
        <input
          v-model="searchQuery"
          @keyup.enter="search"
          type="text"
          placeholder="Search by hash, public ID, or file name..."
          class="flex-1 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm px-3 py-2"
        />
        <button @click="search" class="bg-indigo-400 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-md transition">Search</button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-md">
          <thead>
            <tr class="bg-gray-50 text-gray-700 text-sm">
              <th class="px-4 py-2 text-left">PUBLIC ID</th>
              <th class="px-4 py-2 text-left">HASH (PARTIAL)</th>
              <th class="px-4 py-2 text-left">CREATOR ID</th>
              <th class="px-4 py-2 text-left">REGISTERED ON</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedResults" :key="item.hash" class="text-sm">
              <td class="px-4 py-2">
                <router-link :to="`/content/${item.publicId}`" class="text-indigo-600 hover:underline">{{ item.publicId }}</router-link>
              </td>
              <td class="px-4 py-2">{{ item.hash.slice(0, 12) + '...' }}</td>
              <td class="px-4 py-2">{{ item.creatorId }}</td>
              <td class="px-4 py-2">{{ item.registeredOn }}</td>
            </tr>
            <tr v-if="paginatedResults.length === 0">
              <td class="px-4 py-2 text-gray-400" colspan="4">No results found.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="flex justify-center items-center gap-2 mt-4">
        <button @click="prevPage" :disabled="page === 1" class="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50">Prev</button>
        <span class="text-sm">Page {{ page }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page === totalPages" class="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50">Next</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

interface SearchResult {
  publicId: string;
  hash: string;
  creatorId: string;
  registeredOn: string;
}

const MOCK_RESULTS: SearchResult[] = Array.from({ length: 23 }, (_, i) => ({
  publicId: `photo-${i + 1}`,
  hash: `mockhash${i + 1}`.padEnd(64, 'a'),
  creatorId: `user${(i % 5) + 1}`,
  registeredOn: new Date(Date.now() - i * 86400000).toLocaleString(),
}))

export default defineComponent({
  name: 'SearchResultsView',
  setup() {
    const searchQuery = ref('')
    const results = ref<SearchResult[]>(MOCK_RESULTS)
    const page = ref(1)
    const pageSize = 5

    const filteredResults = computed(() => {
      if (!searchQuery.value) return results.value
      return results.value.filter(item =>
        item.publicId.includes(searchQuery.value) ||
        item.hash.includes(searchQuery.value) ||
        item.creatorId.includes(searchQuery.value)
      )
    })

    const totalPages = computed(() => Math.ceil(filteredResults.value.length / pageSize))
    const paginatedResults = computed(() => {
      const start = (page.value - 1) * pageSize
      return filteredResults.value.slice(start, start + pageSize)
    })

    const search = () => {
      page.value = 1
    }
    const prevPage = () => {
      if (page.value > 1) page.value--
    }
    const nextPage = () => {
      if (page.value < totalPages.value) page.value++
    }

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