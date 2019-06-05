'use strict'

module.exports = function (fastify, opts, next) {
  fastify.get('/', function (request, reply) {
    reply.send({ root: true })
  })

  fastify.next('/shop')

  fastify.get('/graphql', async (request,reply) => {
  	let queryStr = request.query.query
  	let result = await fastify.models.query(queryStr)
  	reply.send(result)
  })

  next()
}
