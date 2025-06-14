<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <button @click="$router.back()" class="mb-4 text-indigo-600 hover:underline text-sm flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back
        </button>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Content Details</h1>
        <p class="text-gray-600">Comprehensive information about registered content</p>
      </div>
      
      <!-- Enhanced Metadata Display -->
      <div class="mb-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
            </svg>
            Content Metadata
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Basic Information -->
            <div class="space-y-4">
              <h3 class="font-semibold text-gray-700 text-lg">Basic Information</h3>
              <dl class="space-y-3">
                <div class="flex flex-col sm:flex-row sm:items-start">
                  <dt class="font-medium text-gray-600 sm:w-1/3 text-sm">Public ID:</dt>
                  <dd class="text-gray-900 sm:w-2/3 text-sm font-mono break-all mt-1 sm:mt-0">{{ content.publicId }}</dd>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-start">
                  <dt class="font-medium text-gray-600 sm:w-1/3 text-sm">Hash:</dt>
                  <dd class="text-gray-900 sm:w-2/3 text-sm font-mono break-all mt-1 sm:mt-0">{{ content.hash }}</dd>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-start">
                  <dt class="font-medium text-gray-600 sm:w-1/3 text-sm">Creator ID:</dt>
                  <dd class="text-gray-900 sm:w-2/3 text-sm mt-1 sm:mt-0">{{ content.creatorId }}</dd>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-start">
                  <dt class="font-medium text-gray-600 sm:w-1/3 text-sm">Registered:</dt>
                  <dd class="text-gray-900 sm:w-2/3 text-sm mt-1 sm:mt-0">{{ content.registeredOn }}</dd>
                </div>
              </dl>
            </div>

            <!-- File Information -->
            <div class="space-y-4">
              <h3 class="font-semibold text-gray-700 text-lg">File Information</h3>
              <dl class="space-y-3">
                <div class="flex flex-col sm:flex-row sm:items-start">
                  <dt class="font-medium text-gray-600 sm:w-1/3 text-sm">File Name:</dt>
                  <dd class="text-gray-900 sm:w-2/3 text-sm mt-1 sm:mt-0">{{ content.fileName }}</dd>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-start">
                  <dt class="font-medium text-gray-600 sm:w-1/3 text-sm">File Type:</dt>
                  <dd class="text-gray-900 sm:w-2/3 text-sm mt-1 sm:mt-0">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ content.fileType }}
                    </span>
                  </dd>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-start">
                  <dt class="font-medium text-gray-600 sm:w-1/3 text-sm">Metadata:</dt>
                  <dd class="text-gray-900 sm:w-2/3 text-sm mt-1 sm:mt-0">{{ content.extractedMetadata }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Provenance Chain Component -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <ProvenanceChain :content-id="content.publicId" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import ProvenanceChain from '../components/verification/ProvenanceChain.vue'

export default defineComponent({
  name: 'ContentDetailsView',
  components: {
    ProvenanceChain
  },
  setup() {
    const route = useRoute()
    // Mock data for demonstration
    const content = ref({
      publicId: (Array.isArray(route.params.id) ? route.params.id[0] : route.params.id) || 'photo-1',
      hash: 'mockhash1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      creatorId: 'user1',
      registeredOn: new Date().toLocaleString(),
      fileName: 'my-photo.jpg',
      fileType: 'image/jpeg',
      extractedMetadata: 'Camera: Canon EOS, ISO: 100, ...',
    })
    
    return {
      content
    }
  }
})
</script> 