'use strict'

// This file contains code that we reuse
// between our tests.

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const bookshelf = require('fastify-bookshelfjs');
const models = require('../models/index')

const App = require('../app_test')

// Fill in this config with all the configurations
// needed for testing the application
function config () {
  return {}
}

// automatically build and tear down our instance
function build () {
  const app = Fastify()

  initDb(app)

  app.register(fp(App), config())

  return app
}

function initDb(app){  
  app.register(
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
      app.bookshelf.plugin('pagination')
      app.models = models.load(app.bookshelf)
  })
}

module.exports = {
  config,
  build
}

