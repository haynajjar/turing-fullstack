'use strict'

module.exports = function (fastify, opts, next) {
 
  function getAddress(args){
    return { address_1: args.address_1,
              address_2: args.address_2,
              city: args.city,
              region: args.region,
              postal_code: args.postal_code,
              country: args.country,
              shipping_region_id: args.shipping_region_id,
              day_phone: args.day_phone,
              eve_phone: args.eve_phone,
              mob_phone: args.mob_phone
            }
  }


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
    const address = getAddress(customerRes)
    reply.send({success: true, customer: {customer_id: customerRes.customer_id,email: customerRes.email,name: customerRes.name,token,address}})

  })

  fastify.post('/auth', async (request, reply)=>{

    const Customer = fastify.models.Customer
    const {email,password} = JSON.parse(request.body)
    try {
      const customer = await Customer.login(email,password)
      const token = fastify.jwt.sign({email,name: customer.name})
      const customerRes = customer.serialize({ shallow: true })
      const address = getAddress(customerRes)
      reply.send({success: true, customer: {customer_id: customerRes.customer_id,email: customerRes.email,name: customerRes.name,token,address}})
    }catch(e){
      reply.send({error: e})
    }

  })

  fastify.post('/user/address', async (request, reply)=>{
    const args = JSON.parse(request.body)
    const Customer = fastify.models.Customer
    try{
       let customer = await Customer.where({customer_id: args.customer_id}).fetch()
        customer.save(getAddress(args))
        return {success: true}
      }catch(e){
        return {error: e.message}
      }

  })



  next()
}
