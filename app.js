'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')
const fastifyNext = require('fastify-nextjs')
const bookshelf = require('fastify-bookshelfjs');

module.exports = function (fastify, opts, next) {
  
  fastify.register(
  bookshelf,
    {
      client: 'mysql',
       connection: {
        host     : process.env.MYSQL_HOST,
        user     : process.env.MYSQL_USER,
        password : process.env.MYSQL_PASSWORD,
        database : process.env.MYSQL_DATABASE,
        charset  : 'utf8'
      }
    },
    console.error,
  );


  fastify
  .register(fastifyNext,{
      dir: './frontend'
    }
  )


  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in services
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({}, opts)
  })

  // Make sure to call next when done
  next()
}
