'use strict'

module.exports = function (fastify, opts, next) {
 

  fastify.post('/signup', async (request, reply)=>{

  	const {name,email,password} = JSON.parse(request.body)
  	if(!(name && email && password)){
  		reply.send({success: false, message: 'Missing credentials, all name, email and password are required'})
  		return;
  	}
  	const Customer = fastify.models.Customer
  	const user = await Customer.forge({name,email,password}).save()
  	const token = fastify.jwt.sign({email,name})
  	const customerRes = user.serialize({ shallow: true })
  	reply.send({success: true, customer: {email: customerRes.email,name: customerRes.name,token}})

  })

  fastify.post('/auth', async (request, reply)=>{

  	const Customer = fastify.models.Customer
  	const {email,password} = JSON.parse(request.body)
  	try {
  		const customer = await Customer.login(email,password)
  		const token = fastify.jwt.sign({email,name: customer.name})
  		const customerRes = customer.serialize({ shallow: true })
  		reply.send({success: true, customer: {email: customerRes.email,name: customerRes.name,token}})
  	}catch(e){
  		reply.send({error: e})
  	}

  })



  next()
}
