<template>
  <div class="contribute">
    <h1>Love what we're building? Help us grow:</h1>
    
    <div class="contribution-sections">
      <div class="contribution-card">
        <h2>💰 Buy Us a Coffee</h2>
        <p class="description">Support our work with a small donation!</p>
        <div class="donation-section">
          <div class="nimiq-address">
            <div class="address-container">
              <code class="nimiq-wallet">NQ69 R83V YQXR L0LF YPEY 11KH SKX9 T7BY CBVH</code>
              <button @click="copyAddress" class="copy-btn">📋 Copy</button>
            </div>
            <p class="address-note">Send <a href="https://nimiq.com" target="_blank" class="nimiq-link">Nimiq (NIM)</a> to this address</p>
          </div>
        </div>
      </div>

      <div class="contribution-card">
        <h2>💻 Contribute to the Code</h2>
        <p class="description">We're open-source!</p>
        <div class="code-section">
          <div class="repo-links">
            <a href="https://github.com/c2paregistry" target="_blank" class="repo-link">
              🔗 github.com/c2paregistry
            </a>
          </div>
          <div class="contribution-types">
            <h3>How you can help:</h3>
            <ul>
              <li>🐛 Report bugs and issues</li>
              <li>💡 Suggest new features</li>
              <li>🔧 Submit pull requests</li>
              <li>📚 Improve documentation</li>
              <li>🧪 Write tests</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="thank-you">
      <h2>🙏 Thank You!</h2>
      <p>Reach us at <a href="mailto:info@C2PARegistry.com" class="email-link">info@C2PARegistry.com</a> to help shape the future of content authenticity.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ContributeView',
  setup() {
    const copyAddress = async () => {
      const address = 'NQ69 R83V YQXR L0LF YPEY 11KH SKX9 T7BY CBVH'
      try {
        await navigator.clipboard.writeText(address)
        alert('Nimiq address copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy: ', err)
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = address
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        alert('Nimiq address copied to clipboard!')
      }
    }

    return {
      copyAddress
    }
  }
})
</script>

<style scoped>
.contribute {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.contribute h1 {
  color: #2c3e50;
  margin-bottom: 3rem;
  font-size: 2.5rem;
}

.contribution-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.contribution-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #e1e5e9;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.contribution-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.contribution-card h2 {
  color: #42b983;
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

.description {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.donation-section {
  text-align: center;
}

.nimiq-address h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.address-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.nimiq-wallet {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  border: 2px solid #42b983;
  color: #2c3e50;
  word-break: break-all;
}

.copy-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.copy-btn:hover {
  background: #369870;
}

.address-note {
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
}

.nimiq-link {
  color: #42b983;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.nimiq-link:hover {
  color: #369870;
  text-decoration: underline;
}

.code-section {
  text-align: left;
}

.code-section p {
  margin-bottom: 1.5rem;
  color: #555;
}

.repo-links {
  margin-bottom: 2rem;
  text-align: center;
}

.repo-link {
  display: inline-block;
  background: #2c3e50;
  color: white;
  text-decoration: none;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.3s ease;
}

.repo-link:hover {
  background: #34495e;
}

.contribution-types h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.contribution-types ul {
  list-style: none;
  padding: 0;
}

.contribution-types li {
  padding: 0.5rem 0;
  color: #555;
  font-size: 1rem;
}

.thank-you {
  background: linear-gradient(135deg, #42b983, #369870);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-top: 2rem;
}

.thank-you h2 {
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

.thank-you p {
  font-size: 1.1rem;
  line-height: 1.6;
}

.email-link {
  color: white;
  text-decoration: underline;
  font-weight: 600;
  transition: opacity 0.3s ease;
}

.email-link:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .contribute {
    padding: 1rem;
  }
  
  .contribute h1 {
    font-size: 2rem;
  }
  
  .contribution-sections {
    grid-template-columns: 1fr;
  }
  
  .address-container {
    flex-direction: column;
  }
  
  .nimiq-wallet {
    font-size: 0.8rem;
  }
}
</style> 