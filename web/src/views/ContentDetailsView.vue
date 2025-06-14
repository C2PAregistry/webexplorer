<template>
  <div class="content-details">
    <button @click="$router.back()" class="back-btn">&larr; Back</button>
    <h1>Content Details</h1>
    
    <div class="content-section">
      <h2>Metadata</h2>
      <div class="details-box">
        <div class="detail-item">
          <span class="detail-label">Public ID:</span>
          <span class="detail-value">{{ content.publicId }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Hash:</span>
          <span class="detail-value hash-value">{{ content.hash }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Creator ID:</span>
          <span class="detail-value">{{ content.creatorId }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Registered On:</span>
          <span class="detail-value">{{ content.registeredOn }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">File Name:</span>
          <span class="detail-value">{{ content.fileName }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">File Type:</span>
          <span class="detail-value">{{ content.fileType }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Extracted Metadata:</span>
          <span class="detail-value">{{ content.extractedMetadata }}</span>
        </div>
      </div>
    </div>
    
    <div class="content-section">
      <h2>Provenance Chain</h2>
      <div class="details-box">
        <ol class="provenance-list" v-if="provenanceChain.length > 0">
          <li v-for="(event, idx) in provenanceChain" :key="idx" class="provenance-item">
            <span class="provenance-date">{{ event.date }}:</span>
            <span class="provenance-description">{{ event.description }}</span>
          </li>
        </ol>
        <div v-else class="no-provenance">No provenance events found.</div>
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

<style scoped>
.content-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  line-height: 1.6;
}

.back-btn {
  background: none;
  border: none;
  color: #42b983;
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
}

.back-btn:hover {
  color: #369870;
  text-decoration: underline;
}

.content-details h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
}

.content-section {
  margin-bottom: 3rem;
}

.content-section h2 {
  color: #42b983;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  border-bottom: 2px solid #42b983;
  padding-bottom: 0.5rem;
}

.details-box {
  background: #f8f9fa;
  border-left: 4px solid #42b983;
  border-radius: 8px;
  padding: 1.5rem;
}

.detail-item {
  display: flex;
  margin-bottom: 1rem;
  align-items: flex-start;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-weight: 600;
  color: #2c3e50;
  min-width: 160px;
  font-size: 0.9rem;
}

.detail-value {
  color: #555;
  font-size: 0.9rem;
  flex: 1;
  word-break: break-word;
}

.hash-value {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  background: #f5f5f5;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.provenance-list {
  list-style: none;
  counter-reset: step-counter;
  padding: 0;
}

.provenance-item {
  counter-increment: step-counter;
  margin-bottom: 1rem;
  position: relative;
  padding-left: 2rem;
}

.provenance-item:last-child {
  margin-bottom: 0;
}

.provenance-item::before {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: 0;
  background: #42b983;
  color: white;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

.provenance-date {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.provenance-description {
  color: #555;
  font-size: 0.9rem;
  margin-left: 0.5rem;
}

.no-provenance {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 1rem;
}

@media (max-width: 768px) {
  .content-details {
    padding: 1rem;
  }
  
  .content-details h1 {
    font-size: 2rem;
  }
  
  .content-section h2 {
    font-size: 1.5rem;
  }
  
  .detail-item {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .detail-label {
    min-width: auto;
  }
  
  .provenance-item {
    padding-left: 2.5rem;
  }
  
  .provenance-date,
  .provenance-description {
    display: block;
    margin-left: 0;
  }
  
  .provenance-description {
    margin-top: 0.25rem;
  }
}
</style> 