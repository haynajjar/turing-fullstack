'use strict'

const tap = require('tap')
const { build } = require('../helper')
const supertest = require('supertest')

const userData = {
	name: 'testuser',
	email: 'testuserXXX@app.com',
	password: 'testuserXXX'
}

const addressData = { 
	address_1: "address_1",
	address_2: "address_2",
	city: "city",
	postal_code: 12346,
	country: "country",
	shipping_region_id: 1
}

async function setup(t){
	const fastify = build()
	await fastify.ready()
	t.tearDown(() => {
		fastify.bookshelf.knex.destroy(() => fastify.close())
	})
	return fastify
}

tap.test('Should `/signup` new user', async (t) => {
  const fastify = await setup(t)
  // check if user exists and remove it , in case the test didn't made it
  // clean up
  await fastify.models.Customer.where({email: userData.email}).destroy()

  const response = await supertest(fastify.server)
    .post('/signup')
    .send(userData)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
  t.equal(response.body.success,  true )

}).then( t => {
	t.test('Should return 400 status on existing user', async t => {
		const fastify = await setup(t)

  		const response = await supertest(fastify.server)
  		.post('/signup')
    	.send(userData)
  		t.equal(response.body.status,  400 )
	})

	let token = null
	t.test('Should get token from POST /auth', async t => {
		const fastify = await setup(t)

  		const response = await supertest(fastify.server)
  		.post('/auth')
    	.send(userData)
    	.expect(200)
    	token = response.body.customer.token

  		t.equal(response.body.success,  true )

	}).then( t => {
		t.test('Should pass with token POST /user/address update', async t => {
			const fastify = await setup(t)

	  		const response = await supertest(fastify.server)
	  		.post('/user/address')
	  		.set('user-key',token)
	    	.send(addressData)
	    	.expect(200)
	  		t.equal(response.body.success,  true )
		})

		t.test('Shoulf fail without token POST /user/address update', async t => {
			const fastify = await setup(t)

	  		const response = await supertest(fastify.server)
	  		.post('/user/address')
	    	.send(addressData)
	    	.expect(401)
	  		t.equal(response.body.error, 'Unauthorized' )
		})
	})
})


