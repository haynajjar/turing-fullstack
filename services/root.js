'use strict'

module.exports = function (fastify, opts, next) {
  fastify.get('/', function (req, reply) {
    reply.send({ root: true })
  })



  fastify.next('/shop')
  fastify.next('/product')
  fastify.next('/product/:id', (app, req,reply) => {
  	app.render(req.raw, reply.res, '/product', req.params, {})
  })

  fastify.post('/graphql', async (req,reply) => {
  	let queryStr = req.body.query
  	let variables = req.body.variables
  	let result = await fastify.models.query(queryStr,variables)
  	//console.log("RESULT .. ",result)
  	reply.send(result)
  })

  next()
}
