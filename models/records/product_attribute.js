
function ProductAttribute(cb) {
	return {
		tableName: 'product_attribute',
		
		product: function() {
			return this.belongsTo(cb().Product)
		},
		attribute_value: function() {
			return this.belongsTo(cb().AttributeValue)
		}
	}
}



module.exports= ProductAttribute