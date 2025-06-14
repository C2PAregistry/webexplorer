const fastify = require('fastify')({
    logger: true
})

// Register CORS without MySQL dependency
fastify.register(require('@fastify/cors'), {
    origin: '*'
})

// Mock data for testing
const mockEntries = [
    {
        id: 1,
        title: "Sample Content 1",
        hash: "a1b2c3d4e5f6",
        creator: "test-user",
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        title: "Sample Content 2", 
        hash: "f6e5d4c3b2a1",
        creator: "demo-user",
        created_at: new Date().toISOString()
    }
]

// Mock API endpoints
fastify.get('/entry', function (req, res) {
    res.send(mockEntries)
})

fastify.get('/entry/:id', function (req, res) {
    const entry = mockEntries.find(e => e.id === parseInt(req.params.id))
    if (entry) {
        res.send(entry)
    } else {
        res.code(404).send({ error: 'Entry not found' })
    }
})

fastify.get('/entry/:id/references', (req, res) => {
    // Mock references response
    res.send({ 
        references: [],
        usedBy: []
    })
})

// Health check endpoint
fastify.get('/health', (req, res) => {
    res.send({ status: 'ok', timestamp: new Date().toISOString() })
})

fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    console.log(`🚀 Server running at ${address}`)
}) 