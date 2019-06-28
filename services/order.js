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
        const args = typeof request.body === "string"  ? JSON.parse(request.body) : request.body
        const knex = fastify.bookshelf.knex
        try{
           // tax is by default 1, otherwise it should be a store configuration variable
            const tax_id =1
            const result = await knex.raw('CALL shopping_cart_create_order(?,?,?,?)',[args.cart_id,request.user.customer_id,args.shipping_id,tax_id])
            let orderId = result[0][0][0]['orderId']
            reply.send({success: true,order_id: orderId})
          }catch(e){
            if(e.code == 'ER_BAD_NULL_ERROR'){
              reply.send({error: 'You need to get some products from the store',status: 400})

            }else{
              reply.send({error: 'Internal Problem Detected', status: 500})
            }
            
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
      const args = typeof request.body === "string"  ? JSON.parse(request.body) : request.body
      try{
          const order = await Order.forge({order_id: args.order_id, customer_id: request.user.customer_id}).fetch()
          if(order){
            //order.set('status',2)
            order.save({status: 2})
            reply.send({success: true})
          }else{
            reply.send({error: "Can't find this order", status: 400})
          }
        }catch(e){
          console.error(e)
          reply.send({error: 'Problem while trying to cancel your order, please try again later', status: 500})
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

        const args = typeof request.body === "string"  ? JSON.parse(request.body) : request.body
        let exp_date = !!args.expiry_date && args.expiry_date.split('/')
        // get order total from db 
        try{
          const order = await fastify.models.Order.forge({order_id: args.order_id, customer_id: request.user.customer_id}).fetch()
          if(!order){
            reply.send({error: "can't find your order" })
            return;
          }
          
          const token= await stripe.tokens.create({
            card: {
              number: args.card_number,
              exp_month: exp_date[0],
              exp_year: exp_date[1],
              cvc: args.cvc
            }
          });

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
          
          reply.send({success: true})

        }catch(e){
          reply.send({error: e.message})
        }
      }

    })



  next()
}
