<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center py-8">
    <div class="w-full max-w-2xl bg-white rounded-xl shadow-md p-8">
      <h1 class="text-3xl font-bold text-center text-indigo-700 mb-2">C2PA-like Global Registry MVP</h1>
      <p class="text-center text-gray-600 mb-6">Register and verify the provenance of your digital content.</p>

      <!-- User Info (simulated) -->
      <div class="bg-indigo-50 text-indigo-800 rounded-md px-4 py-2 text-center mb-2 text-sm">
        Your User ID: 10716220852217595599
      </div>
      <div class="bg-green-100 text-green-800 rounded-md px-4 py-2 text-center mb-6 text-sm">
        Signed in with custom token.
      </div>

      <!-- Register New Content -->
      <h2 class="text-xl font-semibold text-indigo-700 mb-2">Register New Content</h2>
      <div class="flex flex-col md:flex-row gap-4 mb-2">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Upload Content File (Image/Video/PDF)</label>
          <input type="file" @change="handleFileUpload" class="block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Public Identifier (e.g., "my-first-nft-photo")</label>
          <input type="text" v-model="publicIdentifier" placeholder="Unique ID for your content" class="w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm px-3 py-2" />
        </div>
      </div>

      <!-- Processed Data -->
      <div class="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
        <h3 class="font-semibold text-gray-700 mb-2">Processed Data:</h3>
        <p class="text-sm text-gray-700 mb-1"><span class="font-medium">Content Hash (SHA-256):</span> {{ contentHash || 'N/A' }}</p>
        <p class="text-sm text-gray-700"><span class="font-medium">Extracted Metadata (EXIF):</span> {{ extractedMetadata || 'N/A (or no EXIF data found)' }}</p>
      </div>

      <button @click="registerContent" class="w-full bg-indigo-400 hover:bg-indigo-500 text-white font-semibold py-2 rounded-md transition mb-6">Register Content</button>

      <!-- View Registered Content -->
      <h2 class="text-xl font-semibold text-indigo-700 mb-2">View Registered Content</h2>
      <input type="text" placeholder="Search by hash, ID, or file name..." class="w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm px-3 py-2 mb-2" />
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
            <tr v-if="registeredContent" class="text-sm">
              <td class="px-4 py-2">{{ registeredContent.publicId }}</td>
              <td class="px-4 py-2">{{ registeredContent.hash.slice(0, 12) + '...' }}</td>
              <td class="px-4 py-2">{{ registeredContent.creatorId }}</td>
              <td class="px-4 py-2">{{ registeredContent.registeredOn }}</td>
            </tr>
            <tr v-else>
              <td class="px-4 py-2 text-gray-400" colspan="4">No registered content yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

interface RegisteredContent {
  publicId: string;
  hash: string;
  creatorId: string;
  registeredOn: string;
}

export default defineComponent({
  name: 'VerificationView',
  setup() {
    const publicIdentifier = ref('')
    const contentHash = ref('')
    const extractedMetadata = ref('')
    const registeredContent = ref<RegisteredContent | null>(null)

    const handleFileUpload = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        // Simulate content hash and metadata extraction
        contentHash.value = 'simulated-hash-' + file.name
        extractedMetadata.value = 'Simulated metadata for ' + file.name
      }
    }

    const registerContent = () => {
      if (publicIdentifier.value && contentHash.value) {
        // Simulate registration
        registeredContent.value = {
          publicId: publicIdentifier.value,
          hash: contentHash.value,
          creatorId: 'user123',
          registeredOn: new Date().toLocaleString()
        }
      }
    }

    return {
      publicIdentifier,
      contentHash,
      extractedMetadata,
      registeredContent,
      handleFileUpload,
      registerContent
    }
  }
})
</script>

<style scoped>
.verification {
  text-align: center;
  padding: 2rem;
}

.upload-section, .uploaded-data, .registered-content {
  margin: 2rem 0;
  text-align: left;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

input[type="file"], input[type="text"] {
  margin: 1rem 0;
  padding: 0.5rem;
  width: 100%;
}

button {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3aa876;
}
</style> 