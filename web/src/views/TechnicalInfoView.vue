<template>
  <div class="technical-info">
    <h1>Technical Info</h1>
    
    <div class="content-section">
      <h2>C2PA Technical Overview</h2>
      <p>The C2PA standard defines a way to attach tamper-evident metadata to digital content — including who created it, what tools were used, and what edits occurred.</p>
    </div>

    <div class="content-section">
      <h2>What is Content Provenance?</h2>
      <p>Content provenance is the verifiable origin and history of a media asset. It answers: Where did this come from? Who made it? Has it been altered?</p>
    </div>

    <div class="content-section">
      <h2>C2PA Manifests and Assertions</h2>
      <p>C2PA content includes manifests that define assertions like:</p>
      <ul class="assertion-list">
        <li><strong>Capture device</strong> (e.g. iPhone, camera)</li>
        <li><strong>Editing software used</strong> (e.g. Adobe Photoshop)</li>
        <li><strong>Creator identity or claim</strong></li>
        <li><strong>Timestamps and edit history</strong></li>
      </ul>
    </div>

    <div class="content-section">
      <h2>What Are C2PA History Chains?</h2>
      <p>A history chain connects all the previous versions and modifications of a file — allowing users to trace back through its entire life cycle.</p>
    </div>

    <div class="content-section highlight-section">
      <h2>What is the C2PA Registry?</h2>
      <p>We are an open-source, independent registry for storing and retrieving C2PA metadata from any compliant file or service.</p>
      <p><strong>We do not validate the C2PA claims</strong> — we provide the infrastructure to look them up, connect them, and trust them across platforms.</p>
    </div>

    <div class="content-section">
      <h2>How C2PA Registry Works</h2>
      <ul class="workflow-list">
        <li>Developers can register new assets with their manifests.</li>
        <li>Researchers can search by hash or content ID.</li>
        <li>Users can explore provenance histories across tools and platforms.</li>
        <li>Everything is public, timestamped, and stored with hosting references.</li>
      </ul>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <h2>Current Feature Set</h2>
        <ul>
          <li>Public search by hash, content ID, or URL</li>
          <li>Register C2PA manifests manually or via API</li>
          <li>Visual explorer of provenance chains</li>
          <li>Hosting reference linking</li>
          <li>Open API with documentation</li>
          <li>Public JSON-LD metadata output</li>
        </ul>
      </div>

      <div class="feature-card todo-card">
        <h2>Features To-Do</h2>
        <ul>
          <li>Manual platform ingestion Web tool</li>
          <li>Automatic platform ingestion tools for Third-Party Software</li>
          <li>Timeline-style chain viewer</li>
          <li>Creator profiles</li>
          <li>Dispute flags and moderation</li>
          <li>Enhanced identity linkage (e.g. DIDs)</li>
        </ul>
      </div>
    </div>

    <div class="content-section feature-request">
      <h2>Feature Requests</h2>
      <p>💡 Got an idea? <a href="https://github.com/c2paregistry/issues" target="_blank" class="github-link">Submit a GitHub issue</a></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TechnicalInfoView'
})
</script>

<style scoped>
.technical-info {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  line-height: 1.7;
}

.technical-info h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
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

.content-section p {
  color: #555;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  text-align: justify;
}

.assertion-list, .workflow-list {
  margin: 1.5rem 0;
  padding-left: 0;
  list-style: none;
}

.assertion-list li, .workflow-list li {
  background: #f8f9fa;
  margin: 0.8rem 0;
  padding: 1rem;
  border-left: 4px solid #42b983;
  border-radius: 0 8px 8px 0;
  color: #555;
}

.assertion-list li strong {
  color: #2c3e50;
}

.highlight-section {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 2rem;
  border-radius: 12px;
  border: 2px solid #42b983;
}

.highlight-section p strong {
  color: #e74c3c;
  font-weight: 600;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #e1e5e9;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.feature-card h2 {
  color: #42b983;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #42b983;
  padding-bottom: 0.5rem;
  font-size: 1.5rem;
}

.todo-card {
  border-color: #f39c12;
}

.todo-card h2 {
  color: #f39c12;
  border-bottom-color: #f39c12;
}

.feature-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-card li {
  background: #f8f9fa;
  margin: 0.8rem 0;
  padding: 0.8rem;
  border-radius: 6px;
  color: #555;
  border-left: 3px solid #42b983;
}

.todo-card li {
  border-left-color: #f39c12;
}

.feature-request {
  background: linear-gradient(135deg, #42b983, #369870);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}

.feature-request h2 {
  color: white;
  border-bottom-color: white;
  margin-bottom: 1rem;
}

.feature-request p {
  color: white;
  font-size: 1.2rem;
  margin: 0;
}

.github-link {
  color: white;
  text-decoration: underline;
  font-weight: 600;
  transition: opacity 0.3s ease;
}

.github-link:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .technical-info {
    padding: 1rem;
  }
  
  .technical-info h1 {
    font-size: 2rem;
  }
  
  .content-section h2 {
    font-size: 1.5rem;
  }
  
  .content-section p {
    font-size: 1rem;
    text-align: left;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .feature-card {
    padding: 1.5rem;
  }
}
</style> 