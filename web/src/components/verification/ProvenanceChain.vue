<template>
  <div class="provenance-chain-container">
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Provenance Chain
      </h2>
      
      <!-- Timeline View Toggle -->
      <div class="flex items-center mb-4">
        <label class="inline-flex items-center">
          <input 
            type="checkbox" 
            v-model="showTimeline" 
            class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
          <span class="ml-2 text-sm text-gray-700">Timeline View</span>
        </label>
      </div>
    </div>

    <div v-if="showTimeline" class="timeline-container mb-8">
      <div class="relative">
        <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-indigo-200"></div>
        
        <div 
          v-for="(event, index) in provenanceEvents" 
          :key="index"
          class="relative flex items-start mb-8 group cursor-pointer transition-all duration-200"
          @click="selectEvent(index)"
          :class="{ 'bg-indigo-50 p-4 rounded-lg shadow-sm': selectedEventIndex === index }"
        >
          <!-- Timeline dot -->
          <div class="relative z-10 flex items-center justify-center w-16 h-16 bg-white border-4 rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-200"
               :class="getEventStatusColor(event.status)">
            <svg class="w-6 h-6" :class="getEventIconColor(event.status)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getEventIcon(event.type)"></path>
            </svg>
          </div>
          
          <!-- Event content -->
          <div class="ml-6 flex-1">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-800">{{ event.title }}</h3>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusBadgeClass(event.status)">
                {{ event.status }}
              </span>
            </div>
            
            <p class="text-sm text-gray-600 mt-1">{{ event.description }}</p>
            
            <div class="flex items-center mt-2 text-xs text-gray-500">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ formatDate(event.timestamp) }}
              
              <svg class="w-4 h-4 ml-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              {{ event.actor }}
            </div>
            
            <!-- Expanded details -->
            <div v-if="selectedEventIndex === index" class="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h4 class="font-semibold text-gray-700 mb-3">Event Details</h4>
              <dl class="grid grid-cols-1 gap-3 text-sm">
                <div v-for="(value, key) in event.details" :key="key" class="flex">
                  <dt class="font-medium text-gray-600 w-1/3">{{ formatKey(key) }}:</dt>
                  <dd class="text-gray-800 w-2/3 break-all">{{ value }}</dd>
                </div>
              </dl>
              
              <div v-if="event.modifications && event.modifications.length > 0" class="mt-4">
                <h5 class="font-semibold text-gray-700 mb-2">Modifications</h5>
                <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li v-for="mod in event.modifications" :key="mod" class="leading-relaxed">{{ mod }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="list-view mb-8">
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div v-if="provenanceEvents.length === 0" class="text-center text-gray-500 py-8">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p>No provenance events found.</p>
        </div>
        
        <ol v-else class="space-y-4">
          <li v-for="(event, index) in provenanceEvents" :key="index" 
              class="border-l-4 pl-4 py-3 bg-white rounded-r-lg shadow-sm"
              :class="getEventBorderClass(event.status)">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-gray-800">{{ event.title }}</h3>
              <div class="flex items-center space-x-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusBadgeClass(event.status)">
                  {{ event.status }}
                </span>
                <span class="text-xs text-gray-500">{{ formatDate(event.timestamp) }}</span>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-1">{{ event.description }}</p>
            <p class="text-xs text-gray-500">by {{ event.actor }}</p>
          </li>
        </ol>
      </div>
    </div>

    <!-- Modification History Section -->
    <div class="mt-8">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
        Modification History
      </h3>
      
      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actor</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(change, index) in modificationHistory" :key="index" class="hover:bg-gray-50 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(change.timestamp) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getChangeTypeBadgeClass(change.type)">
                    {{ change.type }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ change.field }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 max-w-md">
                  <div v-if="change.oldValue && change.newValue" class="space-y-1">
                    <div class="text-red-600 bg-red-50 px-2 py-1 rounded text-xs">- {{ truncateValue(change.oldValue) }}</div>
                    <div class="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">+ {{ truncateValue(change.newValue) }}</div>
                  </div>
                  <div v-else class="text-gray-600">{{ change.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ change.actor }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="modificationHistory.length === 0" class="text-center py-12 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <p>No modifications recorded.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

interface ProvenanceEvent {
  id: string
  title: string
  description: string
  timestamp: Date
  actor: string
  type: 'creation' | 'modification' | 'transfer' | 'verification' | 'deletion'
  status: 'completed' | 'pending' | 'failed' | 'verified'
  details: Record<string, any>
  modifications?: string[]
}

interface ModificationRecord {
  id: string
  timestamp: Date
  type: 'create' | 'update' | 'delete' | 'transfer'
  field: string
  oldValue?: string
  newValue?: string
  description: string
  actor: string
}

export default defineComponent({
  name: 'ProvenanceChain',
  props: {
    contentId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const showTimeline = ref(true)
    const selectedEventIndex = ref(-1)

    // Mock data - in real implementation, this would come from props or API
    const provenanceEvents = ref<ProvenanceEvent[]>([
      {
        id: '1',
        title: 'Content Creation',
        description: 'Original content was created and registered in the system',
        timestamp: new Date('2024-06-14T10:00:00Z'),
        actor: 'user1@example.com',
        type: 'creation',
        status: 'completed',
        details: {
          contentHash: 'abc123def456...',
          fileSize: '2.3 MB',
          mimeType: 'image/jpeg',
          device: 'Canon EOS R5',
          location: 'San Francisco, CA'
        }
      },
      {
        id: '2',
        title: 'Metadata Update',
        description: 'Content metadata was updated with additional EXIF information',
        timestamp: new Date('2024-06-15T09:30:00Z'),
        actor: 'user1@example.com',
        type: 'modification',
        status: 'verified',
        details: {
          changedFields: 'title, description, tags',
          previousHash: 'abc123def456...',
          newHash: 'def456ghi789...'
        },
        modifications: [
          'Title changed from "Untitled" to "Sunset at the Beach"',
          'Added description: "Beautiful sunset captured during vacation"',
          'Added tags: sunset, beach, vacation'
        ]
      },
      {
        id: '3',
        title: 'Ownership Transfer',
        description: 'Content ownership was transferred to a new user',
        timestamp: new Date('2024-06-16T14:20:00Z'),
        actor: 'system@araxa.com',
        type: 'transfer',
        status: 'completed',
        details: {
          previousOwner: 'user1@example.com',
          newOwner: 'user2@example.com',
          transferReason: 'Sale agreement #SA-2024-001',
          transferAmount: '$150.00'
        }
      },
      {
        id: '4',
        title: 'Verification Check',
        description: 'Content verification process initiated by third-party auditor',
        timestamp: new Date('2024-06-17T16:45:00Z'),
        actor: 'auditor@verifyco.com',
        type: 'verification',
        status: 'pending',
        details: {
          auditorId: 'AUD-001',
          verificationMethod: 'C2PA signature validation',
          estimatedCompletion: '2024-06-20 12:00 UTC',
          status: 'In Progress'
        }
      }
    ])

    const modificationHistory = ref<ModificationRecord[]>([
      {
        id: '1',
        timestamp: new Date('2024-06-14T10:00:00Z'),
        type: 'create',
        field: 'content',
        description: 'Initial content registration',
        actor: 'user1@example.com'
      },
      {
        id: '2',
        timestamp: new Date('2024-06-15T09:30:00Z'),
        type: 'update',
        field: 'title',
        oldValue: 'Untitled',
        newValue: 'Sunset at the Beach',
        description: 'Title updated by content owner',
        actor: 'user1@example.com'
      },
      {
        id: '3',
        timestamp: new Date('2024-06-15T09:31:00Z'),
        type: 'update',
        field: 'description',
        oldValue: '',
        newValue: 'Beautiful sunset captured during vacation at Ocean Beach, San Francisco',
        description: 'Description added by content owner',
        actor: 'user1@example.com'
      },
      {
        id: '4',
        timestamp: new Date('2024-06-15T09:32:00Z'),
        type: 'update',
        field: 'tags',
        oldValue: '[]',
        newValue: '["sunset", "beach", "vacation", "photography", "golden-hour"]',
        description: 'Tags added by content owner',
        actor: 'user1@example.com'
      },
      {
        id: '5',
        timestamp: new Date('2024-06-16T14:20:00Z'),
        type: 'transfer',
        field: 'owner',
        oldValue: 'user1@example.com',
        newValue: 'user2@example.com',
        description: 'Ownership transferred via sale agreement',
        actor: 'system@araxa.com'
      }
    ])

    const selectEvent = (index: number) => {
      selectedEventIndex.value = selectedEventIndex.value === index ? -1 : index
    }

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      }).format(date)
    }

    const formatKey = (key: string) => {
      return key.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
    }

    const truncateValue = (value: string, maxLength: number = 50) => {
      return value.length > maxLength ? value.substring(0, maxLength) + '...' : value
    }

    const getEventIcon = (type: string) => {
      const icons = {
        creation: 'M12 4v16m8-8H4',
        modification: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
        transfer: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
        verification: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        deletion: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
      }
      return icons[type as keyof typeof icons] || icons.modification
    }

    const getEventStatusColor = (status: string) => {
      const colors = {
        completed: 'border-green-400 bg-green-50',
        verified: 'border-blue-400 bg-blue-50',
        pending: 'border-yellow-400 bg-yellow-50',
        failed: 'border-red-400 bg-red-50'
      }
      return colors[status as keyof typeof colors] || colors.pending
    }

    const getEventIconColor = (status: string) => {
      const colors = {
        completed: 'text-green-600',
        verified: 'text-blue-600',
        pending: 'text-yellow-600',
        failed: 'text-red-600'
      }
      return colors[status as keyof typeof colors] || colors.pending
    }

    const getStatusBadgeClass = (status: string) => {
      const classes = {
        completed: 'bg-green-100 text-green-800',
        verified: 'bg-blue-100 text-blue-800',
        pending: 'bg-yellow-100 text-yellow-800',
        failed: 'bg-red-100 text-red-800'
      }
      return classes[status as keyof typeof classes] || classes.pending
    }

    const getEventBorderClass = (status: string) => {
      const classes = {
        completed: 'border-green-400',
        verified: 'border-blue-400',
        pending: 'border-yellow-400',
        failed: 'border-red-400'
      }
      return classes[status as keyof typeof classes] || classes.pending
    }

    const getChangeTypeBadgeClass = (type: string) => {
      const classes = {
        create: 'bg-green-100 text-green-800',
        update: 'bg-blue-100 text-blue-800',
        delete: 'bg-red-100 text-red-800',
        transfer: 'bg-purple-100 text-purple-800'
      }
      return classes[type as keyof typeof classes] || classes.update
    }

    return {
      showTimeline,
      selectedEventIndex,
      provenanceEvents,
      modificationHistory,
      selectEvent,
      formatDate,
      formatKey,
      truncateValue,
      getEventIcon,
      getEventStatusColor,
      getEventIconColor,
      getStatusBadgeClass,
      getEventBorderClass,
      getChangeTypeBadgeClass
    }
  }
})
</script>

<style scoped>
.provenance-chain-container {
  @apply w-full;
}

.timeline-container {
  @apply relative;
}
</style> 