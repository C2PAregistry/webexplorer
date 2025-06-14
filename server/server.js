const fastify = require('fastify')({
    logger: true
})

fastify.register(require('@fastify/mysql'), {
    connectionString: ''
})

fastify.register(require('@fastify/cors'), {
    origin: '*'
})

fastify.get('/entry', function (req, res) {
    fastify.mysql.query('SELECT * from entry',
        function (err, result) {
            res.send(result || err)
        }
    )
})

fastify.get('/entry/:id', function (req, res) {
    fastify.mysql.query(`SELECT * from entry WHERE id = ${req.params.id}`,
        function (err, result) {
            if (err) {
                return res.send(err)
            } else if (result.length !== 1) {
                res.code(404)
                return res.send()
            } else {
                return res.send(result[0])
            }
        }
    )
})

fastify.get('/entry/:id/references', (req, res) => {
    fastify.mysql.query(`SELECT * from reference WHERE entryId = ${req.params.id}`,
        function (err, children) {
            fastify.mysql.query(`SELECT * from reference`, function (err, parents) {
                const references = children.map((r) => {
                    r.assertion = JSON.parse(r.assertion)
                    return r
                })

                const referrers = parents.filter((p) => {
                    p.assertion = JSON.parse(p.assertion)
                    return p.assertion.data.entryId === parseInt(req.params.id)
                })

                let usedBy = []
                referrers.forEach(p => {
                    fastify.mysql.query(`SELECT * from entry WHERE id = ${p.entryId}`, (err, par) => {
                        usedBy.push(par[0])
                    })
                });

                // dang
                setTimeout(() => {
                    return res.send({ references, usedBy })
                }, 1000);
            })
        }
    )
})

fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})
