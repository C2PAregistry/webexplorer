<template>
  <div class="about">
    <h1>About</h1>
    
    <div class="content-section">
      <h2>The Problem</h2>
      <p>As generative AI continues to blur the line between real and synthetic content, we face a future where authenticity cannot be taken for granted. While the C2PA standard provides a powerful framework for content provenance, its impact is limited when metadata remains siloed, scattered, or missing — making cross-platform verification unreliable or impossible.</p>
      <p>For C2PA to reach mainstream adoption, it needs a credible, independent registry — one that any social media or content creation platform can reference. C2PARegistry.com exists to fill that gap: a neutral, shared layer that connects metadata across tools and ecosystems, helping the entire internet speak the same language of trust.</p>
    </div>

    <div class="content-section">
      <h2>Our Mission</h2>
      <p>We exist to preserve trust in digital media by providing an open, neutral, and platform-agnostic registry that indexes and makes C2PA metadata publicly searchable.</p>
    </div>

    <div class="content-section">
      <h2>Our Vision</h2>
      <p>A future where all public content — no matter where it's published — can be traced to its origin, with a searchable record of its modifications.</p>
      <div class="vision-statement">
        <p>We envision a world where provenance is public, authenticity is easy to check, and trust is infrastructure.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AboutView'
})
</script>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  line-height: 1.7;
}

.about h1 {
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

.vision-statement {
  background: linear-gradient(135deg, #42b983, #369870);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-top: 2rem;
  text-align: center;
}

.vision-statement p {
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0;
  font-style: italic;
}

@media (max-width: 768px) {
  .about {
    padding: 1rem;
  }
  
  .about h1 {
    font-size: 2rem;
  }
  
  .content-section h2 {
    font-size: 1.5rem;
  }
  
  .content-section p {
    font-size: 1rem;
    text-align: left;
  }
}
</style> 