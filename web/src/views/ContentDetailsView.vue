<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center py-8">
    <div class="w-full max-w-2xl bg-white rounded-xl shadow-md p-8">
      <button @click="$router.back()" class="mb-4 text-indigo-600 hover:underline text-sm">&larr; Back</button>
      <h1 class="text-2xl font-bold text-indigo-700 mb-4 text-center">Content Details</h1>
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">Metadata</h2>
        <div class="bg-gray-50 border border-gray-200 rounded-md p-4">
          <p class="mb-1"><span class="font-medium">Public ID:</span> {{ content.publicId }}</p>
          <p class="mb-1"><span class="font-medium">Hash:</span> {{ content.hash }}</p>
          <p class="mb-1"><span class="font-medium">Creator ID:</span> {{ content.creatorId }}</p>
          <p class="mb-1"><span class="font-medium">Registered On:</span> {{ content.registeredOn }}</p>
          <p class="mb-1"><span class="font-medium">File Name:</span> {{ content.fileName }}</p>
          <p class="mb-1"><span class="font-medium">File Type:</span> {{ content.fileType }}</p>
          <p class="mb-1"><span class="font-medium">Extracted Metadata:</span> {{ content.extractedMetadata }}</p>
        </div>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-gray-700 mb-2">Provenance Chain</h2>
        <div class="bg-gray-50 border border-gray-200 rounded-md p-4">
          <ol class="list-decimal ml-6">
            <li v-for="(event, idx) in provenanceChain" :key="idx" class="mb-2">
              <span class="font-medium">{{ event.date }}:</span> {{ event.description }}
            </li>
          </ol>
          <div v-if="provenanceChain.length === 0" class="text-gray-400">No provenance events found.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'ContentDetailsView',
  setup() {
    const route = useRoute()
    // Mock data for demonstration
    const content = ref({
      publicId: route.params.id || 'photo-1',
      hash: 'mockhash1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      creatorId: 'user1',
      registeredOn: new Date().toLocaleString(),
      fileName: 'my-photo.jpg',
      fileType: 'image/jpeg',
      extractedMetadata: 'Camera: Canon EOS, ISO: 100, ...',
    })
    const provenanceChain = ref([
      { date: '2024-06-14 10:00', description: 'Content registered by user1.' },
      { date: '2024-06-15 09:30', description: 'Metadata updated by user1.' },
      { date: '2024-06-16 14:20', description: 'Ownership transferred to user2.' },
    ])
    return {
      content,
      provenanceChain
    }
  }
})
</script> 