
function Product(cb) {
	return {
		tableName: 'product',
		
		categories: function() {
			return this.belongsToMany(cb().Category,'product_category','category_id','product_id','product_id','category_id')
		},
		attribute_values: function() {
			return this.hasMany(cb().AttributeValue).through(cb().ProductAttribute)
		}
	}
}



module.exports= Product