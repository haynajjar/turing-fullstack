
function ProductAttribute(cb) {
	return {
		tableName: 'product_attribute',
		
		product: function() {
			return this.belongsTo(cb().Product, 'product_id', 'product_id')
		},
		attribute_value: function() {
			return this.belongsTo(cb().AttributeValue, 'attribute_value_id','attribute_value_id')
		}
	}
}



module.exports= ProductAttribute