<template>
  <div class="content-details">
    <button @click="$router.back()" class="back-btn">&larr; Back</button>
    <h1>Entry Details</h1>

    <div v-if="loading" class="loading">Loading…</div>

    <template v-else>
      <div class="content-section" v-if="content">
        <h2>Metadata</h2>
        <div class="details-box">
          <div class="detail-item">
            <span class="detail-label">ID:</span>
            <span class="detail-value">{{ content.id }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Name:</span>
            <span class="detail-value">{{ content.name }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Source URL:</span>
            <a :href="content.reference" target="_blank" class="detail-value source-link">{{ content.reference }}</a>
          </div>
        </div>
      </div>

      <div class="content-section">
        <h2>Outgoing References</h2>
        <div class="details-box">
          <ul v-if="references.length" class="ref-list">
            <li v-for="(ref, idx) in references" :key="idx" class="reference-card">
              <div class="ref-header">
                <strong class="ref-title">{{ ref.assertion?.data?.title || 'Untitled' }}</strong>
                <span v-if="ref.assertion?.data?.year" class="ref-year">({{ ref.assertion.data.year }})</span>
              </div>
              <div v-if="ref.assertion?.data?.authors?.length" class="ref-authors">
                by {{ ref.assertion.data.authors.join(', ') }}
              </div>
              <div class="ref-links">
                <a v-if="ref.assertion?.data?.abstract" :href="ref.assertion.data.abstract" target="_blank">Abstract</a>
                <a v-if="ref.assertion?.data?.file" :href="ref.assertion.data.file" target="_blank">PDF</a>
              </div>
            </li>
          </ul>
          <p v-else>No outgoing references for this entry.</p>
        </div>
      </div>

      <div class="content-section">
        <h2>Used By</h2>
        <div class="details-box">
          <ul v-if="usedBy.length" class="ref-list">
            <li v-for="(item, idx) in usedBy" :key="idx" class="reference-card">
              <router-link :to="`/content/${item.id}`" class="ref-title">{{ item.name }}</router-link>
              <span class="ref-id">(ID: {{ item.id }})</span>
            </li>
          </ul>
          <p v-else>No other entries reference this one.</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'ContentDetailsView',
  setup() {
    const API_BASE = 'http://91.99.113.226:3000'
    const route = useRoute()
    const content = ref<any | null>(null)
    const references = ref<any[]>([])
    const usedBy = ref<any[]>([])
    const loading = ref(true)

    const loadData = async () => {
      try {
        const id = route.params.id
        const entryRes = await fetch(`${API_BASE}/entry/${id}`)
        if (!entryRes.ok) throw new Error('Entry not found')
        content.value = await entryRes.json()

        const refRes = await fetch(`${API_BASE}/entry/${id}/references`)
        if (refRes.ok) {
          const data = await refRes.json()
          references.value = data.references || []
          usedBy.value = data.usedBy || []
        }

        loading.value = false
      } catch (err) {
        console.error('Failed to load content details', err)
      }
    }

    onMounted(loadData)

    return {
      content,
      references,
      usedBy,
      loading
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

.source-link {
  color: #42b983;
  text-decoration: underline;
}

.references-item {
  margin-bottom: 0.5rem;
}

.loading {
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
}

/* reference card styling */
.ref-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.reference-card {
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.ref-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.ref-title {
  color: #2c3e50;
  font-weight: 600;
  text-decoration: none;
}

.ref-title:hover {
  text-decoration: underline;
}

.ref-year {
  color: #6c757d;
  font-size: 0.875rem;
}

.ref-authors {
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.ref-links a {
  color: #42b983;
  margin-right: 1rem;
  font-size: 0.85rem;
}

.ref-links a:hover {
  text-decoration: underline;
}

.ref-id {
  color: #6c757d;
  font-size: 0.85rem;
  margin-left: 0.25rem;
}
</style> 