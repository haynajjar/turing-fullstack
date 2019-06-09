
function OrderRecord(cb) {
	return {
		tableName: 'orders',
		idAttribute: 'order_id',
		order_details: function() {
			return this.hasMany(cb().OrderDetail,'order_id','order_id')
		},
		shipping: function() {
			return this.hasOne(cb().Shipping,'shipping_id','shipping_id')
		},
		tax: function() {
			return this.hasOne(cb().Tax,'tax_id','tax_id')
		},

	}
}

module.exports = OrderRecord