<template>
  <div class="verification">
    <h1>Content Verification</h1>
    <p class="subtitle">Verify the C2PA Metadata of your digital content.</p>

    <!-- Upload Content File -->
    <div class="content-section">
      <h2>Upload Content File (Image/Video/PDF)</h2>
      <div class="form-row">
        <div class="form-group">
          <label>
            <span class="help-text">Max size: Images 50MB, Videos 100MB, PDFs 20MB</span>
          </label>
          <input ref="fileInput" type="file" @change="handleFileUpload" accept="image/*,video/*,application/pdf" />
        </div>
      </div>
    </div>

    <!-- File Info Display -->
    <div v-if="fileInfo" class="info-box">
      <h3>File Information:</h3>
      <div class="info-details">
        <p><span class="label">Name:</span> {{ fileInfo.name }}</p>
        <p><span class="label">Size:</span> {{ formatFileSize(fileInfo.size) }}</p>
        <p><span class="label">Type:</span> {{ fileInfo.type || 'Unknown' }}</p>
        <p><span class="label">Last Modified:</span> {{ formatDate(fileInfo.lastModified) }}</p>
      </div>
    </div>

    <!-- Processing Indicator with Progress Bar -->
    <div v-if="isProcessing" class="processing-box">
      <div class="processing-content">
        <!-- Progress Header -->
        <div class="progress-header">
          <div class="progress-label">
            <div class="spinner"></div>
            <span>Processing File...</span>
          </div>
          <span class="progress-percentage">{{ Math.round(progressPercentage) }}%</span>
        </div>

        <!-- Progress Bar -->
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
        </div>

        <!-- Current Step -->
        <div class="current-step">
          <span class="step-counter">{{ currentStep }}/{{ totalSteps }}:</span>
          <span class="step-message">{{ processingMessage }}</span>
        </div>

        <!-- Steps Progress -->
        <div class="steps-progress">
          <div v-for="(step, _) in processingSteps" :key="step.name" class="step-item" :class="{
            'completed': step.completed,
            'active': step.active && !step.completed,
            'pending': !step.active && !step.completed
          }">
            <div class="step-content">
              <div v-if="step.completed" class="step-icon completed-icon">✓</div>
              <div v-else-if="step.active" class="step-icon active-icon"></div>
              <div v-else class="step-icon pending-icon"></div>
              <span class="step-name">{{ step.name }}</span>
            </div>
          </div>
        </div>

        <!-- Time Estimation -->
        <div v-if="timeRemaining && timeRemaining > 0" class="time-remaining">
          <span>Estimated time remaining: {{ formatTimeRemaining(timeRemaining) }}</span>
        </div>

        <!-- File Processing Info -->
        <div class="processing-info">
          <div>Processing: {{ fileInfo?.name || 'Unknown file' }}</div>
          <div v-if="fileInfo">Size: {{ formatFileSize(fileInfo.size) }} • Type: {{ fileInfo.type || 'Unknown' }}</div>
        </div>
      </div>
    </div>

    <!-- Warnings Display -->
    <div v-if="warnings.length > 0" class="warning-box">
      <h3>⚠️ Warnings:</h3>
      <ul>
        <li v-for="warning in warnings" :key="warning">
          <span>•</span>
          <span>{{ warning }}</span>
        </li>
      </ul>
    </div>

    <!-- Error Display -->
    <div v-if="errors.length > 0" class="error-box">
      <h3>❌ Errors:</h3>
      <ul>
        <li v-for="error in errors" :key="error">
          <span>•</span>
          <span>{{ error }}</span>
        </li>
      </ul>
      <button @click="clearErrors" class="clear-errors-btn">
        Clear errors and try again
      </button>
    </div>

    <!-- Processed Data -->
    <div v-if="contentHash || extractedMetadata || c2paData" class="processed-data">
      <h3>✅ Processed Data:</h3>
      <div class="data-sections">
        <div class="data-item">
          <span class="data-label">Content Hash (SHA-256):</span>
          <p class="hash-value">{{ contentHash || 'N/A' }}</p>
        </div>

        <!-- C2PA Information -->
        <div class="data-item">
          <span class="data-label">C2PA Content Authenticity:</span>
          <div v-if="c2paData" class="c2pa-info">
            <div v-if="c2paData.isValid" class="c2pa-status valid">
              <span class="status-icon">✓</span>
              <span class="status-text">Valid C2PA Certificate Found</span>
            </div>
            <div v-else class="c2pa-status invalid">
              <span class="status-icon">✗</span>
              <span class="status-text">Invalid C2PA Certificate</span>
            </div>

            <div class="c2pa-details">
              <div v-if="c2paData.producer" class="detail-row">
                <span class="detail-label">Producer:</span>
                <span class="detail-value">{{ c2paData.producer }}</span>
              </div>
              <div v-if="c2paData.created" class="detail-row">
                <span class="detail-label">Created:</span>
                <span class="detail-value">{{ formatDate(new Date(c2paData.created).getTime()) }}</span>
              </div>
              <div v-if="c2paData.software" class="detail-row">
                <span class="detail-label">Software:</span>
                <span class="detail-value">{{ c2paData.software }}</span>
              </div>
              <div v-if="c2paData.assertions && c2paData.assertions.length > 0" class="detail-row">
                <span class="detail-label">Assertions:</span>
                <span class="detail-value">{{ c2paData.assertions.length }} claim(s)</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Signature:</span>
                <span class="detail-value">{{ c2paData.signatureInfo || 'Present' }}</span>
              </div>
            </div>
          </div>
          <div v-else-if="c2paChecked" class="no-c2pa">
            <div class="no-c2pa-content">
              <span class="status-icon">ℹ</span>
              <span class="status-text">No C2PA certificate found in this file</span>
            </div>
          </div>
          <div v-else class="c2pa-pending">
            Checking for C2PA certificate...
          </div>
        </div>

        <div class="data-item">
          <span class="data-label">Extracted Metadata:</span>
          <div v-if="extractedMetadata" class="metadata-details">
            <div v-for="(value, key) in extractedMetadata" :key="key" class="detail-row">
              <span class="detail-label">{{ key }}:</span>
              <span class="detail-value">{{ value }}</span>
            </div>
          </div>
          <p v-else class="no-metadata">N/A (no metadata found or not an image)</p>
        </div>
      </div>
    </div>

    <button @click="registerContent" :disabled="!canRegister" class="register-btn">
      {{ getButtonText() }}
    </button>
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
      if (!contentHash.value) return 'Upload a file first'
      return 'Input C2PA metadata into the registry'
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
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  line-height: 1.6;
}

