
'use strict'

const fp = require('fastify-plugin')

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(function (fastify, opts, next) {
  fastify.decorate("authenticate", async function(request, reply) {
    try {
      request.headers.authorization= 'Bearer '+request.headers['user-key']
      // this will add the object user to the request property
      // we can then access directely request.user.email or request.user.customer_id
      await request.jwtVerify()
      
    } catch (err) {
      reply.send(err)
    }
  })
  next()
})

