'use strict'

const stripe = require("stripe")(process.env.STRIPE_SK);

module.exports = function (fastify, opts, next) {
  // ORDER STATUS
  // status 0 created, 1 confirmed, 2 cancelled
  
  fastify.route({
      method: 'POST',
      url: '/order',
      preHandler: fastify.auth([
        fastify.authenticate
      ]),
      handler: async (request, reply)=>{
        const args = JSON.parse(request.body)
        const knex = fastify.bookshelf.knex
        try{
           // tax is by default 1, otherwise it should be a store configuration variable
            const tax_id =1
            const result = await knex.raw('CALL shopping_cart_create_order(?,?,?,?)',[args.cart_id,args.customer_id,args.shipping_id,tax_id])
            // TODO Need update
            // this looks bizzar, but mysql too!, (just for now)
            let orderId = result[0][0]['orderId'] || result[0][0][0]['orderId']
            return {success: true,order_id: orderId}
          }catch(e){
            if(e.code == 'ER_BAD_NULL_ERROR'){
              return {error: 'You need to get some products from the store'}
            }
            return {error: 'Internal Problem Detected'}
            
          }
        }
    })

    fastify.route({
      method: 'POST',
      url: '/order/cancel',
      preHandler: fastify.auth([
        fastify.authenticate
      ]),
      handler: async (request, reply)=>{
      const Order = fastify.models.Order
      const args = JSON.parse(request.body)
      try{
          await Order.forge({order_id: args.order_id}).save({status: 2})
          return  {success: true}
        }catch(e){
          console.error(e)
          return {error: 'Problem while trying to cancel your order, please try again later'}
        }
      }
    })


    fastify.route({
      method: 'POST',
      url: '/order/charge',
      preHandler: fastify.auth([
        fastify.authenticate
      ]),
      handler: async (request, reply)=>{

        const args = JSON.parse(request.body)
        let exp_date = !!args.expiry_date && args.expiry_date.split('/')
        // create token 
        try{
          const token= await stripe.tokens.create({
            card: {
              number: args.card_number,
              exp_month: exp_date[0],
              exp_year: exp_date[1],
              cvc: args.cvc
            }
          });

          // get order total from db 
          const order = await fastify.models.Order.forge({order_id: args.order_id}).fetch()

          const total = Math.floor(order.serialize().total_amount*100)

          const charge = await stripe.charges.create({
            amount: total,
            currency: "usd",
            source: token.id, // obtained with Stripe.js
            description: "Charge "+args.card_name,
            metadata: {order_id: args.order_id}
          })

          // update order status to confirmed
          await order.save({status: 1})
          
          return {success: true}

        }catch(e){
          return {error: e.message}
        }
      }

    })



  next()
}
