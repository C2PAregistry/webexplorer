<template>
  <div class="api">
    <h1>API</h1>
    
    <div class="content-container">
      <div class="main-message">
        <div class="icon">🚧</div>
        <h2>API for Third-Party Platforms</h2>
        <p class="status-message">Our API for third-party platforms is currently <strong>work in progress</strong>.</p>
        <p class="description">We're developing comprehensive API endpoints that will allow seamless integration with content creation platforms, social media services, and verification tools.</p>
      </div>

      <div class="contact-section">
        <h3>Get Early Access</h3>
        <p>Interested in integrating with our API? We'd love to hear from you!</p>
        <div class="contact-actions">
          <a href="mailto:info@C2PARegistry.com" class="contact-btn primary">
            📧 Contact us for more information
          </a>
          <a href="https://github.com/c2paregistry" target="_blank" class="contact-btn secondary">
            💻 Follow development on GitHub
          </a>
        </div>
      </div>

      <div class="coming-soon">
        <h3>Coming Soon</h3>
        <ul class="feature-preview">
          <li>RESTful API endpoints for content registration</li>
          <li>Search and retrieval by hash, content ID, or URL</li>
          <li>Bulk manifest upload capabilities</li>
          <li>Real-time provenance chain queries</li>
          <li>Webhook notifications for content updates</li>
          <li>Comprehensive API documentation</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ApiView'
})
</script>

<style scoped>
.api {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.api h1 {
  color: #2c3e50;
  margin-bottom: 3rem;
  font-size: 2.5rem;
}

.content-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.main-message {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 3rem 2rem;
  border-radius: 16px;
  border: 2px solid #f39c12;
}

.icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.main-message h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 2rem;
}

.status-message {
  color: #f39c12;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.description {
  color: #555;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 0;
}

.contact-section {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #42b983;
}

.contact-section h3 {
  color: #42b983;
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

.contact-section p {
  color: #555;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.contact-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.contact-btn {
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  min-width: 280px;
}

.contact-btn.primary {
  background: #42b983;
  color: white;
  border: 2px solid #42b983;
}

.contact-btn.primary:hover {
  background: #369870;
  border-color: #369870;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.contact-btn.secondary {
  background: white;
  color: #2c3e50;
  border: 2px solid #2c3e50;
}

.contact-btn.secondary:hover {
  background: #2c3e50;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.3);
}

.coming-soon {
  background: linear-gradient(135deg, #42b983, #369870);
  color: white;
  padding: 2.5rem;
  border-radius: 12px;
  text-align: left;
}

.coming-soon h3 {
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.feature-preview {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-preview li {
  background: rgba(255, 255, 255, 0.1);
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid white;
  font-size: 1.1rem;
  backdrop-filter: blur(5px);
}

.feature-preview li:before {
  content: "✓ ";
  color: white;
  font-weight: bold;
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .api {
    padding: 1rem;
  }
  
  .api h1 {
    font-size: 2rem;
  }
  
  .main-message {
    padding: 2rem 1.5rem;
  }
  
  .main-message h2 {
    font-size: 1.6rem;
  }
  
  .status-message {
    font-size: 1.1rem;
  }
  
  .contact-section {
    padding: 2rem 1.5rem;
  }
  
  .contact-btn {
    min-width: auto;
    width: 100%;
  }
  
  .coming-soon {
    padding: 2rem 1.5rem;
    text-align: center;
  }
  
  .feature-preview {
    text-align: left;
  }
}
</style> 