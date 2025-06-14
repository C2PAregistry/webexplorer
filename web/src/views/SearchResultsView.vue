<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center py-8">
    <div class="w-full max-w-5xl bg-white rounded-xl shadow-md p-8">
      <h1 class="text-2xl font-bold text-indigo-700 mb-4 text-center">Search Results</h1>
      
      <!-- Search Bar -->
      <div class="mb-6 flex flex-col md:flex-row gap-2">
        <input
          v-model="searchQuery"
          @keyup.enter="search"
          type="text"
          placeholder="Search by hash, public ID, title, or file name..."
          class="flex-1 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm px-3 py-2"
        />
        <button @click="search" class="bg-indigo-400 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-md transition">Search</button>
      </div>

      <!-- Filters Section -->
      <div class="mb-6 p-4 bg-gray-50 rounded-lg border">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-700">Filters</h3>
          <button 
            @click="clearFilters" 
            class="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear All
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Title</label>
            <input
              v-model="filters.title"
              type="text"
              placeholder="Filter by title..."
              class="w-full text-xs rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-2 py-1.5"
            />
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Author</label>
            <select
              v-model="filters.author"
              class="w-full text-xs rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-2 py-1.5"
            >
              <option value="">All authors</option>
              <option v-for="author in uniqueAuthors" :key="author" :value="author">{{ author }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Year</label>
            <select
              v-model="filters.year"
              class="w-full text-xs rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-2 py-1.5"
            >
              <option value="">All years</option>
              <option v-for="year in uniqueYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Hosting Platform</label>
            <select
              v-model="filters.hostingPlatform"
              class="w-full text-xs rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-2 py-1.5"
            >
              <option value="">All platforms</option>
              <option v-for="platform in uniquePlatforms" :key="platform" :value="platform">{{ platform }}</option>
            </select>
          </div>
        </div>
        
        <!-- Active Filters Display -->
        <div v-if="hasActiveFilters" class="mt-4 flex flex-wrap gap-2">
          <span class="text-xs text-gray-600">Active filters:</span>
          <span v-if="filters.title" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
            Title: {{ filters.title }}
            <button @click="filters.title = ''" class="ml-1 text-indigo-600 hover:text-indigo-800">×</button>
          </span>
          <span v-if="filters.author" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
            Author: {{ filters.author }}
            <button @click="filters.author = ''" class="ml-1 text-indigo-600 hover:text-indigo-800">×</button>
          </span>
          <span v-if="filters.year" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
            Year: {{ filters.year }}
            <button @click="filters.year = ''" class="ml-1 text-indigo-600 hover:text-indigo-800">×</button>
          </span>
          <span v-if="filters.hostingPlatform" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
            Platform: {{ filters.hostingPlatform }}
            <button @click="filters.hostingPlatform = ''" class="ml-1 text-indigo-600 hover:text-indigo-800">×</button>
          </span>
        </div>
      </div>

      <!-- Results Count -->
      <div class="mb-4 text-sm text-gray-600">
        {{ filteredResults.length }} result{{ filteredResults.length !== 1 ? 's' : '' }} found
      </div>

      <!-- Results Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-md">
          <thead>
            <tr class="bg-gray-50 text-gray-700 text-sm">
              <th class="px-4 py-2 text-left">TITLE</th>
              <th class="px-4 py-2 text-left">AUTHOR</th>
              <th class="px-4 py-2 text-left">YEAR</th>
              <th class="px-4 py-2 text-left">PUBLIC ID</th>
              <th class="px-4 py-2 text-left">HOSTING URL</th>
              <th class="px-4 py-2 text-left">REGISTERED ON</th>
              <th class="px-4 py-2 text-left">PROVENANCE</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in paginatedResults" :key="item.hash">
              <tr class="text-sm hover:bg-gray-50 border-b border-gray-100">
                <td class="px-4 py-2 font-medium">
                  <router-link :to="`/content/${item.publicId}`" class="text-indigo-600 hover:underline">
                    {{ item.title }}
                  </router-link>
                </td>
                <td class="px-4 py-2">{{ item.author }}</td>
                <td class="px-4 py-2">{{ item.year }}</td>
                <td class="px-4 py-2 text-xs font-mono">{{ item.publicId }}</td>
                <td class="px-4 py-2">
                  <a :href="item.hostingUrl" target="_blank" class="text-blue-600 hover:underline text-xs">
                    {{ getHostingPlatform(item.hostingUrl) }}
                    <svg class="w-1 h-1 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </a>
                </td>
                <td class="px-4 py-2 text-gray-600 text-xs">{{ item.registeredOn }}</td>
                <td class="px-4 py-2">
                  <button 
                    @click="toggleProvenance(item.publicId)"
                    class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                  >
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    View Chain
                  </button>
                </td>
              </tr>
              
              <!-- Provenance Chain Row (Expandable) -->
              <tr v-if="expandedProvenance.has(item.publicId)" class="bg-gray-50">
                <td colspan="7" class="px-4 py-6">
                  <div class="max-w-4xl mx-auto">
                    <h4 class="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                      <svg class="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      Provenance Chain for {{ item.title }}
                    </h4>
                    
                    <!-- Interactive Timeline -->
                    <div class="relative">
                      <!-- Timeline Line -->
                      <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                      
                      <!-- Timeline Events -->
                      <div v-for="(event, index) in getProvenanceChain(item)" :key="index" class="relative flex items-start mb-6">
                        <!-- Event Dot -->
                        <div :class="[
                          'relative z-10 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-white',
                          getEventColor(event.type)
                        ]">
                          <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path v-if="event.type === 'creation'" d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path v-else-if="event.type === 'verification'" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            <path v-else-if="event.type === 'modification'" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"/>
                            <path v-else-if="event.type === 'registration'" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z M9.293 5.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L10.586 10 9.293 8.707a1 1 0 010-1.414z"/>
                            <path v-else d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z"/>
                          </svg>
                        </div>
                        
                        <!-- Event Content -->
                        <div class="ml-4 flex-1">
                          <div class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                            <div class="flex items-center justify-between mb-2">
                              <h5 class="text-sm font-semibold text-gray-900">{{ event.title }}</h5>
                              <span class="text-xs text-gray-500">{{ event.timestamp }}</span>
                            </div>
                            <p class="text-sm text-gray-600 mb-2">{{ event.description }}</p>
                            
                            <!-- Event Details -->
                            <div class="grid grid-cols-2 gap-4 text-xs text-gray-500">
                              <div v-if="event.actor">
                                <span class="font-medium">Actor:</span> {{ event.actor }}
                              </div>
                              <div v-if="event.location">
                                <span class="font-medium">Location:</span> {{ event.location }}
                              </div>
                              <div v-if="event.hash">
                                <span class="font-medium">Hash:</span> 
                                <code class="font-mono bg-gray-100 px-1 rounded">{{ event.hash.slice(0, 12) }}...</code>
                              </div>
                              <div v-if="event.signature">
                                <span class="font-medium">Signature:</span> 
                                <code class="font-mono bg-gray-100 px-1 rounded">{{ event.signature.slice(0, 12) }}...</code>
                              </div>
                            </div>
                            
                            <!-- Verification Status -->
                            <div v-if="event.verified !== undefined" class="mt-2 flex items-center">
                              <div :class="[
                                'w-2 h-2 rounded-full mr-2',
                                event.verified ? 'bg-green-400' : 'bg-red-400'
                              ]"></div>
                              <span class="text-xs font-medium" :class="event.verified ? 'text-green-700' : 'text-red-700'">
                                {{ event.verified ? 'Verified' : 'Unverified' }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Chain Summary -->
                    <div class="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <h5 class="text-sm font-semibold text-indigo-900 mb-2">Chain Summary</h5>
                      <div class="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span class="text-indigo-600 font-medium">Total Events:</span>
                          <span class="text-indigo-900 ml-1">{{ getProvenanceChain(item).length }}</span>
                        </div>
                        <div>
                          <span class="text-indigo-600 font-medium">Verified Steps:</span>
                          <span class="text-indigo-900 ml-1">{{ getProvenanceChain(item).filter(e => e.verified).length }}</span>
                        </div>
                        <div>
                          <span class="text-indigo-600 font-medium">Chain Integrity:</span>
                          <span class="text-indigo-900 ml-1">{{ getChainIntegrity(item) }}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
            
            <tr v-if="paginatedResults.length === 0">
              <td class="px-4 py-8 text-gray-400 text-center" colspan="7">
                <div class="flex flex-col items-center">
                  <svg class="w-6 h-6 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p class="text-sm">No results found matching your criteria.</p>
                  <button @click="clearFilters" class="mt-2 text-xs text-indigo-600 hover:text-indigo-800">Clear filters</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="flex justify-center items-center gap-2 mt-6">
        <button @click="prevPage" :disabled="page === 1" class="px-4 py-2 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300 transition">
          Previous
        </button>
        <span class="text-sm text-gray-600 px-4">Page {{ page }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page === totalPages" class="px-4 py-2 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300 transition">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive } from 'vue'

interface ProvenanceEvent {
  type: 'creation' | 'registration' | 'verification' | 'modification' | 'transfer';
  title: string;
  description: string;
  timestamp: string;
  actor?: string;
  location?: string;
  hash?: string;
  signature?: string;
  verified?: boolean;
}

interface SearchResult {
  publicId: string;
  hash: string;
  creatorId: string;
  registeredOn: string;
  title: string;
  author: string;
  year: number;
  hostingUrl: string;
}

interface Filters {
  title: string;
  author: string;
  year: string;
  hostingPlatform: string;
}

const HOSTING_PLATFORMS = ['YouTube', 'Vimeo', 'Instagram', 'Twitter', 'TikTok']
const AUTHORS = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown']
const LOCATIONS = ['New York, USA', 'London, UK', 'Tokyo, Japan', 'Berlin, Germany', 'São Paulo, Brazil']
const ACTORS = ['Original Creator', 'Verification Service', 'Content Platform', 'Third Party Verifier', 'Blockchain Registry']

const TITLES = [
  'Beautiful Sunset Photography',
  'Urban Architecture Study',
  'Nature Documentary Clip',
  'Music Video Production',
  'Art Installation Recording',
  'Street Photography Series',
  'Digital Art Creation',
  'Travel Vlog Episode',
  'Educational Content',
  'Creative Workshop'
]

const MOCK_RESULTS: SearchResult[] = Array.from({ length: 50 }, (_, i) => ({
  publicId: `content-${String(i + 1).padStart(3, '0')}`,
  hash: `hash${i + 1}`.padEnd(64, 'a'),
  creatorId: `creator${(i % 5) + 1}`,
  registeredOn: new Date(Date.now() - i * 86400000).toLocaleDateString(),
  title: TITLES[i % TITLES.length] + ` ${Math.floor(i / TITLES.length) + 1}`,
  author: AUTHORS[i % AUTHORS.length],
  year: 2020 + (i % 5),
  hostingUrl: `https://${HOSTING_PLATFORMS[i % HOSTING_PLATFORMS.length].toLowerCase()}.com/content/${i + 1}`
}))

export default defineComponent({
  name: 'SearchResultsView',
  setup() {
    const searchQuery = ref('')
    const results = ref<SearchResult[]>(MOCK_RESULTS)
    const page = ref(1)
    const pageSize = 10
    const expandedProvenance = ref(new Set<string>())
    
    const filters = reactive<Filters>({
      title: '',
      author: '',
      year: '',
      hostingPlatform: ''
    })

    const uniqueAuthors = computed(() => 
      [...new Set(results.value.map(item => item.author))].sort()
    )
    
    const uniqueYears = computed(() => 
      [...new Set(results.value.map(item => item.year))].sort((a, b) => b - a)
    )
    
    const uniquePlatforms = computed(() => 
      [...new Set(results.value.map(item => getHostingPlatform(item.hostingUrl)))].sort()
    )

    const hasActiveFilters = computed(() => 
      filters.title || filters.author || filters.year || filters.hostingPlatform
    )

    const filteredResults = computed(() => {
      let filtered = results.value

      // Apply search query filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(item =>
          item.publicId.toLowerCase().includes(query) ||
          item.hash.toLowerCase().includes(query) ||
          item.creatorId.toLowerCase().includes(query) ||
          item.title.toLowerCase().includes(query) ||
          item.author.toLowerCase().includes(query)
        )
      }

      // Apply specific filters
      if (filters.title) {
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(filters.title.toLowerCase())
        )
      }
      
      if (filters.author) {
        filtered = filtered.filter(item => item.author === filters.author)
      }
      
      if (filters.year) {
        filtered = filtered.filter(item => item.year.toString() === filters.year)
      }
      
      if (filters.hostingPlatform) {
        filtered = filtered.filter(item => 
          getHostingPlatform(item.hostingUrl) === filters.hostingPlatform
        )
      }

      return filtered
    })

    const totalPages = computed(() => Math.ceil(filteredResults.value.length / pageSize))
    
    const paginatedResults = computed(() => {
      const start = (page.value - 1) * pageSize
      return filteredResults.value.slice(start, start + pageSize)
    })

    const getHostingPlatform = (url: string): string => {
      try {
        const hostname = new URL(url).hostname.toLowerCase()
        if (hostname.includes('youtube')) return 'YouTube'
        if (hostname.includes('vimeo')) return 'Vimeo'
        if (hostname.includes('instagram')) return 'Instagram'
        if (hostname.includes('twitter')) return 'Twitter'
        if (hostname.includes('tiktok')) return 'TikTok'
        return hostname
      } catch {
        return 'Unknown'
      }
    }

    const generateHash = (): string => {
      return Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')
    }

    const generateSignature = (): string => {
      return Array.from({length: 128}, () => Math.floor(Math.random() * 16).toString(16)).join('')
    }

    const getProvenanceChain = (item: SearchResult): ProvenanceEvent[] => {
      const baseTime = new Date(item.registeredOn).getTime()
      const events: ProvenanceEvent[] = []

      // Creation event (always first)
      events.push({
        type: 'creation',
        title: 'Content Created',
        description: `Original content "${item.title}" was created by ${item.author}`,
        timestamp: new Date(baseTime - 86400000 * 5).toLocaleDateString(),
        actor: item.author,
        location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
        hash: `sha256:${generateHash()}`,
        verified: true
      })

      // Registration event
      events.push({
        type: 'registration',
        title: 'Registered in Araxa',
        description: 'Content was registered in the Araxa global registry with unique identifier',
        timestamp: item.registeredOn,
        actor: 'Araxa Registry',
        hash: item.hash,
        signature: generateSignature(),
        verified: true
      })

      // Random verification events
      const numVerifications = Math.floor(Math.random() * 3) + 1
      for (let i = 0; i < numVerifications; i++) {
        events.push({
          type: 'verification',
          title: `Verification #${i + 1}`,
          description: 'Content authenticity verified through C2PA standards and cryptographic validation',
          timestamp: new Date(baseTime + 86400000 * (i + 1)).toLocaleDateString(),
          actor: ACTORS[Math.floor(Math.random() * ACTORS.length)],
          location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
          signature: generateSignature(),
          verified: Math.random() > 0.1 // 90% verification success rate
        })
      }

      // Possible modification events
      if (Math.random() > 0.7) {
        events.push({
          type: 'modification',
          title: 'Content Modified',
          description: 'Minor metadata updates were applied while preserving content integrity',
          timestamp: new Date(baseTime + 86400000 * 3).toLocaleDateString(),
          actor: item.author,
          hash: `sha256:${generateHash()}`,
          verified: true
        })
      }

      // Possible transfer events
      if (Math.random() > 0.8) {
        events.push({
          type: 'transfer',
          title: 'Ownership Transferred',
          description: 'Content ownership was transferred to a new party with full provenance chain maintained',
          timestamp: new Date(baseTime + 86400000 * 7).toLocaleDateString(),
          actor: `New Owner ${Math.floor(Math.random() * 100)}`,
          signature: generateSignature(),
          verified: true
        })
      }

      return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    }

    const getEventColor = (type: string): string => {
      const colors = {
        creation: 'bg-green-500',
        registration: 'bg-blue-500',
        verification: 'bg-indigo-500',
        modification: 'bg-yellow-500',
        transfer: 'bg-purple-500'
      }
      return colors[type as keyof typeof colors] || 'bg-gray-500'
    }

    const getChainIntegrity = (item: SearchResult): number => {
      const chain = getProvenanceChain(item)
      const verifiedEvents = chain.filter(e => e.verified !== false).length
      return Math.round((verifiedEvents / chain.length) * 100)
    }

    const toggleProvenance = (publicId: string) => {
      if (expandedProvenance.value.has(publicId)) {
        expandedProvenance.value.delete(publicId)
      } else {
        expandedProvenance.value.add(publicId)
      }
    }

    const search = () => {
      page.value = 1
    }
    
    const clearFilters = () => {
      filters.title = ''
      filters.author = ''
      filters.year = ''
      filters.hostingPlatform = ''
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
      filters,
      filteredResults,
      paginatedResults,
      page,
      totalPages,
      expandedProvenance,
      uniqueAuthors,
      uniqueYears,
      uniquePlatforms,
      hasActiveFilters,
      getHostingPlatform,
      getProvenanceChain,
      getEventColor,
      getChainIntegrity,
      toggleProvenance,
      search,
      clearFilters,
      prevPage,
      nextPage
    }
  }
})
</script>