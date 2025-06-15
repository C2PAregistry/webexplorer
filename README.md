**C2PA-like Global Registry for Digital Content Provenance**

This project is an independent, publicly verifiable record system for digital content provenance, providing content authenticity verification and modification tracking.

## Features

- 🔍 **Content Verification** - Search and verify digital content authenticity
- 📁 **Content Registration** - Upload and register new digital content with provenance tracking
- 🔗 **Provenance Chain** - Track content modification history and original creators
- 🌐 **Public Registry** - Transparent, publicly accessible verification system

## Architecture

- **Frontend**: Vue 3 + TypeScript + Tailwind CSS
- **Backend**: Fastify server with REST API
- **Content Types**: Images, Videos, PDFs with metadata extraction

## Quick Start

1. **Install dependencies**:
```bash
npm install
```

2. **Start the server**:
```bash
npm start
```

3. **Start the web interface** (in separate terminal):
```bash
cd web
npm run dev
```

4. **Access the application**:
   - Web Interface: http://localhost:5173
   - API Server: http://localhost:3000

## Project Structure

```
araxa/
├── server/           # Backend API and storage
├── web/             # Vue.js frontend application
├── simple-server.js # Main server entry point
└── package.json     # Server dependencies
```

## Development Status

This is an active development project. See `ARAXA_WEB_INTERFACE_PLAN.md` for detailed development roadmap and current progress.
