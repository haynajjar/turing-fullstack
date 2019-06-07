
function ShoppingCart(cb) {
	return {
		tableName: 'shopping_cart',
		idAttribute: 'item_id',
		// products get products from shopping cart
		product:  function() {
			return this.belongsTo(cb().Product,'product_id','product_id')
		}
	}
}



module.exports= ShoppingCart