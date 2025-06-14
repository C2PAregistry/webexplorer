<template>
  <div class="metadata-display">
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
        </svg>
        Content Metadata
      </h2>
      
      <!-- Toggle for advanced view -->
      <div class="flex items-center mb-4">
        <label class="inline-flex items-center">
          <input 
            type="checkbox" 
            v-model="showAdvanced" 
            class="form-checkbox h-4 w-4 text-indigo-600"
          >
          <span class="ml-2 text-sm text-gray-700">Show Advanced Metadata</span>
        </label>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Basic Information -->
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-between">
          Basic Information
          <button 
            @click="copyToClipboard('basic')"
            class="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
            title="Copy basic info to clipboard"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Copy
          </button>
        </h3>
        
        <dl class="space-y-3">
          <div class="flex items-start">
            <dt class="font-medium text-gray-600 w-1/3 text-sm">Public ID:</dt>
            <dd class="text-gray-900 w-2/3 text-sm font-mono break-all">{{ content.publicId }}</dd>
          </div>
          <div class="flex items-start">
            <dt class="font-medium text-gray-600 w-1/3 text-sm">Hash:</dt>
            <dd class="text-gray-900 w-2/3 text-sm font-mono break-all">{{ content.hash }}</dd>
          </div>
          <div class="flex items-start">
            <dt class="font-medium text-gray-600 w-1/3 text-sm">Creator ID:</dt>
            <dd class="text-gray-900 w-2/3 text-sm">{{ content.creatorId }}</dd>
          </div>
          <div class="flex items-start">
            <dt class="font-medium text-gray-600 w-1/3 text-sm">Registered:</dt>
            <dd class="text-gray-900 w-2/3 text-sm">{{ content.registeredOn }}</dd>
          </div>
        </dl>
      </div>

      <!-- File Information -->
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-between">
          File Information
          <button 
            @click="copyToClipboard('file')"
            class="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
            title="Copy file info to clipboard"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Copy
          </button>
        </h3>
        
        <dl class="space-y-3">
          <div class="flex items-start">
            <dt class="font-medium text-gray-600 w-1/3 text-sm">File Name:</dt>
            <dd class="text-gray-900 w-2/3 text-sm">{{ content.fileName }}</dd>
          </div>
          <div class="flex items-start">
            <dt class="font-medium text-gray-600 w-1/3 text-sm">File Type:</dt>
            <dd class="text-gray-900 w-2/3 text-sm">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {{ content.fileType }}
              </span>
            </dd>
          </div>
          <div class="flex items-start" v-if="content.fileSize">
            <dt class="font-medium text-gray-600 w-1/3 text-sm">File Size:</dt>
            <dd class="text-gray-900 w-2/3 text-sm">{{ formatFileSize(content.fileSize) }}</dd>
          </div>
          <div class="flex items-start" v-if="content.dimensions">
            <dt class="font-medium text-gray-600 w-1/3 text-sm">Dimensions:</dt>
            <dd class="text-gray-900 w-2/3 text-sm">{{ content.dimensions }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- Advanced Metadata (Collapsible) -->
    <div v-if="showAdvanced" class="mt-6">
      <div class="bg-white border border-gray-200 rounded-lg">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-700 flex items-center justify-between">
            Advanced Metadata
            <div class="flex items-center space-x-2">
              <button 
                @click="copyToClipboard('advanced')"
                class="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                title="Copy advanced metadata to clipboard"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                Copy
              </button>
              <button 
                @click="exportMetadata"
                class="text-sm text-green-600 hover:text-green-800 flex items-center"
                title="Export metadata as JSON"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Export
              </button>
            </div>
          </h3>
        </div>
        
        <div class="p-6">
          <!-- Collapsible sections for different metadata types -->
          <div v-for="(section, sectionName) in advancedMetadata" :key="sectionName" class="mb-6 last:mb-0">
            <button 
              @click="toggleSection(sectionName)"
              class="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h4 class="font-semibold text-gray-700 capitalize">{{ formatSectionName(sectionName) }}</h4>
              <svg 
                class="w-5 h-5 text-gray-500 transition-transform"
                :class="{ 'rotate-180': expandedSections.includes(sectionName) }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <div v-if="expandedSections.includes(sectionName)" class="mt-3 pl-3">
              <dl class="space-y-2">
                <div v-for="(value, key) in section" :key="key" class="flex items-start">
                  <dt class="font-medium text-gray-600 w-1/3 text-sm">{{ formatKey(key) }}:</dt>
                  <dd class="text-gray-900 w-2/3 text-sm">
                    <span v-if="typeof value === 'object'" class="font-mono text-xs bg-gray-100 p-1 rounded">
                      {{ JSON.stringify(value, null, 2) }}
                    </span>
                    <span v-else>{{ value }}</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div v-if="Object.keys(advancedMetadata).length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p>No advanced metadata available.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Copy Success Toast -->
    <div 
      v-if="showCopySuccess" 
      class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Copied to clipboard!
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'MetadataDisplay',
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const showAdvanced = ref(false)
    const expandedSections = ref<string[]>(['exif']) // Default to showing EXIF data
    const showCopySuccess = ref(false)

    // Mock advanced metadata - in real implementation, this would be parsed from props.content
    const advancedMetadata = computed(() => ({
      exif: {
        camera: 'Canon EOS R5',
        lens: 'RF 24-70mm f/2.8L IS USM',
        focalLength: '35mm',
        aperture: 'f/5.6',
        shutterSpeed: '1/125s',
        iso: '400',
        exposureMode: 'Manual',
        whiteBalance: 'Daylight',
        flash: 'No Flash',
        gpsLatitude: '37.7749',
        gpsLongitude: '-122.4194'
      },
      iptc: {
        title: 'Sunset at the Beach',
        description: 'Beautiful sunset captured during vacation',
        keywords: ['sunset', 'beach', 'vacation'],
        photographer: 'John Doe',
        copyright: '© 2024 John Doe',
        location: 'San Francisco, CA'
      },
      c2pa: {
        contentAuthenticity: 'Verified',
        originalCreator: 'user1@example.com',
        creationTimestamp: '2024-06-14T10:00:00Z',
        modifications: 'None detected',
        signingEntity: 'Canon Inc.',
        signatureValid: true
      }
    }))

    const toggleSection = (sectionName: string) => {
      const index = expandedSections.value.indexOf(sectionName)
      if (index > -1) {
        expandedSections.value.splice(index, 1)
      } else {
        expandedSections.value.push(sectionName)
      }
    }

    const formatSectionName = (name: string) => {
      return name.toUpperCase().replace(/([A-Z])/g, ' $1').trim()
    }

    const formatKey = (key: string) => {
      return key.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
    }

    const formatFileSize = (bytes: number) => {
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      if (bytes === 0) return '0 Bytes'
      const i = Math.floor(Math.log(bytes) / Math.log(1024))
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
    }

    const copyToClipboard = async (section: string) => {
      let textToCopy = ''
      
      switch (section) {
        case 'basic':
          textToCopy = `Public ID: ${props.content.publicId}
Hash: ${props.content.hash}
Creator ID: ${props.content.creatorId}
Registered: ${props.content.registeredOn}`
          break
        case 'file':
          textToCopy = `File Name: ${props.content.fileName}
File Type: ${props.content.fileType}`
          if (props.content.fileSize) textToCopy += `\nFile Size: ${formatFileSize(props.content.fileSize)}`
          if (props.content.dimensions) textToCopy += `\nDimensions: ${props.content.dimensions}`
          break
        case 'advanced':
          textToCopy = JSON.stringify(advancedMetadata.value, null, 2)
          break
      }

      try {
        await navigator.clipboard.writeText(textToCopy)
        showCopySuccess.value = true
        setTimeout(() => {
          showCopySuccess.value = false
        }, 2000)
      } catch (err) {
        console.error('Failed to copy to clipboard:', err)
      }
    }

    const exportMetadata = () => {
      const dataToExport = {
        basic: {
          publicId: props.content.publicId,
          hash: props.content.hash,
          creatorId: props.content.creatorId,
          registeredOn: props.content.registeredOn
        },
        file: {
          fileName: props.content.fileName,
          fileType: props.content.fileType,
          fileSize: props.content.fileSize,
          dimensions: props.content.dimensions
        },
        advanced: advancedMetadata.value
      }

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `metadata-${props.content.publicId}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    return {
      showAdvanced,
      expandedSections,
      showCopySuccess,
      advancedMetadata,
      toggleSection,
      formatSectionName,
      formatKey,
      formatFileSize,
      copyToClipboard,
      exportMetadata
    }
  }
})
</script> 