export const validate ={
	
	required: function (name, value, helper) {
		return value ? {success: true, helper: helper} : {success: false, helper: `${name} field is required`}
	},
	// you can add fields like name , email ... and then use then in call method 
	email: function (name,value,helper) {
		const valid = (name,value,helper) => {
			const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    		return re.test(String(value).toLowerCase()) ? {success: true, helper: helper} : {success: false, helper: `${name} is not valid`}
		}
		const required = this.required(name,value,helper)
		return required.success ? (valid(name,value,helper)) : required
	},

	password: function (name,value,helper) {
		const valid = (name,value,helper) => {
    		return value.length>5 ? {success: true, helper: helper} : {success: false, helper: `${name} should have at least 6 characters`}
		}
		const required = this.required(name,value,helper)
		return required.success ? (valid(name,value,helper)) : required
	},
	postal_code: function(name,value,helper){
		const re = /^\d+$/
		return re.test(value) ? {success: true,helper: helper} : {success: false, helper: 'invalid zip code format'}
	},
	cvc: function(name,value,helper){
		const re = /^\d{3}$/
		return re.test(value) ? {success: true,helper: helper} : {success: false, helper: 'wrong format for cvc'}
	},
	credit_card: function(name,value,helper){
		const re = /\d{16}$/
		return re.test(value) ? {success: true,helper: helper} : {success: false, helper: 'wrong format for card number'}
	},
	expiry_date: function(name,value,helper){
		const re = /\d{2}\/\d{2}/
		return re.test(value) ? {success: true,helper: helper} : {success: false, helper: 'expiry date needs 4 digits mm/yy'}
	},
	// check if error exist  is error messages list
	// return true or false
	error: function (errorMessages) {
		for(let k in errorMessages){
			if(k.endsWith('_error') && errorMessages[k]){
				return true
			}
		}
		return false
	},
	call: function(name,value,helper,field){
		field = field || name
		switch (field){
			 case 'email': 
			 		return this.email(name,value,helper)
			 case 'password':
			 		return this.password(name,value,helper)			 
			 case 'postal_code':
			 		return this.postal_code(name,value,helper)			 
			 case 'cvc':
			 		return this.cvc(name,value,helper)
			 case 'expiry_date':
			 		return this.expiry_date(name,value,helper)
			 case 'card_number':
			 		return this.credit_card(name,value,helper)
			 default:
			 		return this.required(name,value,helper)
		}
	}


}

