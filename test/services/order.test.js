'use strict'

const tap = require('tap')
const { build } = require('../helper')
const supertest = require('supertest')

const userData = {
	name: 'testuser2',
	email: 'testuserXXX2@app.com',
	password: 'testuserXXX2'
}

const cartData = { 
	cart_id: "testcart_xxxxxxxxxxxxxxxxxxxxxxx",
	product_id: 1,
	quantity: 2,
	attributes: "Size: S, Color: XL",
	added_on: new Date()
}

async function setup(t){
	const fastify = build()
	await fastify.ready()
	t.tearDown(() => {
		fastify.bookshelf.knex.destroy(() => fastify.close())
	})
	return fastify
}

let token = null
tap.test('Should `/auth` new user', async (t) => {
  const fastify = await setup(t)
  // check if user exists and remove it , in case the test didn't made it
  // clean up
  let customer = await fastify.models.Customer.forge({email: userData.email}).fetch()
  if(customer){
  	await customer.destroy()
  }
  await fastify.models.Customer.forge(userData).save()
  const response = await supertest(fastify.server)
    .post('/auth')
    .send(userData)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    token = response.body.customer.token
  	t.equal(response.body.success,  true )

}).then( t => {
	let order_id = null
	t.test('Should POST /order from shopping_cart', async t => {
		const fastify = await setup(t)
		//clean test cart
		await fastify.models.ShoppingCart.where({cart_id: cartData.cart_id}).destroy()
		// create new cart data
		await fastify.models.ShoppingCart.forge(cartData).save()
  		const response = await supertest(fastify.server)
  		.post('/order')
  		.set('user-key',token)
    	.send({cart_id: cartData.cart_id, shipping_id: 2})
    	.expect(200)
    	order_id = response.body.order_id
  		t.equal(response.body.success,  true )
  		// check if shopping cart was removed 
  		let sc = await fastify.models.ShoppingCart.forge({cart_id: cartData.cart_id}).fetch()
  		t.equal(sc, null)

	}).then(t => {
		t.test('Should be able to POST /order/cancel', async t => {
			const fastify = await setup(t)
			const response = await supertest(fastify.server)
	  		.post('/order/cancel')
	  		.set('user-key',token)
	    	.send({order_id: order_id})
	    	.expect(200)
  			t.equal(response.body.success,  true )
  			// check order status
  			let order = await fastify.models.Order.forge({order_id: order_id}).fetch()
  			t.equal(order.toJSON().status, 2 )
		})
		
	})

	
})


