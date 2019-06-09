
function OrderDetailRecord(cb) {
	return {
		tableName: 'order_detail',
		idAttribute: 'item_id',		
		product: function() {
			return this.hasOne(cb().Product,'product_id','product_id')
		}
	}
}

module.exports = OrderDetailRecord