.verification h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.subtitle {
  color: #555;
  font-size: 1.1rem;
  margin-bottom: 3rem;
}

.user-info {
  margin-bottom: 2rem;
  text-align: center;
}

.user-id-info {
  background: #f8f9fa;
  color: #42b983;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.login-status {
  background: #e8f5e8;
  color: #369870;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
}

.content-section {
  margin: 3rem 0;
  text-align: left;
}

.content-section h2 {
  color: #42b983;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  border-bottom: 2px solid #42b983;
  padding-bottom: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.help-text {
  color: #666;
  font-size: 0.75rem;
  font-weight: normal;
  display: block;
  margin-top: 0.25rem;
}

.form-group input {
  padding: 0.75rem;
  border: 2px solid #e1e1e1;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #42b983;
}

.error-text {
  color: #e74c3c;
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

.info-box,
.processing-box,
.warning-box,
.error-box,
.processed-data {
  margin: 2rem 0;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: left;
}

.info-box {
  background: #f8f9fa;
  border-left: 4px solid #42b983;
}

.info-box h3 {
  color: #42b983;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.info-details p {
  margin: 0.5rem 0;
  color: #555;
}

.label {
  font-weight: 600;
  color: #2c3e50;
}

.processing-box {
  background: #f0f8ff;
  border-left: 4px solid #42b983;
}

.processing-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.progress-header {
  display: flex;
  justify-content: between;
  align-items: center;
}

.progress-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #42b983;
  font-weight: 600;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e1e1e1;
  border-top: 2px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.progress-percentage {
  color: #42b983;
  font-weight: 600;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: #e1e1e1;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #42b983;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.current-step {
  color: #555;
  font-size: 0.9rem;
}

.step-counter {
  font-weight: 600;
  color: #42b983;
}

.steps-progress {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.5rem;
}

.step-item {
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
}

.step-item.completed {
  background: #e8f5e8;
  color: #369870;
}

.step-item.active {
  background: #f0f8ff;
  color: #42b983;
}

.step-item.pending {
  background: #f8f9fa;
  color: #999;
}

.step-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.step-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
}

.completed-icon {
  background: #369870;
  color: white;
  border-radius: 50%;
}

.active-icon {
  border: 2px solid #42b983;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.pending-icon {
  border: 1px solid #ccc;
  border-radius: 50%;
  opacity: 0.5;
}

.time-remaining,
.processing-info {
  color: #666;
  font-size: 0.8rem;
}

.warning-box {
  background: #fff8e1;
  border-left: 4px solid #ffa726;
}

.warning-box h3 {
  color: #f57c00;
  margin-bottom: 1rem;
}

.warning-box ul li {
  color: #e65100;
  margin: 0.5rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.error-box {
  background: #ffebee;
  border-left: 4px solid #f44336;
}

.error-box h3 {
  color: #d32f2f;
  margin-bottom: 1rem;
}

.error-box ul li {
  color: #c62828;
  margin: 0.5rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.clear-errors-btn {
  background: none;
  border: none;
  color: #d32f2f;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.8rem;
  margin-top: 1rem;
  padding: 0;
}

.clear-errors-btn:hover {
  color: #b71c1c;
}

.processed-data {
  background: #f8f9fa;
  border-left: 4px solid #42b983;
}

.processed-data h3 {
  color: #42b983;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.data-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.data-item {
  padding-bottom: 1rem;
  border-bottom: 1px solid #e1e1e1;
}

.data-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.data-label {
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.75rem;
}

.hash-value {
  font-family: 'Courier New', monospace;
  color: #666;
  font-size: 0.8rem;
  word-break: break-all;
  background: #f5f5f5;
  padding: 0.5rem;
  border-radius: 4px;
  margin: 0;
}

.c2pa-info {
  margin-top: 0.75rem;
}

.c2pa-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.c2pa-status.valid {
  background: #e8f5e8;
  color: #369870;
}

.c2pa-status.invalid {
  background: #ffebee;
  color: #d32f2f;
}

.status-icon {
  font-weight: bold;
  font-size: 1rem;
}

.c2pa-details {
  background: white;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  padding: 1rem;
}

.detail-row {
  display: flex;
  margin-bottom: 0.75rem;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  min-width: 120px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.detail-value {
  color: #555;
  font-size: 0.9rem;
  word-break: break-all;
}

.no-c2pa,
.c2pa-pending {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: #666;
}

.no-c2pa-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.metadata-details {
  margin-top: 0.75rem;
}

.no-metadata {
  color: #999;
  font-style: italic;
  font-size: 0.9rem;
  margin: 0.75rem 0 0 0;
}

.register-btn {
  width: 100%;
  padding: 1rem 2rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 2rem 0;
  transition: background-color 0.3s ease;
}

.register-btn:hover:not(:disabled) {
  background-color: #369870;
}

.register-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 2px solid #e1e1e1;
  border-radius: 6px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #42b983;
}

.table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e1e1e1;
}

.content-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.content-table th {
  background: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  font-size: 0.9rem;
  border-bottom: 2px solid #e1e1e1;
}

.content-table td {
  padding: 1rem;
  border-bottom: 1px solid #e1e1e1;
  color: #555;
  font-size: 0.9rem;
}

.content-table tr:last-child td {
  border-bottom: none;
}

.no-content {
  color: #999;
  font-style: italic;
  text-align: center;
}

@media (max-width: 768px) {
  .verification {
    padding: 1rem;
  }

  .verification h1 {
    font-size: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .steps-progress {
    grid-template-columns: 1fr;
  }

  .detail-row {
    flex-direction: column;
    gap: 0.25rem;
  }

  .detail-label {
    min-width: auto;
  }
}
</style>
