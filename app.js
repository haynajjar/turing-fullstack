'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')
const fastifyNext = require('fastify-nextjs')
const bookshelf = require('fastify-bookshelfjs');
const models = require('./models')


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
  ).after(()=> {
      fastify.bookshelf.plugin('pagination')
      fastify.models = models.load(fastify.bookshelf)
  })


  fastify
  .register(fastifyNext,{
      dir: './frontend'
    }
  )

  fastify.register(require('fastify-jwt'), {
    secret: 'xs8zSStxdgldfD0kjbsga0z7eosdrdfkdFDGD'
  })

  fastify.register(require('fastify-auth'))

  fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'frontend/static'),
    prefix: '/static/', 
  })

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
