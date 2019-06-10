function CustomerRecord(cb) {
	return {
		
			tableName: 'customer',
			idAttribute: 'customer_id',
			orders: function(){
				return this.hasMany(cb().Order,'customer_id','customer_id')
			}
	}
}

function CustomerMethods() {
	return {
		login: function(email, password){
			return new Promise((resolve, reject) => {
			    if (!email || !password) reject({message: 'Email and password are both required'});

			    return new this({email: email.toLowerCase().trim()}).fetch({withRelated: ['orders']}).tap(async (customer) => {
			      // the password is not hashed , but it should be
			      if(customer && password == customer.get('password')){
			      	// Fetch current order when the user login
			      	// this maybe a bad idea, but it's going to save me requests and time in the front
			      	// TODO - we should create a separate service 
			      	const currentOrder = await customer.related('orders').findWhere({status: 0}) 
			      	const opt = {shallow: true}
			      	const customerRes = Object.assign(customer.serialize(opt),{current_order: currentOrder && currentOrder.serialize(opt).order_id})
			      	resolve(customerRes)
			      }else{
			      	reject({message: 'Wrong email or password'});
			      }   
			    });
		  })
		}
	}
}



module.exports= {CustomerRecord, CustomerMethods}