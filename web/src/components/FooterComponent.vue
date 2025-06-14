<template>
  <footer class="site-footer">
    <div class="footer-content">
      <ul class="footer-links">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <li><router-link to="/technical">Technical Info</router-link></li>
        <li><router-link to="/api">API</router-link></li>
        <li><router-link to="/terms">Terms of Use</router-link></li>
        <li><router-link to="/verification">Verification</router-link></li>
        <li><router-link to="/search">Search</router-link></li>
        <li><router-link to="/contribute">Contribute</router-link></li>
      </ul>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FooterComponent'
})
</script>

<style scoped>
.site-footer {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  color: white;
  margin-top: 4rem;
  padding: 2rem 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: center;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.footer-links li {
  margin: 0;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
}

.footer-links a:hover {
  color: #42b983;
}

.footer-links a.router-link-active {
  color: #42b983;
}

@media (max-width: 768px) {
  .footer-content {
    padding: 0 1rem;
  }
  
  .footer-links {
    gap: 1rem;
    flex-direction: column;
    align-items: center;
  }
  
  .footer-links a {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .footer-links {
    gap: 0.8rem;
  }
  
  .footer-links a {
    font-size: 0.85rem;
  }
}
</style> 