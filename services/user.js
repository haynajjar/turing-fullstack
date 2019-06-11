'use strict'

module.exports = function (fastify, opts, next) {
 
  function getAddress(args){
    return { address_1: args.address_1,
              address_2: args.address_2,
              city: args.city,
              postal_code: args.postal_code,
              country: args.country,
              shipping_region_id: args.shipping_region_id
            }
  }


  fastify.post('/signup', async (request, reply)=>{

  	const {name,email,password} = JSON.parse(request.body)
  	if(!(name && email && password)){
  		reply.send({success: false, message: 'Missing credentials, all name, email and password are required'})
  		return;
  	}
    try{
    	const Customer = fastify.models.Customer
    	const user = await Customer.forge({name,email,password}).save()
    	const token = fastify.jwt.sign({email,name,customer_id: user.id})
    	const customerRes = user.serialize({ shallow: true })
      const address = getAddress(customerRes)
      reply.send({success: true, customer: {customer_id: customerRes.customer_id,email: customerRes.email,name: customerRes.name,token,address}})

    }catch(e){
      if(e.code == 'ER_DUP_ENTRY'){
        reply.send({error: 'The email already exists', status: 400})
      }else {
        console.error(e)
        reply.send({error: 'Problem detected, please check your data or try again later'})
      }
    }

  })

  fastify.post('/auth', async (request, reply)=>{

    const Customer = fastify.models.Customer
    const {email,password} = JSON.parse(request.body)
    try {
      const customer = await Customer.login(email,password)
      //this will sign the user informations we can then access directely request.user.email or request.user.customer_id , see plugins/authenticate.js
      const token = fastify.jwt.sign({email,name: customer.name,customer_id: customer.customer_id})
      const address = getAddress(customer)
      reply.send({success: true, customer: {customer_id: customer.customer_id,email: customer.email,name: customer.name,token,address,current_order: customer.current_order}})
    }catch(e){
      reply.send({error: e.message})
    }

  })

    fastify.route({
      method: 'POST',
      url: '/user/address',
      preHandler: fastify.auth([
        fastify.authenticate
      ]),
      handler: async (request, reply)=>{
        const args = JSON.parse(request.body)
        const Customer = fastify.models.Customer
        try{
           let customer = await Customer.where({customer_id: request.user.customer_id}).fetch()
            await customer.save(getAddress(args))
            reply.send({success: true})
          }catch(e){
            reply.send({error: e.message})
          }
      }

    })



  next()
}
