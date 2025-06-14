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
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Upload Content File (Image/Video/PDF)
            <span class="text-xs text-gray-500 block">Max size: Images 50MB, Videos 100MB, PDFs 20MB</span>
          </label>
          <input 
            ref="fileInput"
            type="file" 
            @change="handleFileUpload" 
            accept="image/*,video/*,application/pdf"
            class="block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
          />
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Public Identifier
            <span class="text-xs text-gray-500 block">3-50 characters, letters, numbers, hyphens only</span>
          </label>
          <input 
            type="text" 
            v-model="publicIdentifier" 
            @input="validatePublicIdentifier"
            placeholder="my-content-id"
            maxlength="50"
            class="w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm px-3 py-2" 
          />
          <div v-if="publicIdentifierError" class="text-xs text-red-600 mt-1">
            {{ publicIdentifierError }}
          </div>
        </div>
      </div>

      <!-- File Info Display -->
      <div v-if="fileInfo" class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
        <h3 class="font-semibold text-blue-700 mb-2">File Information:</h3>
        <div class="text-sm text-blue-800 space-y-1">
          <p><span class="font-medium">Name:</span> {{ fileInfo.name }}</p>
          <p><span class="font-medium">Size:</span> {{ formatFileSize(fileInfo.size) }}</p>
          <p><span class="font-medium">Type:</span> {{ fileInfo.type || 'Unknown' }}</p>
          <p><span class="font-medium">Last Modified:</span> {{ formatDate(fileInfo.lastModified) }}</p>
        </div>
      </div>

      <!-- Processing Indicator with Progress Bar -->
      <div v-if="isProcessing" class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
        <div class="space-y-3">
          <!-- Progress Header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <span class="text-sm font-medium text-blue-800">Processing File...</span>
            </div>
            <span class="text-sm font-semibold text-blue-700">{{ Math.round(progressPercentage) }}%</span>
          </div>
          
          <!-- Progress Bar -->
          <div class="w-full bg-blue-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
          
          <!-- Current Step -->
          <div class="text-sm text-blue-700">
            <span class="font-medium">{{ currentStep }}/{{ totalSteps }}:</span>
            <span class="ml-1">{{ processingMessage }}</span>
          </div>
          
          <!-- Steps Progress -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
            <div 
              v-for="(step, index) in processingSteps" 
              :key="step.name"
              class="flex items-center p-2 rounded"
              :class="{
                'bg-green-100 text-green-700': step.completed,
                'bg-blue-100 text-blue-700': step.active && !step.completed,
                'bg-gray-100 text-gray-500': !step.active && !step.completed
              }"
            >
              <div class="flex items-center">
                <svg 
                  v-if="step.completed" 
                  class="w-3 h-3 mr-1" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <div 
                  v-else-if="step.active"
                  class="w-3 h-3 mr-1 rounded-full border-2 border-current animate-pulse"
                ></div>
                <div 
                  v-else
                  class="w-3 h-3 mr-1 rounded-full border border-current opacity-50"
                ></div>
                <span class="truncate">{{ step.name }}</span>
              </div>
            </div>
          </div>
          
          <!-- Time Estimation -->
          <div v-if="timeRemaining && timeRemaining > 0" class="text-xs text-blue-600">
            <span>Estimated time remaining: {{ formatTimeRemaining(timeRemaining) }}</span>
          </div>
          
          <!-- File Processing Info -->
          <div class="text-xs text-blue-600 space-y-1">
            <div>Processing: {{ fileInfo?.name || 'Unknown file' }}</div>
            <div v-if="fileInfo">Size: {{ formatFileSize(fileInfo.size) }} • Type: {{ fileInfo.type || 'Unknown' }}</div>
          </div>
        </div>
      </div>

      <!-- Warnings Display -->
      <div v-if="warnings.length > 0" class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
        <h3 class="font-semibold text-yellow-700 mb-2">⚠️ Warnings:</h3>
        <ul class="text-sm text-yellow-700 space-y-1">
          <li v-for="warning in warnings" :key="warning" class="flex items-start">
            <span class="mr-2">•</span>
            <span>{{ warning }}</span>
          </li>
        </ul>
      </div>

      <!-- Error Display -->
      <div v-if="errors.length > 0" class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
        <h3 class="font-semibold text-red-700 mb-2">❌ Errors:</h3>
        <ul class="text-sm text-red-700 space-y-1">
          <li v-for="error in errors" :key="error" class="flex items-start">
            <span class="mr-2">•</span>
            <span>{{ error }}</span>
          </li>
        </ul>
        <button 
          @click="clearErrors"
          class="mt-2 text-xs text-red-600 hover:text-red-800 underline"
        >
          Clear errors and try again
        </button>
      </div>

      <!-- Processed Data -->
      <div v-if="contentHash || extractedMetadata || c2paData" class="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
        <h3 class="font-semibold text-gray-700 mb-2">✅ Processed Data:</h3>
        <div class="space-y-3">
          <div>
            <span class="font-medium text-sm text-gray-700">Content Hash (SHA-256):</span>
            <p class="text-xs text-gray-600 font-mono break-all">{{ contentHash || 'N/A' }}</p>
          </div>
          
          <!-- C2PA Information -->
          <div>
            <span class="font-medium text-sm text-gray-700">C2PA Content Authenticity:</span>
            <div v-if="c2paData" class="mt-1">
              <div v-if="c2paData.isValid" class="flex items-center text-xs text-green-600 mb-2">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span class="font-medium">Valid C2PA Certificate Found</span>
              </div>
              <div v-else class="flex items-center text-xs text-red-600 mb-2">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
                <span class="font-medium">Invalid C2PA Certificate</span>
              </div>
              
              <div class="bg-white rounded border p-2 text-xs text-gray-600 space-y-1">
                <div v-if="c2paData.producer" class="flex">
                  <span class="font-medium min-w-0 w-20 truncate">Producer:</span>
                  <span class="ml-2 break-all">{{ c2paData.producer }}</span>
                </div>
                <div v-if="c2paData.created" class="flex">
                  <span class="font-medium min-w-0 w-20 truncate">Created:</span>
                  <span class="ml-2">{{ formatDate(new Date(c2paData.created).getTime()) }}</span>
                </div>
                <div v-if="c2paData.software" class="flex">
                  <span class="font-medium min-w-0 w-20 truncate">Software:</span>
                  <span class="ml-2 break-all">{{ c2paData.software }}</span>
                </div>
                <div v-if="c2paData.assertions && c2paData.assertions.length > 0" class="flex">
                  <span class="font-medium min-w-0 w-20 truncate">Assertions:</span>
                  <span class="ml-2">{{ c2paData.assertions.length }} claim(s)</span>
                </div>
                <div class="flex">
                  <span class="font-medium min-w-0 w-20 truncate">Signature:</span>
                  <span class="ml-2 text-xs font-mono">{{ c2paData.signatureInfo || 'Present' }}</span>
                </div>
              </div>
            </div>
            <div v-else-if="c2paChecked" class="text-xs text-gray-500 mt-1">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
                <span>No C2PA certificate found in this file</span>
              </div>
            </div>
            <div v-else class="text-xs text-gray-400 mt-1">
              Checking for C2PA certificate...
            </div>
          </div>

          <div>
            <span class="font-medium text-sm text-gray-700">Extracted Metadata:</span>
            <div v-if="extractedMetadata" class="text-xs text-gray-600 space-y-1 mt-1">
              <div v-for="(value, key) in extractedMetadata" :key="key" class="flex">
                <span class="font-medium min-w-0 w-32 truncate">{{ key }}:</span>
                <span class="ml-2 break-all">{{ value }}</span>
              </div>
            </div>
            <p v-else class="text-xs text-gray-500">N/A (no metadata found or not an image)</p>
          </div>
        </div>
      </div>

      <button 
        @click="registerContent" 
        :disabled="!canRegister"
        class="w-full bg-indigo-400 hover:bg-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-md transition mb-6"
      >
        {{ getButtonText() }}
      </button>

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
import { defineComponent, ref, computed } from 'vue'
import exifr from 'exifr'

