<template>
  <div class="terms-of-use">
    <h1>Terms of Use</h1>
    
    <div class="content-container">
      <div class="terms-content">
        <p class="intro">By using C2PARegistry.com, you agree to the following:</p>
        
        <div class="terms-list">
          <div class="term-item">
            <div class="term-icon">⚠️</div>
            <div class="term-text">
              <p>This tool is experimental and provided as-is, as part of an open effort to support the C2PA ecosystem.</p>
            </div>
          </div>

          <div class="term-item">
            <div class="term-icon">📋</div>
            <div class="term-text">
              <p>We provide a public, open registry of C2PA metadata.</p>
            </div>
          </div>

          <div class="term-item">
            <div class="term-icon">🔍</div>
            <div class="term-text">
              <p>We do not verify the truth of C2PA claims — we store what was provided.</p>
            </div>
          </div>

          <div class="term-item">
            <div class="term-icon">🚫</div>
            <div class="term-text">
              <p>You agree not to use our platform for malicious submissions, metadata tampering, or impersonation.</p>
            </div>
          </div>

          <div class="term-item">
            <div class="term-icon">🌐</div>
            <div class="term-text">
              <p>All content is public and may be used for research, transparency, and interoperability.</p>
            </div>
          </div>

          <div class="term-item">
            <div class="term-icon">🛡️</div>
            <div class="term-text">
              <p>We reserve the right to moderate clearly fraudulent or abusive entries.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-note">
        <p><strong>Last Updated:</strong> June 2025</p>
        <p>Questions? <a href="mailto:info@C2PARegistry.com">Contact us</a></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TermsOfUseView'
})
</script>

<style scoped>
.terms-of-use {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.terms-of-use h1 {
  color: #2c3e50;
  margin-bottom: 3rem;
  font-size: 2.5rem;
  text-align: center;
}

.content-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.terms-content {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #e9ecef;
}

.intro {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 8px;
  border-left: 4px solid #42b983;
}

.terms-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.term-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #42b983;
  transition: all 0.3s ease;
}

.term-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.term-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.2rem;
}

.term-text {
  flex: 1;
}

.term-text p {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
  line-height: 1.6;
}

.footer-note {
  background: linear-gradient(135deg, #42b983, #369870);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}

.footer-note p {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.footer-note p:first-child {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.footer-note a {
  color: white;
  text-decoration: underline;
  font-weight: 600;
}

.footer-note a:hover {
  color: #f8f9fa;
  text-decoration: none;
}

@media (max-width: 768px) {
  .terms-of-use {
    padding: 1rem;
  }
  
  .terms-of-use h1 {
    font-size: 2rem;
  }
  
  .terms-content {
    padding: 2rem 1.5rem;
  }
  
  .intro {
    font-size: 1.1rem;
    padding: 1rem;
  }
  
  .term-item {
    padding: 1rem;
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .term-item:hover {
    transform: none;
  }
  
  .term-icon {
    align-self: center;
    margin-top: 0;
  }
  
  .term-text p {
    font-size: 1rem;
  }
  
  .footer-note {
    padding: 1.5rem;
  }
}
</style> 