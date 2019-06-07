
function Product(cb) {
	return {
		tableName: 'product',
		idAttribute: 'product_id',
		categories: function() {
			return this.belongsToMany(cb().Category,'product_category','product_id','category_id','product_id','category_id')
		},
		attribute_values: function() {
			return this.belongsToMany(cb().AttributeValue,'product_attribute','product_id','attribute_value_id','product_id','attribute_value_id')
		},
		shopping_carts: function(){
			return this.hasMany(cb().ShoppingCart,'product_id','product_id')
		}

	}
}



module.exports= Product