function CustomerRecord() {
	return {
		
			tableName: 'customer',
			idAttribute: 'customer_id'
	}
}

function CustomerMethods() {
	return {
		login: function(email, password){
			return new Promise((resolve, reject) => {
			    if (!email || !password) reject('Email and password are both required');
			    return new this({email: email.toLowerCase().trim()}).fetch({require: true}).tap(function(customer) {
			      // the password is not hashed , but it should be
			      if(password == customer.get('password')){
			      	resolve(customer)
			      }else{
			      	reject('Invalid password');
			      }   
			    });
		  })
		}
	}
}



module.exports= {CustomerRecord, CustomerMethods}