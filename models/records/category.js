
function Category(cb) {
	return {
		tableName: 'category',
		
		products: function() {
			return this.belongsToMany(cb().Product,'product_category','category_id','product_id','category_id','product_id')
		}
	}
}



module.exports= Category