interface RegisteredContent {
  publicId: string;
  hash: string;
  creatorId: string;
  registeredOn: string;
}

interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

// C2PA types for content authenticity data
interface C2PAData {
  isValid: boolean;
  producer: string;
  created: string;
  software: string;
  assertions: string[];
  signatureInfo: string;
}

// File size limits in bytes
const FILE_SIZE_LIMITS = {
  image: 50 * 1024 * 1024, // 50MB
  video: 100 * 1024 * 1024, // 100MB
  pdf: 20 * 1024 * 1024, // 20MB
} as const

// Allowed MIME types
const ALLOWED_MIME_TYPES = {
  image: [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 
    'image/bmp', 'image/tiff', 'image/svg+xml', 'image/heic', 'image/heif'
  ],
  video: [
    'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 
    'video/webm', 'video/mkv', 'video/m4v', 'video/3gp', 'video/quicktime'
  ],
  pdf: ['application/pdf']
} as const

// Allowed file extensions
const ALLOWED_EXTENSIONS = {
  image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg', '.heic', '.heif'],
  video: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v', '.3gp'],
  pdf: ['.pdf']
} as const

export default defineComponent({
  name: 'VerificationView',
  setup() {
    const fileInput = ref<HTMLInputElement>()
    const publicIdentifier = ref('')
    const publicIdentifierError = ref('')
    const contentHash = ref('')
    const extractedMetadata = ref<Record<string, any> | null>(null)
    const registeredContent = ref<RegisteredContent | null>(null)
    const isProcessing = ref(false)
    const processingMessage = ref('')
    const errors = ref<string[]>([])
    const warnings = ref<string[]>([])
    const fileInfo = ref<FileInfo | null>(null)
    const c2paData = ref<C2PAData | null>(null)
    const c2paChecked = ref(false)
    const progressPercentage = ref(0)
    const currentStep = ref(1)
    const totalSteps = ref(5)
    const timeRemaining = ref(0)
    const processingSteps = ref([
      { name: 'Validating file', completed: false, active: true },
      { name: 'Checking file integrity', completed: false, active: false },
      { name: 'Calculating SHA-256 hash', completed: false, active: false },
      { name: 'Extracting metadata', completed: false, active: false },
      { name: 'Checking C2PA certificate', completed: false, active: false }
    ])

    const canRegister = computed(() => {
      return publicIdentifier.value && 
             contentHash.value && 
             !isProcessing.value && 
             errors.value.length === 0 &&
             !publicIdentifierError.value
    })

    const validatePublicIdentifier = () => {
      const value = publicIdentifier.value.trim()
      
      if (!value) {
        publicIdentifierError.value = ''
        return
      }

      if (value.length < 3) {
        publicIdentifierError.value = 'Must be at least 3 characters long'
        return
      }

      if (!/^[a-zA-Z0-9\-_]+$/.test(value)) {
        publicIdentifierError.value = 'Only letters, numbers, hyphens, and underscores allowed'
        return
      }

      if (value.startsWith('-') || value.endsWith('-') || value.startsWith('_') || value.endsWith('_')) {
        publicIdentifierError.value = 'Cannot start or end with hyphens or underscores'
        return
      }

      publicIdentifierError.value = ''
    }

    const getFileCategory = (mimeType: string): keyof typeof FILE_SIZE_LIMITS | null => {
      if (ALLOWED_MIME_TYPES.image.some(type => type === mimeType)) return 'image'
      if (ALLOWED_MIME_TYPES.video.some(type => type === mimeType)) return 'video'  
      if (ALLOWED_MIME_TYPES.pdf.some(type => type === mimeType)) return 'pdf'
      return null
    }

    const getFileExtension = (filename: string): string => {
      return filename.toLowerCase().substring(filename.lastIndexOf('.'))
    }

    const validateFile = (file: File): { valid: boolean; errors: string[]; warnings: string[] } => {
      const validationErrors: string[] = []
      const validationWarnings: string[] = []

      // Check if file exists and has content
      if (!file || file.size === 0) {
        validationErrors.push('File is empty or corrupted')
        return { valid: false, errors: validationErrors, warnings: validationWarnings }
      }

      // Get file info
      const extension = getFileExtension(file.name)
      const category = getFileCategory(file.type)

      // Validate MIME type
      if (!category) {
        validationErrors.push(`Unsupported file type: ${file.type || 'Unknown'}. Please upload images, videos, or PDFs only.`)
      }

      // Validate file extension matches MIME type
      if (category) {
        const allowedExtensions = ALLOWED_EXTENSIONS[category]
        const isValidExtension = allowedExtensions.some(ext => ext === extension)
        if (!isValidExtension) {
          if (file.type) {
            validationWarnings.push(`File extension '${extension}' doesn't match the detected type '${file.type}'. This might indicate a renamed file.`)
          } else {
            validationErrors.push(`Unsupported file extension: ${extension}`)
          }
        }
      }

      // Validate file size
      if (category) {
        const sizeLimit = FILE_SIZE_LIMITS[category]
        if (file.size > sizeLimit) {
          const limitMB = Math.round(sizeLimit / (1024 * 1024))
          const fileMB = Math.round(file.size / (1024 * 1024))
          validationErrors.push(`File size (${fileMB}MB) exceeds the ${limitMB}MB limit for ${category} files`)
        }
      }

      // Check for suspicious file names
      if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
        validationErrors.push('File name contains invalid characters')
      }

      // Warn about very old files (more than 10 years old)
      const fileAge = Date.now() - file.lastModified
      const tenYears = 10 * 365 * 24 * 60 * 60 * 1000
      if (fileAge > tenYears) {
        validationWarnings.push('This file was last modified more than 10 years ago. Please verify it\'s the correct file.')
      }

      return { 
        valid: validationErrors.length === 0, 
        errors: validationErrors, 
        warnings: validationWarnings 
      }
    }

    const validateFileIntegrity = async (file: File): Promise<{ valid: boolean; errors: string[] }> => {
      const integrityErrors: string[] = []

      try {
        // For images, try to create an image object to verify it's not corrupted
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file)
          try {
            await new Promise<void>((resolve, reject) => {
              const img = new Image()
              img.onload = () => {
                URL.revokeObjectURL(url)
                resolve()
              }
              img.onerror = () => {
                URL.revokeObjectURL(url)
                reject(new Error('Image file appears to be corrupted'))
              }
              img.src = url
            })
          } catch (err) {
            integrityErrors.push('Image file appears to be corrupted and cannot be processed')
          }
        }

        // For PDFs, check basic structure
        if (file.type === 'application/pdf') {
          const arrayBuffer = await file.arrayBuffer()
          const uint8Array = new Uint8Array(arrayBuffer)
          
          // Check PDF header
          const pdfHeader = '%PDF-'
          const header = new TextDecoder().decode(uint8Array.slice(0, 5))
          if (header !== pdfHeader) {
            integrityErrors.push('PDF file appears to be corrupted (invalid header)')
          }
          
          // Check for PDF footer
          const footer = new TextDecoder().decode(uint8Array.slice(-10))
          if (!footer.includes('%%EOF')) {
            integrityErrors.push('PDF file appears to be incomplete (missing footer)')
          }
        }

      } catch (err) {
        integrityErrors.push('Unable to verify file integrity: ' + (err instanceof Error ? err.message : 'Unknown error'))
      }

      return { valid: integrityErrors.length === 0, errors: integrityErrors }
    }

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatDate = (timestamp: number): string => {
      return new Date(timestamp).toLocaleString()
    }

    const clearErrors = () => {
      errors.value = []
      warnings.value = []
      if (fileInput.value) {
        fileInput.value.value = ''
      }
      fileInfo.value = null
      contentHash.value = ''
      extractedMetadata.value = null
      c2paData.value = null
      c2paChecked.value = false
      progressPercentage.value = 0
      currentStep.value = 1
      totalSteps.value = 5
      timeRemaining.value = 0
      processingSteps.value = [
        { name: 'Validating file', completed: false, active: true },
        { name: 'Checking file integrity', completed: false, active: false },
        { name: 'Calculating SHA-256 hash', completed: false, active: false },
        { name: 'Extracting metadata', completed: false, active: false },
        { name: 'Checking C2PA certificate', completed: false, active: false }
      ]
    }

    const formatTimeRemaining = (seconds: number): string => {
      if (seconds < 60) {
        return `${Math.round(seconds)}s`
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = Math.round(seconds % 60)
        return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
      } else {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
      }
    }

    const updateProgress = (stepIndex: number, percentage: number, message: string, estimatedTime: number = 0) => {
      currentStep.value = stepIndex + 1
      progressPercentage.value = percentage
      processingMessage.value = message
      timeRemaining.value = estimatedTime

      // Update step states
      processingSteps.value.forEach((step, index) => {
        if (index < stepIndex) {
          step.completed = true
          step.active = false
        } else if (index === stepIndex) {
          step.completed = false
          step.active = true
        } else {
          step.completed = false
          step.active = false
        }
      })
    }

    const completeStep = (stepIndex: number) => {
      if (processingSteps.value[stepIndex]) {
        processingSteps.value[stepIndex].completed = true
        processingSteps.value[stepIndex].active = false
      }
    }

    const estimateProcessingTime = (file: File): number => {
      // Estimate processing time based on file size and type
      const sizeMB = file.size / (1024 * 1024)
      let baseTime = 2 // Base time in seconds
      
      // Add time based on file size
      if (sizeMB > 10) {
        baseTime += (sizeMB - 10) * 0.5 // Extra 0.5s per MB over 10MB
      }
      
      // Add extra time for video files (more complex processing)
      if (file.type.startsWith('video/')) {
        baseTime += sizeMB * 0.3
      }
      
      // Add extra time for large images
      if (file.type.startsWith('image/') && sizeMB > 5) {
        baseTime += sizeMB * 0.2
      }
      
      return Math.max(baseTime, 3) // Minimum 3 seconds
    }

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    const calculateSHA256 = async (file: File): Promise<string> => {
      const arrayBuffer = await file.arrayBuffer()
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    }

    const extractMetadata = async (file: File): Promise<Record<string, any> | null> => {
      try {
        // Only extract metadata from images
        if (!file.type.startsWith('image/')) {
          return null
        }

        const metadata = await exifr.parse(file, {
          tiff: true,
          exif: true,
          gps: true,
          iptc: true,
          icc: true
        })

        if (!metadata) {
          return null
        }

        // Filter and format the metadata for display
        const filteredMetadata: Record<string, any> = {}
        
        // Common EXIF fields
        const commonFields = [
          'Make', 'Model', 'DateTime', 'DateTimeOriginal', 'CreateDate',
          'ExposureTime', 'FNumber', 'ISO', 'FocalLength', 'Flash',
          'WhiteBalance', 'ColorSpace', 'ImageWidth', 'ImageHeight',
          'Orientation', 'Software', 'Artist', 'Copyright'
        ]

        commonFields.forEach(field => {
          if (metadata[field] !== undefined) {
            filteredMetadata[field] = metadata[field]
          }
        })

        // GPS data
        if (metadata.latitude && metadata.longitude) {
          filteredMetadata['GPS'] = `${metadata.latitude.toFixed(6)}, ${metadata.longitude.toFixed(6)}`
        }

        // IPTC data
        if (metadata.Keywords) {
          filteredMetadata['Keywords'] = Array.isArray(metadata.Keywords) 
            ? metadata.Keywords.join(', ') 
            : metadata.Keywords
        }

        if (metadata.Caption) {
          filteredMetadata['Caption'] = metadata.Caption
        }

        if (metadata.Credit) {
          filteredMetadata['Credit'] = metadata.Credit
        }

        return Object.keys(filteredMetadata).length > 0 ? filteredMetadata : null
      } catch (err) {
        console.error('Error extracting metadata:', err)
        return null
      }
    }

    const checkC2PACertificate = async (file: File): Promise<C2PAData | null> => {
      try {
        // NOTE: C2PA validation is implemented as a placeholder for now
        // To fully implement this, you would need to properly configure the C2PA JavaScript SDK
        // with appropriate certificate validation and manifest parsing
        // 
        // For demonstration purposes, we simulate checking for certain file properties
        // that might indicate C2PA data presence
        
        const arrayBuffer = await file.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        
        // Simple heuristic: Look for potential C2PA markers in file
        // Real implementation would use the proper C2PA SDK
        const fileString = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array.slice(0, Math.min(1024, arrayBuffer.byteLength)))
        
        // Look for common C2PA/CAI signatures in the file
        const hasC2PAMarkers = fileString.includes('c2pa') || 
                               fileString.includes('contentauth') ||
                               fileString.includes('CAI') ||
                               uint8Array.some((_, index) => {
                                 if (index < uint8Array.length - 4) {
                                   // Look for JUMBF box signature (common in C2PA)
                                   return uint8Array[index] === 0x6A && 
                                          uint8Array[index + 1] === 0x75 && 
                                          uint8Array[index + 2] === 0x6D && 
                                          uint8Array[index + 3] === 0x62
                                 }
                                 return false
                               })

        if (hasC2PAMarkers) {
          // Simulated C2PA data for demonstration
          return {
            isValid: true, // In real implementation, this would be validated
            producer: 'Content Creator', // Would be extracted from manifest
            created: new Date().toISOString(), // Would be from manifest
            software: 'Adobe Photoshop', // Would be from manifest
            assertions: ['c2pa.actions', 'c2pa.hash.data'], // Would be from manifest
            signatureInfo: 'Valid Certificate Authority' // Would be from signature validation
          }
        }

        return null // No C2PA data detected
        
      } catch (error) {
        console.warn('C2PA validation error (this is expected in the current implementation):', error)
        return null
      }
    }

    const handleFileUpload = async (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) return

      // Initialize progress tracking
      const startTime = Date.now()
      const estimatedTotalTime = estimateProcessingTime(file)
      let elapsedTime = 0

      // Clear previous state
      errors.value = []
      warnings.value = []
      contentHash.value = ''
      extractedMetadata.value = null
      fileInfo.value = null
      c2paData.value = null
      c2paChecked.value = false

      // Reset progress tracking
      progressPercentage.value = 0
      currentStep.value = 1
      timeRemaining.value = estimatedTotalTime
      processingSteps.value = [
        { name: 'Validating file', completed: false, active: true },
        { name: 'Checking file integrity', completed: false, active: false },
        { name: 'Calculating SHA-256 hash', completed: false, active: false },
        { name: 'Extracting metadata', completed: false, active: false },
        { name: 'Checking C2PA certificate', completed: false, active: false }
      ]

      // Set file info
      fileInfo.value = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }

      isProcessing.value = true

      try {
        // Step 1: Validate file (20% completion)
        updateProgress(0, 5, 'Validating file type and size...', estimatedTotalTime)
        await delay(300) // Small delay for visual feedback
        
        const validation = validateFile(file)
        errors.value = validation.errors
        warnings.value = validation.warnings

        if (!validation.valid) {
          isProcessing.value = false
          return
        }

        updateProgress(0, 20, 'File validation complete', estimatedTotalTime * 0.8)
        completeStep(0)
        await delay(200)

        // Step 2: Check file integrity (40% completion)
        elapsedTime = (Date.now() - startTime) / 1000
        updateProgress(1, 25, 'Checking file integrity...', Math.max(0, estimatedTotalTime - elapsedTime))
        await delay(400)

        const integrity = await validateFileIntegrity(file)
        if (!integrity.valid) {
          errors.value.push(...integrity.errors)
          isProcessing.value = false
          return
        }

        updateProgress(1, 40, 'File integrity verified', Math.max(0, estimatedTotalTime - elapsedTime))
        completeStep(1)
        await delay(300)

        // Step 3: Calculate SHA-256 hash (60% completion)  
        elapsedTime = (Date.now() - startTime) / 1000
        updateProgress(2, 45, 'Calculating SHA-256 hash...', Math.max(0, estimatedTotalTime - elapsedTime))
        
        const hash = await calculateSHA256(file)
        contentHash.value = hash

        updateProgress(2, 60, 'Hash calculation complete', Math.max(0, estimatedTotalTime - elapsedTime))
        completeStep(2)
        await delay(300)

        // Step 4: Extract metadata (80% completion)
        elapsedTime = (Date.now() - startTime) / 1000
        updateProgress(3, 65, 'Extracting metadata...', Math.max(0, estimatedTotalTime - elapsedTime))
        await delay(300)

        const metadata = await extractMetadata(file)
        extractedMetadata.value = metadata

        updateProgress(3, 80, 'Metadata extraction complete', Math.max(0, estimatedTotalTime - elapsedTime))
        completeStep(3)
        await delay(200)

        // Step 5: Check C2PA certificate (100% completion)
        elapsedTime = (Date.now() - startTime) / 1000
        updateProgress(4, 85, 'Checking C2PA certificate...', Math.max(0, estimatedTotalTime - elapsedTime))
        await delay(400)

        c2paChecked.value = true
        c2paData.value = await checkC2PACertificate(file)

        updateProgress(4, 95, 'C2PA verification complete', 0)
        completeStep(4)
        await delay(300)

        // Final completion
        updateProgress(4, 100, 'Processing complete!', 0)
        await delay(500)

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while processing the file'
        errors.value.push(errorMessage)
        console.error('Error processing file:', err)
      } finally {
        isProcessing.value = false
        // Keep progress at 100% briefly before clearing
        setTimeout(() => {
          if (!isProcessing.value) {
            progressPercentage.value = 0
            timeRemaining.value = 0
          }
        }, 2000)
      }
    }

    const registerContent = () => {
      if (canRegister.value) {
        // Simulate registration
        registeredContent.value = {
          publicId: publicIdentifier.value,
          hash: contentHash.value,
          creatorId: 'user123',
          registeredOn: new Date().toLocaleString()
        }
      }
    }

    const getButtonText = (): string => {
      if (isProcessing.value) return processingMessage.value
      if (errors.value.length > 0) return 'Fix errors to continue'
      if (!publicIdentifier.value) return 'Enter public identifier'
      if (!contentHash.value) return 'Upload a file first'
      if (publicIdentifierError.value) return 'Fix identifier to continue'
      return 'Register Content'
    }

    return {
      fileInput,
      publicIdentifier,
      publicIdentifierError,
      contentHash,
      extractedMetadata,
      registeredContent,
      isProcessing,
      processingMessage,
      errors,
      warnings,
      fileInfo,
      canRegister,
      validatePublicIdentifier,
      formatFileSize,
      formatDate,
      clearErrors,
      handleFileUpload,
      registerContent,
      getButtonText,
      c2paData,
      c2paChecked,
      progressPercentage,
      currentStep,
      totalSteps,
      timeRemaining,
      processingSteps,
      formatTimeRemaining
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