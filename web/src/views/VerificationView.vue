<template>
  <div class="verification">
    <h1>Register New Content</h1>
    <div class="upload-section">
      <h2>Upload Content File</h2>
      <input type="file" @change="handleFileUpload" />
      <input type="text" v-model="publicIdentifier" placeholder="Public Identifier (e.g., my-first-nft-photo)" />
      <button @click="registerContent">Register Content</button>
    </div>
    <div class="uploaded-data" v-if="contentHash">
      <h2>Uploaded Data</h2>
      <p><strong>Content Hash (SHA-256):</strong> {{ contentHash }}</p>
      <p><strong>Extracted Metadata:</strong> {{ extractedMetadata }}</p>
    </div>
    <div class="registered-content" v-if="registeredContent">
      <h2>Registered Content</h2>
      <p><strong>Public ID:</strong> {{ registeredContent.publicId }}</p>
      <p><strong>Hash:</strong> {{ registeredContent.hash }}</p>
      <p><strong>Creator ID:</strong> {{ registeredContent.creatorId }}</p>
      <p><strong>Registered On:</strong> {{ registeredContent.registeredOn }}</p>
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
          registeredOn: new Date().toISOString()
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